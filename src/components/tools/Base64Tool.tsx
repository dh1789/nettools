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
  minHeight: "160px",
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
  transition: "all 0.2s",
};

const copiedButtonStyle: React.CSSProperties = {
  ...smallButtonStyle,
  background: "#10b981",
  color: "#fff",
  borderColor: "#10b981",
};

const countStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-tertiary, #9ca3af)",
  marginTop: "0.25rem",
};

function encodeBase64(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return btoa(String.fromCharCode(...bytes));
}

function decodeBase64(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export function Base64Tool() {
  const { t } = useLocale();
  const [text, setText] = useState("");
  const [base64, setBase64] = useState("");
  const [error, setError] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedBase64, setCopiedBase64] = useState(false);

  const handleEncode = useCallback(() => {
    try {
      setError("");
      const encoded = encodeBase64(text);
      setBase64(encoded);
    } catch {
      setError(t({ ko: "인코딩 중 오류가 발생했습니다.", en: "An error occurred during encoding." }));
    }
  }, [text, t]);

  const handleDecode = useCallback(() => {
    try {
      setError("");
      const decoded = decodeBase64(base64);
      setText(decoded);
    } catch {
      setError(t({ ko: "유효하지 않은 Base64 문자열입니다.", en: "Invalid Base64 string." }));
    }
  }, [base64, t]);

  const handleTextChange = (value: string) => {
    setText(value);
    if (autoMode) {
      try {
        setError("");
        setBase64(encodeBase64(value));
      } catch {
        setError(t({ ko: "인코딩 중 오류가 발생했습니다.", en: "An error occurred during encoding." }));
      }
    }
  };

  const handleBase64Change = (value: string) => {
    setBase64(value);
    if (autoMode) {
      try {
        setError("");
        setText(decodeBase64(value));
      } catch {
        setError(t({ ko: "유효하지 않은 Base64 문자열입니다.", en: "Invalid Base64 string." }));
      }
    }
  };

  const handleClear = () => {
    setText("");
    setBase64("");
    setError("");
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copyBase64 = () => {
    navigator.clipboard.writeText(base64);
    setCopiedBase64(true);
    setTimeout(() => setCopiedBase64(false), 2000);
  };

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <button onClick={handleEncode} style={buttonStyle}>
          {t({ ko: "인코딩 →", en: "Encode →" })}
        </button>
        <button onClick={handleDecode} style={buttonStyle}>
          {t({ ko: "← 디코딩", en: "← Decode" })}
        </button>
        <button onClick={handleClear} style={smallButtonStyle}>
          {t({ ko: "초기화", en: "Clear" })}
        </button>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          {t({ ko: "실시간 변환", en: "Auto convert" })}
        </label>
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#ef4444",
            marginBottom: "0.75rem",
            padding: "0.5rem 0.75rem",
            background: "var(--error-bg, #fef2f2)",
            borderRadius: "6px",
          }}
        >
          {error}
        </p>
      )}

      {/* Textareas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Text side */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.25rem",
            }}
          >
            <label style={labelStyle}>
              {t({ ko: "텍스트", en: "Text" })}
            </label>
            <button
              onClick={copyText}
              disabled={!text}
              style={copiedText ? copiedButtonStyle : smallButtonStyle}
            >
              {copiedText ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t({ ko: "텍스트를 입력하세요...", en: "Enter text..." })}
            style={textareaStyle}
          />
          <div style={countStyle}>
            {t({ ko: `${text.length}자`, en: `${text.length} chars` })}
          </div>
        </div>

        {/* Base64 side */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.25rem",
            }}
          >
            <label style={labelStyle}>Base64</label>
            <button
              onClick={copyBase64}
              disabled={!base64}
              style={copiedBase64 ? copiedButtonStyle : smallButtonStyle}
            >
              {copiedBase64 ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={base64}
            onChange={(e) => handleBase64Change(e.target.value)}
            placeholder={t({ ko: "Base64 문자열을 입력하세요...", en: "Enter Base64 string..." })}
            style={{
              ...textareaStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
            }}
          />
          <div style={countStyle}>
            {t({ ko: `${base64.length}자`, en: `${base64.length} chars` })}
          </div>
        </div>
      </div>

      {/* Info */}
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--text-tertiary, #9ca3af)",
          marginTop: "0.75rem",
        }}
      >
        {t({
          ko: "UTF-8 인코딩을 지원합니다. 한글, 이모지 등 비ASCII 문자도 올바르게 변환됩니다.",
          en: "Supports UTF-8 encoding. Non-ASCII characters like CJK and emoji are handled correctly.",
        })}
      </p>

      {/* Responsive: stack on mobile */}
      <style>{`
@media (max-width: 640px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
      `}</style>
    </div>
  );
}
