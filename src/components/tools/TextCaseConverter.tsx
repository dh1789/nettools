"use client";

import { useState } from "react";
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

const caseButtonStyle: React.CSSProperties = {
  padding: "0.5rem 0.875rem",
  fontSize: "0.8125rem",
  fontWeight: 500,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
  textAlign: "left" as const,
};

function toUpperCase(s: string) { return s.toUpperCase(); }
function toLowerCase(s: string) { return s.toLowerCase(); }
function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function toCamelCase(s: string) {
  return s
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}
function toPascalCase(s: string) {
  const cam = toCamelCase(s);
  return cam.charAt(0).toUpperCase() + cam.slice(1);
}
function toSnakeCase(s: string) {
  return s
    .replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`)
    .replace(/[-\s]+/g, "_")
    .replace(/^_/, "")
    .toLowerCase();
}
function toKebabCase(s: string) {
  return s
    .replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`)
    .replace(/[_\s]+/g, "-")
    .replace(/^-/, "")
    .toLowerCase();
}
function toConstantCase(s: string) {
  return toSnakeCase(s).toUpperCase();
}
function toSentenceCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function toAlternatingCase(s: string) {
  return s
    .split("")
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join("");
}

export function TextCaseConverter() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeCase, setActiveCase] = useState("");
  const [copied, setCopied] = useState(false);

  const cases = [
    { id: "upper", label: t({ ko: "대문자 (UPPER CASE)", en: "UPPER CASE" }), fn: toUpperCase },
    { id: "lower", label: t({ ko: "소문자 (lower case)", en: "lower case" }), fn: toLowerCase },
    { id: "title", label: t({ ko: "제목 형식 (Title Case)", en: "Title Case" }), fn: toTitleCase },
    { id: "sentence", label: t({ ko: "문장 형식 (Sentence case)", en: "Sentence case" }), fn: toSentenceCase },
    { id: "camel", label: t({ ko: "카멜 케이스 (camelCase)", en: "camelCase" }), fn: toCamelCase },
    { id: "pascal", label: t({ ko: "파스칼 케이스 (PascalCase)", en: "PascalCase" }), fn: toPascalCase },
    { id: "snake", label: t({ ko: "스네이크 케이스 (snake_case)", en: "snake_case" }), fn: toSnakeCase },
    { id: "kebab", label: t({ ko: "케밥 케이스 (kebab-case)", en: "kebab-case" }), fn: toKebabCase },
    { id: "constant", label: t({ ko: "상수 형식 (CONSTANT_CASE)", en: "CONSTANT_CASE" }), fn: toConstantCase },
    { id: "alternating", label: t({ ko: "교대 형식 (aLtErNaTiNg)", en: "aLtErNaTiNg" }), fn: toAlternatingCase },
  ];

  const applyCase = (id: string, fn: (s: string) => string) => {
    setActiveCase(id);
    setOutput(fn(input));
    setCopied(false);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setActiveCase("");
    setCopied(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Input */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "입력 텍스트", en: "Input Text" })}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (activeCase) {
              const found = cases.find((c) => c.id === activeCase);
              if (found) setOutput(found.fn(e.target.value));
            }
          }}
          placeholder={t({ ko: "변환할 텍스트를 입력하세요...", en: "Enter text to convert..." })}
          style={textareaStyle}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
            {t({ ko: `${input.length}자`, en: `${input.length} chars` })}
          </span>
          <button onClick={handleClear} style={smallButtonStyle}>
            {t({ ko: "초기화", en: "Clear" })}
          </button>
        </div>
      </div>

      {/* Case buttons */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "변환 형식 선택", en: "Select Case Format" })}
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {cases.map(({ id, label, fn }) => (
            <button
              key={id}
              onClick={() => applyCase(id, fn)}
              style={{
                ...caseButtonStyle,
                borderColor: activeCase === id ? "var(--text-primary, #111)" : "var(--border, #d1d5db)",
                background: activeCase === id ? "var(--text-primary, #111)" : "var(--input-bg, #f9fafb)",
                color: activeCase === id ? "var(--surface, #fff)" : "var(--text-primary, #111)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.25rem",
            }}
          >
            <label style={labelStyle}>
              {t({ ko: "변환 결과", en: "Result" })}
            </label>
            <button
              onClick={copyOutput}
              style={copied ? copiedButtonStyle : smallButtonStyle}
            >
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            style={{
              ...textareaStyle,
              background: "var(--surface, #fff)",
              cursor: "default",
            }}
          />
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.25rem" }}>
            {t({ ko: `${output.length}자`, en: `${output.length} chars` })}
          </div>
        </div>
      )}
    </div>
  );
}
