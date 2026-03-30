"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const DEFAULT_JSON = `{
  "name": "NetTools",
  "version": "1.0.0",
  "features": ["subnet-calc", "mac-lookup", "json-formatter"],
  "config": {
    "port": 31000,
    "debug": false
  }
}`;

function getJsonError(input: string): string | null {
  try {
    JSON.parse(input);
    return null;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return e.message;
    }
    return "Unknown error";
  }
}

function countLines(text: string): number {
  if (!text) return 0;
  return text.split("\n").length;
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
  minHeight: "200px",
  lineHeight: 1.6,
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

const secondaryButtonStyle: React.CSSProperties = {
  padding: "0.625rem 1.5rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
};

const statStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-tertiary, #9ca3af)",
  marginTop: "0.375rem",
};

export function JsonFormatter() {
  const { t } = useLocale();
  const [input, setInput] = useState(DEFAULT_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState<2 | 4>(2);

  const isValid = getJsonError(input) === null;

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError("");
      setMessage("");
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Unknown error";
      setError(msg);
      setOutput("");
      setMessage("");
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
      setMessage("");
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Unknown error";
      setError(msg);
      setOutput("");
      setMessage("");
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    const err = getJsonError(input);
    if (err) {
      setError(err);
      setMessage("");
      setOutput("");
    } else {
      setError("");
      setMessage(t({ ko: "유효한 JSON입니다.", en: "Valid JSON." }));
      setOutput("");
    }
  }, [input, t]);

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
          <label style={labelStyle}>
            {t({ ko: "JSON 입력", en: "JSON Input" })}
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
              {isValid
                ? <span style={{ color: "#10b981" }}>&#x2713; {t({ ko: "유효", en: "Valid" })}</span>
                : <span style={{ color: "#ef4444" }}>&#x2717; {t({ ko: "오류", en: "Invalid" })}</span>
              }
            </span>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value"}'
          style={{
            ...inputStyle,
            borderColor: input && !isValid ? "#ef4444" : "var(--border, #d1d5db)",
          }}
          spellCheck={false}
        />
        <div style={statStyle}>
          {t({ ko: "문자", en: "chars" })}: {input.length} &nbsp;|&nbsp; {t({ ko: "줄", en: "lines" })}: {countLines(input)}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <button onClick={handleFormat} style={buttonStyle}>
          {t({ ko: "포맷 (Pretty)", en: "Format (Pretty)" })}
        </button>
        <button onClick={handleMinify} style={secondaryButtonStyle}>
          {t({ ko: "축소 (Minify)", en: "Minify" })}
        </button>
        <button onClick={handleValidate} style={secondaryButtonStyle}>
          {t({ ko: "검증 (Validate)", en: "Validate" })}
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
            {t({ ko: "들여쓰기", en: "Indent" })}:
          </span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value) as 2 | 4)}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "6px",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
            }}
          >
            <option value={2}>2 {t({ ko: "칸", en: "spaces" })}</option>
            <option value={4}>4 {t({ ko: "칸", en: "spaces" })}</option>
          </select>
        </div>
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
          }}
        >
          <strong>{t({ ko: "오류", en: "Error" })}:</strong> {error}
        </div>
      )}

      {/* Validation success message */}
      {message && (
        <div
          style={{
            background: "var(--result-bg, #f0fdf4)",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.8125rem",
            color: "#16a34a",
          }}
        >
          &#x2713; {message}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <label style={labelStyle}>
              {t({ ko: "결과", en: "Output" })}
            </label>
            <button
              onClick={handleCopyOutput}
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
            style={{
              ...inputStyle,
              background: "var(--result-bg, #f0fdf4)",
              cursor: "default",
            }}
          />
          <div style={statStyle}>
            {t({ ko: "문자", en: "chars" })}: {output.length} &nbsp;|&nbsp; {t({ ko: "줄", en: "lines" })}: {countLines(output)}
          </div>
        </div>
      )}
    </div>
  );
}
