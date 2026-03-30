"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  Answer?: DnsRecord[];
  Comment?: string;
}

const TYPE_MAP: Record<string, number> = {
  A: 1,
  AAAA: 28,
  MX: 15,
  NS: 2,
  TXT: 16,
  CNAME: 5,
  SOA: 6,
};

const TYPE_NAME_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([k, v]) => [v, k])
);

function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false;
  const pattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/;
  return pattern.test(domain);
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

const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"] as const;

export function DnsLookup() {
  const { t } = useLocale();
  const [domain, setDomain] = useState("google.com");
  const [recordType, setRecordType] = useState<string>("A");
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLookup = useCallback(async () => {
    if (!isValidDomain(domain)) {
      setError(t({ ko: "올바른 도메인 형식이 아닙니다", en: "Invalid domain format" }));
      setRecords([]);
      return;
    }

    setError("");
    setLoading(true);
    setRecords([]);

    try {
      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`;
      const res = await fetch(url, {
        headers: { Accept: "application/dns-json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: DnsResponse = await res.json();

      if (data.Status !== 0) {
        setError(t({ ko: "DNS 조회 실패 (상태 코드: " + data.Status + ")", en: "DNS lookup failed (status: " + data.Status + ")" }));
        return;
      }

      if (!data.Answer || data.Answer.length === 0) {
        setError(t({ ko: "레코드를 찾을 수 없습니다", en: "No records found" }));
        return;
      }

      setRecords(data.Answer);
    } catch (err) {
      setError(
        t({ ko: "DNS 조회 중 오류가 발생했습니다", en: "Error occurred during DNS lookup" })
        + (err instanceof Error ? `: ${err.message}` : "")
      );
    } finally {
      setLoading(false);
    }
  }, [domain, recordType, t]);

  const handleDomainChange = (value: string) => {
    setDomain(value);
    if (value && !isValidDomain(value)) {
      setError(t({ ko: "올바른 도메인 형식이 아닙니다", en: "Invalid domain format" }));
    } else {
      setError("");
    }
  };

  const copyAll = () => {
    if (records.length === 0) return;
    const text = records
      .map((r) => `${r.name}\t${TYPE_NAME_MAP[r.type] || r.type}\t${r.TTL}\t${r.data}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "도메인", en: "Domain" })}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => handleDomainChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="google.com"
            style={{
              ...inputStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
              flex: 1,
            }}
          />
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            style={{
              ...inputStyle,
              width: "auto",
              minWidth: "5rem",
              cursor: "pointer",
            }}
          >
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleLookup}
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? t({ ko: "조회 중...", en: "Loading..." })
              : t(T.lookup)}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t({ ko: "조회할 도메인을 입력하세요 (예: google.com)", en: "Enter domain to lookup (e.g. google.com)" })}
        </p>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {records.length > 0 && (
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
              onClick={copyAll}
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

          {/* Table header */}
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 3fr",
                gap: "0.5rem",
                padding: "0.5rem 0",
                borderBottom: "2px solid var(--border, #d1d5db)",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ ...resultLabelStyle, fontWeight: 700 }}>
                {t({ ko: "이름", en: "Name" })}
              </span>
              <span style={{ ...resultLabelStyle, fontWeight: 700 }}>
                {t({ ko: "타입", en: "Type" })}
              </span>
              <span style={{ ...resultLabelStyle, fontWeight: 700 }}>TTL</span>
              <span style={{ ...resultLabelStyle, fontWeight: 700 }}>
                {t({ ko: "데이터", en: "Data" })}
              </span>
            </div>

            {/* Table rows */}
            {records.map((record, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 3fr",
                  gap: "0.5rem",
                  padding: "0.5rem 0",
                  borderBottom:
                    idx < records.length - 1
                      ? "1px solid var(--border-light, #f3f4f6)"
                      : "none",
                }}
              >
                <span
                  style={{
                    ...resultValueStyle,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </span>
                <span style={resultValueStyle}>
                  {TYPE_NAME_MAP[record.type] || String(record.type)}
                </span>
                <span style={resultValueStyle}>{record.TTL}</span>
                <span
                  style={{
                    ...resultValueStyle,
                    wordBreak: "break-all",
                  }}
                >
                  {record.data}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
