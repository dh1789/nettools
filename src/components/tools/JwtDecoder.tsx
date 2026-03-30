"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(padded);
  }
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJwt(token: string): { decoded: DecodedJwt | null; error: string } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { decoded: null, error: "Invalid JWT format (expected 3 parts separated by '.')" };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return {
      decoded: { header, payload, signature: parts[2] },
      error: "",
    };
  } catch (e) {
    return { decoded: null, error: `Parse error: ${e instanceof Error ? e.message : "unknown"}` };
  }
}

function formatTimestamp(unix: number): string {
  try {
    return new Date(unix * 1000).toISOString().replace("T", " ").replace("Z", " UTC");
  } catch {
    return String(unix);
  }
}

function getExpStatus(exp?: number): { label: string; color: string } | null {
  if (exp === undefined) return null;
  const now = Math.floor(Date.now() / 1000);
  if (exp < now) return { label: "만료됨 (Expired)", color: "#ef4444" };
  const diff = exp - now;
  if (diff < 300) return { label: `만료 임박 (${diff}s)`, color: "#f59e0b" };
  return { label: "유효함 (Valid)", color: "#10b981" };
}

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
  resize: "vertical",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const sectionStyle: React.CSSProperties = {
  background: "var(--result-bg, #f9fafb)",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  padding: "0.875rem 1rem",
  marginBottom: "0.75rem",
};

export function JwtDecoder() {
  const { t } = useLocale();
  const [token, setToken] = useState(SAMPLE_JWT);
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    const result = decodeJwt(token);
    setDecoded(result.decoded);
    setError(result.error);
  }, [token]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyBtnStyle = (key: string): React.CSSProperties => ({
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    border: "1px solid var(--border, #d1d5db)",
    borderRadius: "6px",
    background: copiedKey === key ? "#10b981" : "transparent",
    color: copiedKey === key ? "#fff" : "var(--text-secondary, #6b7280)",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const payload = decoded?.payload as Record<string, unknown> | undefined;
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const nbf = payload?.nbf as number | undefined;
  const expStatus = getExpStatus(exp);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "JWT 토큰 입력", en: "JWT Token Input" })}</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          style={{ ...inputStyle, minHeight: "100px" }}
          spellCheck={false}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={handleDecode}
          style={{
            padding: "0.625rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            background: "var(--text-primary, #111)",
            color: "var(--surface, #fff)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "디코드", en: "Decode" })}
        </button>
        <button
          onClick={() => { setToken(SAMPLE_JWT); setDecoded(null); setError(""); }}
          style={{
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-primary, #111)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "예제 로드", en: "Load Sample" })}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.8125rem",
            color: "#dc2626",
            fontFamily: "monospace",
          }}
        >
          {error}
        </div>
      )}

      {decoded && (
        <div>
          {/* Header */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t({ ko: "헤더 (Header)", en: "Header" })}
              </span>
              <button onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), "header")} style={copyBtnStyle("header")}>
                {copiedKey === "header" ? t(T.copied) : t(T.copy)}
              </button>
            </div>
            <pre style={{ margin: 0, fontSize: "0.8125rem", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", color: "var(--text-primary, #111)" }}>
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t({ ko: "페이로드 (Payload)", en: "Payload" })}
              </span>
              <button onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), "payload")} style={copyBtnStyle("payload")}>
                {copiedKey === "payload" ? t(T.copied) : t(T.copy)}
              </button>
            </div>
            <pre style={{ margin: 0, fontSize: "0.8125rem", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", color: "var(--text-primary, #111)" }}>
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>

            {/* Time claims */}
            {(exp !== undefined || iat !== undefined || nbf !== undefined) && (
              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border, #d1d5db)" }}>
                {expStatus && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)", minWidth: "60px" }}>exp</span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{formatTimestamp(exp!)}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: expStatus.color }}>({expStatus.label})</span>
                  </div>
                )}
                {iat !== undefined && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)", minWidth: "60px" }}>iat</span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{formatTimestamp(iat)}</span>
                  </div>
                )}
                {nbf !== undefined && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)", minWidth: "60px" }}>nbf</span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{formatTimestamp(nbf)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signature */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t({ ko: "서명 (Signature)", en: "Signature" })}
              </span>
              <button onClick={() => handleCopy(decoded.signature, "sig")} style={copyBtnStyle("sig")}>
                {copiedKey === "sig" ? t(T.copied) : t(T.copy)}
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "0.8125rem", fontFamily: "monospace", wordBreak: "break-all", color: "var(--text-primary, #111)" }}>
              {decoded.signature}
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
              {t({
                ko: "서명 검증은 서버 측 시크릿 키가 필요합니다. 브라우저에서는 구조 파싱만 수행합니다.",
                en: "Signature verification requires the secret key. Only structure parsing is performed in the browser.",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
