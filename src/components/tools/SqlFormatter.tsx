"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { format } from "sql-formatter";

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 50;`;

type SqlDialect = "sql" | "postgresql" | "mysql" | "sqlite" | "mariadb" | "bigquery";

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "bigquery", label: "BigQuery" },
];

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
  minHeight: "140px",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

export function SqlFormatter() {
  const { t } = useLocale();
  const [input, setInput] = useState(SAMPLE_SQL);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [indentSize, setIndentSize] = useState(2);
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    try {
      const result = format(input, {
        language: dialect,
        tabWidth: indentSize,
        keywordCase: keywordCase,
        linesBetweenQueries: 2,
      });
      setOutput(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }, [input, dialect, indentSize, keywordCase]);

  const handleMinify = useCallback(() => {
    try {
      // Simple minify: remove extra whitespace, keep single spaces
      const minified = input
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*/g, ", ")
        .trim();
      setOutput(minified);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }, [input]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
        <div style={{ flex: "1 1 150px" }}>
          <label style={labelStyle}>{t({ ko: "SQL 방언", en: "SQL Dialect" })}</label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlDialect)}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 130px" }}>
          <label style={labelStyle}>{t({ ko: "키워드 대소문자", en: "Keyword Case" })}</label>
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as "upper" | "lower" | "preserve")}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <option value="upper">{t({ ko: "대문자 (UPPER)", en: "UPPER" })}</option>
            <option value="lower">{t({ ko: "소문자 (lower)", en: "lower" })}</option>
            <option value="preserve">{t({ ko: "유지 (Preserve)", en: "Preserve" })}</option>
          </select>
        </div>
        <div style={{ width: "110px" }}>
          <label style={labelStyle}>{t({ ko: "들여쓰기", en: "Indent" })}</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <option value={2}>2 {t({ ko: "칸", en: "sp" })}</option>
            <option value={4}>4 {t({ ko: "칸", en: "sp" })}</option>
          </select>
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "SQL 입력", en: "SQL Input" })}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE id = 1;"
          style={inputStyle}
          spellCheck={false}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={handleFormat}
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
          {t({ ko: "포맷 (Pretty)", en: "Format (Pretty)" })}
        </button>
        <button
          onClick={handleMinify}
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
          {t({ ko: "축소 (Minify)", en: "Minify" })}
        </button>
        <button
          onClick={() => { setInput(SAMPLE_SQL); setOutput(""); setError(""); }}
          style={{
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "예제 로드", en: "Load Sample" })}
        </button>
      </div>

      {/* Error */}
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
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>{t({ ko: "오류", en: "Error" })}:</strong> {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <label style={labelStyle}>{t({ ko: "결과", en: "Output" })}</label>
            <button
              onClick={handleCopy}
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
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            style={{ ...inputStyle, background: "var(--result-bg, #f0fdf4)", cursor: "default", minHeight: "220px" }}
          />
        </div>
      )}
    </div>
  );
}
