"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "ratione", "sequi", "nesciunt",
];

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const wordCount = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: wordCount }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const selectStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border, #d1d5db)",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  fontSize: "0.875rem",
};

export function LoremIpsumGenerator() {
  const { t } = useLocale();
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      result = Array.from({ length: count }, generateParagraph).join("\n\n");
    } else if (type === "sentences") {
      result = Array.from({ length: count }, generateSentence).join(" ");
    } else {
      result = Array.from({ length: count }, randomWord).join(" ");
    }
    setOutput(result);
    setCopied(false);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label style={labelStyle}>
            {t({ ko: "생성 단위", en: "Generate by" })}
          </label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "paragraphs" | "sentences" | "words")
            }
            style={selectStyle}
          >
            <option value="paragraphs">
              {t({ ko: "단락 (Paragraphs)", en: "Paragraphs" })}
            </option>
            <option value="sentences">
              {t({ ko: "문장 (Sentences)", en: "Sentences" })}
            </option>
            <option value="words">
              {t({ ko: "단어 (Words)", en: "Words" })}
            </option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>
            {t({ ko: "개수", en: "Count" })}
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, Number(e.target.value))))
            }
            style={{
              ...selectStyle,
              width: "80px",
            }}
          />
        </div>
        <button
          onClick={generate}
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
          {t({ ko: "생성", en: "Generate" })}
        </button>
      </div>
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
              {t({ ko: "생성된 텍스트", en: "Generated Text" })}
            </label>
            <button
              onClick={copyOutput}
              style={
                copied
                  ? {
                      ...smallButtonStyle,
                      background: "#10b981",
                      color: "#fff",
                      borderColor: "#10b981",
                    }
                  : smallButtonStyle
              }
            >
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            style={{
              padding: "0.625rem 0.875rem",
              fontSize: "0.875rem",
              fontFamily: "serif",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "var(--surface, #fff)",
              color: "var(--text-primary, #111)",
              outline: "none",
              width: "100%",
              minHeight: "200px",
              resize: "vertical",
              lineHeight: 1.7,
            }}
          />
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
              marginTop: "0.25rem",
            }}
          >
            {t({
              ko: `${output.length}자 / ${output.trim().split(/\s+/).length}단어`,
              en: `${output.length} chars / ${output.trim().split(/\s+/).length} words`,
            })}
          </div>
        </div>
      )}
    </div>
  );
}
