interface Fetcher {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: Fetcher;
}

interface CertInfo {
  commonName: string;
  issuerName: string;
  notBefore: string;
  notAfter: string;
  daysUntilExpiry: number;
}

interface SslCheckResult {
  domain: string;
  httpsReachable: boolean;
  responseTimeMs: number | null;
  httpError: string | null;
  cert: CertInfo | null;
  certError: string | null;
}

function calcDaysUntilExpiry(notAfter: string): number {
  const expiry = new Date(notAfter);
  const now = new Date();
  return Math.floor((expiry.getTime() - now.getTime()) / 86400000);
}

async function checkHttpsReachability(domain: string): Promise<{
  reachable: boolean;
  responseTimeMs: number | null;
  error: string | null;
}> {
  const start = Date.now();
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://${domain}`, {
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(tid);
    await res.body?.cancel();
    return { reachable: true, responseTimeMs: Date.now() - start, error: null };
  } catch (err) {
    clearTimeout(tid);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      reachable: false,
      responseTimeMs: null,
      error: msg.includes('abort') ? 'Connection timed out (8s)' : msg,
    };
  }
}

async function getCertFromCrtSh(domain: string): Promise<{
  cert: CertInfo | null;
  error: string | null;
}> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(
      `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`,
      { signal: controller.signal }
    );
    clearTimeout(tid);

    if (!res.ok) {
      return { cert: null, error: `crt.sh returned HTTP ${res.status}` };
    }

    // Read up to 5MB to handle large CT log responses for popular domains
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let text = '';
    const MAX_BYTES = 5 * 1024 * 1024;

    try {
      while (text.length < MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
    } finally {
      reader.cancel();
    }

    // Parse possibly-truncated JSON array
    let data: Array<Record<string, unknown>>;
    try {
      data = JSON.parse(text);
    } catch {
      const lastBrace = text.lastIndexOf('}');
      if (lastBrace < 0) {
        return { cert: null, error: 'Invalid response from crt.sh' };
      }
      try {
        data = JSON.parse(text.slice(0, lastBrace + 1) + ']');
      } catch {
        return { cert: null, error: 'Failed to parse certificate data from crt.sh' };
      }
    }

    if (!Array.isArray(data) || data.length === 0) {
      return { cert: null, error: 'No Certificate Transparency logs found for this domain' };
    }

    // Sort by id descending to get the most recently logged certificate
    const sorted = data.sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
    );
    const latest = sorted[0];
    const notAfter = String(latest.not_after || '');

    return {
      cert: {
        commonName: String(latest.common_name || domain),
        issuerName: String(latest.issuer_name || 'N/A'),
        notBefore: String(latest.not_before || 'N/A'),
        notAfter,
        daysUntilExpiry: notAfter ? calcDaysUntilExpiry(notAfter) : 0,
      },
      error: null,
    };
  } catch (err) {
    clearTimeout(tid);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('abort')) {
      return { cert: null, error: 'crt.sh request timed out (15s)' };
    }
    return { cert: null, error: msg };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/ssl-check') {
      const domain = url.searchParams.get('domain') || '';
      if (!domain) {
        return Response.json({ error: 'domain parameter is required' }, { status: 400 });
      }

      // Run HTTPS check and cert lookup in parallel
      const [httpsResult, certResult] = await Promise.all([
        checkHttpsReachability(domain),
        getCertFromCrtSh(domain),
      ]);

      const result: SslCheckResult = {
        domain,
        httpsReachable: httpsResult.reachable,
        responseTimeMs: httpsResult.responseTimeMs,
        httpError: httpsResult.error,
        cert: certResult.cert,
        certError: certResult.error,
      };

      return Response.json(result, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
