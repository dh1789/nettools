"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface CertInfo {
  commonName: string;
  issuerName: string;
  notBefore: string;
  notAfter: string;
  daysUntilExpiry: number;
}

interface SslResult {
  domain: string;
  httpsReachable: boolean;
  responseTimeMs: number | null;
  httpError: string | null;
  cert: CertInfo | null;
  certError: string | null;
}

function isValidDomain(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(trimmed);
}

function parseDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/\/.*$/, "");
  domain = domain.replace(/:\d+$/, "");
  return domain;
}

function calcDaysUntilExpiry(notAfter: string): number {
  const expiry = new Date(notAfter);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function expiryColor(days: number): string {
  if (days < 7) return "#ef4444";
  if (days <= 30) return "#f59e0b";
  return "#10b981";
}

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "1rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const resultRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem 0",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
};

const resultLabelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--text-secondary, #6b7280)",
};

const resultValueStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontFamily: "monospace",
  fontWeight: 600,
  color: "var(--text-primary, #111)",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.625rem 1.5rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  background: "var(--text-primary, #111)",
  color: "var(--surface, #fff)",
  cursor: "pointer",
};

export function SslChecker() {
  const { t } = useLocale();
  const [domain, setDomain] = useState("google.com");
  const [result, setResult] = useState<SslResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCheck = useCallback(async () => {
    const parsed = parseDomain(domain);
    if (!isValidDomain(parsed)) {
      setError(t({
        ko: "유효하지 않은 도메인입니다. (예: google.com)",
        en: "Invalid domain. (e.g., google.com)",
      }));
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(
        `/api/ssl-check?domain=${encodeURIComponent(parsed)}`,
        { signal: controller.signal },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: SslResult = await res.json();
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes("abort")
          ? t({ ko: "요청 시간 초과 (25초)", en: "Request timed out (25s)" })
          : t({ ko: "SSL 확인 중 오류가 발생했습니다.", en: "Error during SSL check." }),
      );
    } finally {
      setLoading(false);
    }
  }, [domain, t]);

  const copyResults = () => {
    if (!result) return;
    const lines: string[] = [
      `Domain: ${result.domain}`,
      `HTTPS: ${result.httpsReachable ? "Reachable" : "Failed"}`,
    ];
    if (result.responseTimeMs !== null) {
      lines.push(`Response Time: ${result.responseTimeMs}ms`);
    }
    if (result.httpError) {
      lines.push(`Error: ${result.httpError}`);
    }
    if (result.cert) {
      lines.push(`Common Name: ${result.cert.commonName}`);
      lines.push(`Issuer: ${result.cert.issuerName}`);
      lines.push(`Not Before: ${result.cert.notBefore}`);
      lines.push(`Not After: ${result.cert.notAfter}`);
      lines.push(`Days Until Expiry: ${result.cert.daysUntilExpiry}`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "도메인", en: "Domain" })}
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="google.com"
            style={{
              ...inputStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
              flex: 1,
            }}
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? t({ ko: "확인중...", en: "Checking..." })
              : t({ ko: "확인", en: "Check" })}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t({
            ko: "도메인을 입력하세요 (예: google.com, github.com)",
            en: "Enter a domain name (e.g., google.com, github.com)",
          })}
        </p>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            background: "var(--info-bg, #eff6ff)",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #6b7280)",
            }}
          >
            {t({
              ko: "SSL 인증서 정보를 확인하고 있습니다...",
              en: "Checking SSL certificate information...",
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
              }}
            >
              {t(T.results)}
            </h2>
            <button
              onClick={copyResults}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: copied ? "#10b981" : "transparent",
                color: copied ? "#fff" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? t(T.copied) : t(T.copyAll)}
            </button>
          </div>

          {/* HTTPS Connection Status */}
          <div
            style={{
              background: result.httpsReachable
                ? "var(--result-bg, #f0fdf4)"
                : "#fef2f2",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                marginBottom: "0.375rem",
              }}
            >
              {t({ ko: "HTTPS 연결", en: "HTTPS Connection" })}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: result.httpsReachable ? "#10b981" : "#ef4444",
              }}
            >
              {result.httpsReachable
                ? t({ ko: "연결 성공", en: "Reachable" })
                : t({ ko: "연결 실패", en: "Failed" })}
            </div>
            {result.responseTimeMs !== null && (
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary, #6b7280)",
                  marginTop: "0.375rem",
                }}
              >
                {t({ ko: "응답 시간", en: "Response Time" })}: {result.responseTimeMs}ms
              </div>
            )}
            {result.httpError && (
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "#ef4444",
                  marginTop: "0.375rem",
                }}
              >
                {result.httpError}
              </div>
            )}
          </div>

          {/* Certificate Info from crt.sh */}
          {result.cert && (
            <div
              style={{
                background: "var(--result-bg, #f0fdf4)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-primary, #111)",
                  marginBottom: "0.5rem",
                }}
              >
                {t({ ko: "인증서 정보 (Certificate Transparency)", en: "Certificate Info (Certificate Transparency)" })}
              </div>
              <div style={resultRowStyle}>
                <span style={resultLabelStyle}>
                  {t({ ko: "일반 이름 (CN)", en: "Common Name (CN)" })}
                </span>
                <span style={resultValueStyle}>{result.cert.commonName}</span>
              </div>
              <div style={resultRowStyle}>
                <span style={resultLabelStyle}>
                  {t({ ko: "발급 기관", en: "Issuer" })}
                </span>
                <span style={{ ...resultValueStyle, fontFamily: "inherit", fontSize: "0.8125rem" }}>
                  {result.cert.issuerName}
                </span>
              </div>
              <div style={resultRowStyle}>
                <span style={resultLabelStyle}>
                  {t({ ko: "유효 시작일", en: "Not Before" })}
                </span>
                <span style={resultValueStyle}>{result.cert.notBefore}</span>
              </div>
              <div style={resultRowStyle}>
                <span style={resultLabelStyle}>
                  {t({ ko: "만료일", en: "Not After" })}
                </span>
                <span style={resultValueStyle}>{result.cert.notAfter}</span>
              </div>
              <div style={{ ...resultRowStyle, borderBottom: "none" }}>
                <span style={resultLabelStyle}>
                  {t({ ko: "만료까지 남은 일수", en: "Days Until Expiry" })}
                </span>
                <span
                  style={{
                    ...resultValueStyle,
                    color: expiryColor(result.cert.daysUntilExpiry),
                  }}
                >
                  {result.cert.daysUntilExpiry}{t({ ko: "일", en: " days" })}
                </span>
              </div>
            </div>
          )}

          {/* Certificate error */}
          {result.certError && (
            <div
              style={{
                background: "#fef2f2",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: "#ef4444",
              }}
            >
              {result.certError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
