"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const textareaStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
  minHeight: "120px",
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

const smallButtonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
};

const copiedButtonStyle: React.CSSProperties = {
  ...smallButtonStyle,
  background: "#10b981",
  color: "#fff",
  borderColor: "#10b981",
};

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

async function computeHash(text: string, algorithm: Algorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface HashResult {
  algorithm: Algorithm;
  hex: string;
  bits: number;
}

export function HashGenerator() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError(t({ ko: "텍스트를 입력하세요.", en: "Please enter some text." }));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const hashes = await Promise.all(
        ALGORITHMS.map(async (alg) => ({
          algorithm: alg,
          hex: await computeHash(input, alg),
          bits: parseInt(alg.split("-")[1]),
        }))
      );
      setResults(hashes);
    } catch {
      setError(t({ ko: "해시 생성 중 오류가 발생했습니다.", en: "An error occurred while generating hashes." }));
    } finally {
      setLoading(false);
    }
  }, [input, t]);

  const copyHash = (hex: string, key: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
    setError("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Input */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "해시할 텍스트", en: "Text to Hash" })}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t({ ko: "해시를 생성할 텍스트를 입력하세요...", en: "Enter text to generate hash..." })}
          style={textareaStyle}
        />
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.25rem" }}>
          {t({ ko: `${input.length}자`, en: `${input.length} chars` })}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={handleGenerate} disabled={loading} style={buttonStyle}>
          {loading
            ? t({ ko: "생성 중...", en: "Generating..." })
            : t({ ko: "해시 생성", en: "Generate Hashes" })}
        </button>
        <button onClick={handleClear} style={smallButtonStyle}>
          {t({ ko: "초기화", en: "Clear" })}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: "0.75rem", color: "#ef4444", padding: "0.5rem 0.75rem", background: "var(--error-bg, #fef2f2)", borderRadius: "6px" }}>
          {error}
        </p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ border: "1px solid var(--border, #d1d5db)", borderRadius: "8px", overflow: "hidden" }}>
          {results.map((r) => (
            <div
              key={r.algorithm}
              style={{
                padding: "0.875rem 1rem",
                borderBottom: "1px solid var(--border, #d1d5db)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
                    {r.algorithm}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
                    ({r.bits} bits, {r.hex.length / 2} bytes)
                  </span>
                </div>
                <button
                  onClick={() => copyHash(r.hex, r.algorithm)}
                  style={copied === r.algorithm ? copiedButtonStyle : smallButtonStyle}
                >
                  {copied === r.algorithm ? t(T.copied) : t(T.copy)}
                </button>
              </div>
              <code
                style={{
                  fontSize: "0.8125rem",
                  fontFamily: "monospace",
                  color: "var(--text-secondary, #6b7280)",
                  wordBreak: "break-all",
                  display: "block",
                  background: "var(--input-bg, #f9fafb)",
                  padding: "0.5rem 0.625rem",
                  borderRadius: "6px",
                }}
              >
                {r.hex}
              </code>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
        {t({
          ko: "Web Crypto API를 사용하여 브라우저에서 직접 계산됩니다. 입력 데이터는 서버로 전송되지 않습니다.",
          en: "Computed directly in your browser using the Web Crypto API. Input data is never sent to any server.",
        })}
      </p>
    </div>
  );
}
