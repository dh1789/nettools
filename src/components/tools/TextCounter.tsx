"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

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
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

export function TextCounter() {
  const { t } = useLocale();
  const [text, setText] = useState("");

  const charCount = text.length;
  const charNoSpaceCount = text.replace(/\s/g, "").length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split("\n").length : 0;
  const sentenceCount = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim()).length
    : 0;
  const paragraphCount = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const stats = [
    {
      label: t({ ko: "글자수 (공백 포함)", en: "Characters (with spaces)" }),
      value: charCount,
    },
    {
      label: t({ ko: "글자수 (공백 제외)", en: "Characters (no spaces)" }),
      value: charNoSpaceCount,
    },
    { label: t({ ko: "단어수", en: "Word Count" }), value: wordCount },
    { label: t({ ko: "줄수", en: "Line Count" }), value: lineCount },
    { label: t({ ko: "문장수", en: "Sentence Count" }), value: sentenceCount },
    {
      label: t({ ko: "단락수", en: "Paragraph Count" }),
      value: paragraphCount,
    },
    {
      label: t({ ko: "예상 읽기 시간(분)", en: "Reading Time (min)" }),
      value: readingTime,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <label style={labelStyle}>
          {t({ ko: "텍스트 입력", en: "Enter Text" })}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t({
            ko: "분석할 텍스트를 입력하세요...",
            en: "Enter text to analyze...",
          })}
          style={textareaStyle}
          autoFocus
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {stats.map(({ label, value }) => (
          <div
            key={label}
            style={{
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              background: "var(--input-bg, #f9fafb)",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
                lineHeight: 1,
              }}
            >
              {value.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary, #6b7280)",
                marginTop: "0.25rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}
      >
        {t({
          ko: "텍스트를 입력하면 실시간으로 통계가 업데이트됩니다. 읽기 시간은 분당 200단어 기준입니다.",
          en: "Stats update in real time as you type. Reading time is based on 200 words per minute.",
        })}
      </p>
    </div>
  );
}
