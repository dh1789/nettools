"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

interface HeadersResult {
  url: string;
  status: number;
  statusText: string;
  responseTimeMs: number;
  headers: Record<string, string>;
}

const SECURITY_HEADERS = new Set([
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "cross-origin-embedder-policy",
]);

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

export function HttpHeadersChecker() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeadersResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSecurity, setShowSecurity] = useState(false);

  const check = useCallback(async () => {
    let url = input.trim();
    if (!url) {
      setError(t({ ko: "URL을 입력하세요.", en: "Please enter a URL." }));
      return;
    }
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/http-headers?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const data: HeadersResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [input, t]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") check();
  };

  const statusColor = (status: number) => {
    if (status < 300) return "#10b981";
    if (status < 400) return "#f59e0b";
    if (status < 500) return "#ef4444";
    return "#6b7280";
  };

  const securityMissing = result
    ? [...SECURITY_HEADERS].filter((h) => !Object.keys(result.headers).some((k) => k.toLowerCase() === h))
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={labelStyle}>URL</label>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="https://example.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button style={buttonStyle} onClick={check} disabled={loading}>
            {loading ? t({ ko: "조회 중...", en: "Checking..." }) : t({ ko: "조회", en: "Check" })}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Status bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--surface-2, #f9fafb)",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "10px",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                fontFamily: "monospace",
                color: statusColor(result.status),
              }}
            >
              {result.status}
            </span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary, #6b7280)" }}>
              {result.statusText}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              {result.responseTimeMs}ms
            </span>
          </div>

          {/* Security header summary */}
          <div
            style={{
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowSecurity((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "var(--surface-2, #f9fafb)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
              }}
            >
              <span>
                {t({ ko: "보안 헤더", en: "Security Headers" })}
                &nbsp;
                <span style={{ color: "#10b981" }}>
                  {SECURITY_HEADERS.size - securityMissing.length}
                </span>
                {" / "}
                <span style={{ color: "var(--text-secondary, #6b7280)" }}>
                  {SECURITY_HEADERS.size}
                </span>
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                {showSecurity ? "▲" : "▼"}
              </span>
            </button>
            {showSecurity && (
              <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {[...SECURITY_HEADERS].map((h) => {
                  const present = Object.keys(result.headers).some((k) => k.toLowerCase() === h);
                  return (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: present ? "#10b981" : "#ef4444", fontSize: "0.875rem" }}>
                        {present ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.8125rem",
                          color: present ? "var(--text-primary, #111)" : "var(--text-secondary, #6b7280)",
                        }}
                      >
                        {h}
                      </span>
                    </div>
                  );
                })}
                {securityMissing.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "#fef3c7",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      color: "#92400e",
                    }}
                  >
                    {t({
                      ko: `${securityMissing.length}개 보안 헤더가 누락되었습니다.`,
                      en: `${securityMissing.length} security header(s) missing.`,
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All headers */}
          <div
            style={{
              background: "var(--surface-2, #f9fafb)",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "10px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--text-secondary, #6b7280)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              {t({ ko: "응답 헤더", en: "Response Headers" })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {Object.entries(result.headers).map(([key, value]) => {
                const isSec = SECURITY_HEADERS.has(key.toLowerCase());
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "0.4rem 0",
                      borderBottom: "1px solid var(--border-light, #f3f4f6)",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.8125rem",
                        fontWeight: isSec ? 700 : 500,
                        color: isSec ? "#2563eb" : "var(--text-secondary, #6b7280)",
                        minWidth: "220px",
                        flexShrink: 0,
                        wordBreak: "break-all",
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.8125rem",
                        color: "var(--text-primary, #111)",
                        wordBreak: "break-all",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
