"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type LangMode = "css" | "js";

function minifyCSS(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/;\}/g, "}")
    .replace(/\s*!\s*important/g, "!important")
    .trim();
}

function minifyJS(input: string): string {
  let result = input;
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result
    .split("\n")
    .map((line) => line.replace(/\/\/[^'"`\n]*$/, "").trim())
    .join(" ");
  result = result
    .replace(/\s*([=+\-*/%&|^~<>!?:,;{}()[\]])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

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
  minHeight: "200px",
  resize: "vertical",
  lineHeight: 1.5,
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

export function CodeMinifier() {
  const { t } = useLocale();
  const [mode, setMode] = useState<LangMode>("css");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ before: number; after: number; ratio: number } | null>(null);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    const result = mode === "css" ? minifyCSS(input) : minifyJS(input);
    setOutput(result);
    const before = new Blob([input]).size;
    const after = new Blob([result]).size;
    const ratio = before > 0 ? ((before - after) / before) * 100 : 0;
    setStats({ before, after, ratio });
    setCopied(false);
  }, [input, mode]);

  const copyOutput = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const clear = useCallback(() => {
    setInput("");
    setOutput("");
    setStats(null);
    setCopied(false);
  }, []);

  const inputSize = new Blob([input]).size;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          background: "var(--surface-2, #f3f4f6)",
          borderRadius: "10px",
          padding: "0.25rem",
          width: "fit-content",
        }}
      >
        {(["css", "js"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(""); setStats(null); }}
            style={{
              padding: "0.375rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: mode === m ? "var(--surface, #fff)" : "transparent",
              color: mode === m ? "var(--text-primary, #111)" : "var(--text-secondary, #6b7280)",
              boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {m === "css" ? "CSS" : "JavaScript"}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={labelStyle}>{t({ ko: "원본 코드", en: "Original Code" })}</label>
        <textarea
          style={textareaStyle}
          placeholder={
            mode === "css"
              ? t({ ko: "CSS 코드를 붙여넣으세요...", en: "Paste your CSS code here..." })
              : t({ ko: "JavaScript 코드를 붙여넣으세요...", en: "Paste your JavaScript code here..." })
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {inputSize > 0 && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)", textAlign: "right" }}>
            {formatBytes(inputSize)}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button style={buttonStyle} onClick={minify} disabled={!input.trim()}>
          {t({ ko: "압축", en: "Minify" })}
        </button>
        <button
          style={{
            ...buttonStyle,
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            border: "1px solid var(--border, #d1d5db)",
          }}
          onClick={clear}
        >
          {t({ ko: "초기화", en: "Clear" })}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            {
              label: t({ ko: "원본 크기", en: "Original" }),
              value: formatBytes(stats.before),
              color: "var(--text-primary, #111)",
            },
            {
              label: t({ ko: "압축 후 크기", en: "Minified" }),
              value: formatBytes(stats.after),
              color: "#2563eb",
            },
            {
              label: t({ ko: "압축률", en: "Reduction" }),
              value: `${stats.ratio.toFixed(1)}%`,
              color: stats.ratio > 20 ? "#10b981" : "#f59e0b",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                minWidth: "100px",
                padding: "0.75rem 1rem",
                background: "var(--surface-2, #f9fafb)",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)", marginBottom: "0.25rem" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "monospace", color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Output */}
      {output && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={labelStyle}>{t({ ko: "압축된 코드", en: "Minified Code" })}</label>
            <button style={smallButtonStyle} onClick={copyOutput}>
              {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "복사", en: "Copy" })}
            </button>
          </div>
          <textarea
            style={{ ...textareaStyle, minHeight: "120px", background: "#1e1e2e", color: "#a6e3a1" }}
            readOnly
            value={output}
          />
        </div>
      )}
    </div>
  );
}
