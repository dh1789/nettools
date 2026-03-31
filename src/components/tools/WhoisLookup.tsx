"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

interface WhoisResult {
  domain: string;
  registrar?: string;
  registrantName?: string;
  registrantOrg?: string;
  registrantEmail?: string;
  registrantCountry?: string;
  createdDate?: string;
  updatedDate?: string;
  expiryDate?: string;
  nameservers?: string[];
  status?: string[];
}

function parseDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/\/.*$/, "");
  d = d.replace(/:\d+$/, "");
  return d;
}

function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false;
  return /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/.test(domain);
}

function formatDate(raw?: string): string {
  if (!raw) return "-";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toISOString().split("T")[0];
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

const resultRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "0.5rem 0",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
  gap: "1rem",
};

const resultLabelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--text-secondary, #6b7280)",
  whiteSpace: "nowrap",
  flexShrink: 0,
  minWidth: "140px",
};

const resultValueStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontFamily: "monospace",
  fontWeight: 500,
  color: "var(--text-primary, #111)",
  textAlign: "right",
  wordBreak: "break-all",
};

export function WhoisLookup() {
  const { locale, t } = useLocale();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async () => {
    const domain = parseDomain(input);
    if (!isValidDomain(domain)) {
      setError(t({ ko: "유효한 도메인을 입력하세요.", en: "Please enter a valid domain." }));
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      const data: WhoisResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [input, t]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") lookup();
  };

  const rows: { label: { ko: string; en: string }; value: string | string[] | undefined }[] = result
    ? [
        { label: { ko: "도메인", en: "Domain" }, value: result.domain },
        { label: { ko: "등록 기관", en: "Registrar" }, value: result.registrar },
        { label: { ko: "등록자 이름", en: "Registrant Name" }, value: result.registrantName },
        { label: { ko: "등록자 조직", en: "Registrant Org" }, value: result.registrantOrg },
        { label: { ko: "등록자 이메일", en: "Registrant Email" }, value: result.registrantEmail },
        { label: { ko: "등록자 국가", en: "Registrant Country" }, value: result.registrantCountry },
        { label: { ko: "등록일", en: "Created" }, value: formatDate(result.createdDate) },
        { label: { ko: "갱신일", en: "Updated" }, value: formatDate(result.updatedDate) },
        { label: { ko: "만료일", en: "Expires" }, value: formatDate(result.expiryDate) },
        { label: { ko: "네임서버", en: "Nameservers" }, value: result.nameservers },
        { label: { ko: "상태", en: "Status" }, value: result.status },
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={labelStyle}>{t({ ko: "도메인", en: "Domain" })}</label>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="example.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button style={buttonStyle} onClick={lookup} disabled={loading}>
            {loading ? t({ ko: "조회 중...", en: "Looking up..." }) : t({ ko: "조회", en: "Lookup" })}
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
        <div
          style={{
            background: "var(--surface-2, #f9fafb)",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "10px",
            padding: "1.25rem",
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
            {t({ ko: "WHOIS 결과", en: "WHOIS Result" })}
          </div>
          {rows.map((row) => {
            const val = row.value;
            if (!val || (Array.isArray(val) && val.length === 0)) return null;
            const label = locale === "ko" ? row.label.ko : row.label.en;
            const display = Array.isArray(val) ? val.join(", ") : val;
            return (
              <div key={label} style={resultRowStyle}>
                <span style={resultLabelStyle}>{label}</span>
                <span style={resultValueStyle}>{display}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
