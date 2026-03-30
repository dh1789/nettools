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

export function UrlEncoder() {
  const { t } = useLocale();
  const [decoded, setDecoded] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [copiedDecoded, setCopiedDecoded] = useState(false);
  const [copiedEncoded, setCopiedEncoded] = useState(false);

  const handleEncode = useCallback(() => {
    try {
      setError("");
      setEncoded(encodeURIComponent(decoded));
    } catch {
      setError(t({ ko: "인코딩 중 오류가 발생했습니다.", en: "An error occurred during encoding." }));
    }
  }, [decoded, t]);

  const handleDecode = useCallback(() => {
    try {
      setError("");
      setDecoded(decodeURIComponent(encoded));
    } catch {
      setError(t({ ko: "유효하지 않은 URL 인코딩 문자열입니다.", en: "Invalid URL-encoded string." }));
    }
  }, [encoded, t]);

  const handleDecodedChange = (value: string) => {
    setDecoded(value);
    if (autoMode) {
      try {
        setError("");
        setEncoded(encodeURIComponent(value));
      } catch {
        setError(t({ ko: "인코딩 중 오류가 발생했습니다.", en: "An error occurred during encoding." }));
      }
    }
  };

  const handleEncodedChange = (value: string) => {
    setEncoded(value);
    if (autoMode) {
      try {
        setError("");
        setDecoded(decodeURIComponent(value));
      } catch {
        setError(t({ ko: "유효하지 않은 URL 인코딩 문자열입니다.", en: "Invalid URL-encoded string." }));
      }
    }
  };

  const handleClear = () => {
    setDecoded("");
    setEncoded("");
    setError("");
  };

  const copyDecoded = () => {
    navigator.clipboard.writeText(decoded);
    setCopiedDecoded(true);
    setTimeout(() => setCopiedDecoded(false), 2000);
  };

  const copyEncoded = () => {
    navigator.clipboard.writeText(encoded);
    setCopiedEncoded(true);
    setTimeout(() => setCopiedEncoded(false), 2000);
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
        {/* Decoded side */}
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
              {t({ ko: "원본 텍스트", en: "Plain Text" })}
            </label>
            <button
              onClick={copyDecoded}
              disabled={!decoded}
              style={copiedDecoded ? copiedButtonStyle : smallButtonStyle}
            >
              {copiedDecoded ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={decoded}
            onChange={(e) => handleDecodedChange(e.target.value)}
            placeholder={t({ ko: "인코딩할 텍스트를 입력하세요...", en: "Enter text to encode..." })}
            style={textareaStyle}
          />
          <div style={countStyle}>
            {t({ ko: `${decoded.length}자`, en: `${decoded.length} chars` })}
          </div>
        </div>

        {/* Encoded side */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.25rem",
            }}
          >
            <label style={labelStyle}>URL Encoded</label>
            <button
              onClick={copyEncoded}
              disabled={!encoded}
              style={copiedEncoded ? copiedButtonStyle : smallButtonStyle}
            >
              {copiedEncoded ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={encoded}
            onChange={(e) => handleEncodedChange(e.target.value)}
            placeholder={t({ ko: "URL 인코딩된 문자열을 입력하세요...", en: "Enter URL-encoded string..." })}
            style={{
              ...textareaStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
            }}
          />
          <div style={countStyle}>
            {t({ ko: `${encoded.length}자`, en: `${encoded.length} chars` })}
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
          ko: "URL 인코딩(퍼센트 인코딩)은 URL에서 특수문자를 안전하게 전달하기 위해 %XX 형식으로 변환합니다.",
          en: "URL encoding (percent encoding) converts special characters to %XX format for safe transmission in URLs.",
        })}
      </p>

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
