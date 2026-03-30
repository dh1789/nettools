"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "¼": "&frac14;",
  "½": "&frac12;",
  "¾": "&frac34;",
  "…": "&hellip;",
  "—": "&mdash;",
  "–": "&ndash;",
  "\u00a0": "&nbsp;",
  "«": "&laquo;",
  "»": "&raquo;",
  "•": "&bull;",
  "→": "&rarr;",
  "←": "&larr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "♠": "&spades;",
  "♣": "&clubs;",
  "♥": "&hearts;",
  "♦": "&diams;",
};

function encodeHtml(text: string): string {
  return text.replace(/[&<>"'`=/©®™€£¥°±×÷¼½¾…—–\u00a0«»•→←↑↓♠♣♥♦]/g, (char) => {
    return HTML_ENTITIES[char] || char;
  });
}

function decodeHtml(text: string): string {
  const entityMap: Record<string, string> = {};
  for (const [char, entity] of Object.entries(HTML_ENTITIES)) {
    entityMap[entity] = char;
  }
  // Named entities
  let result = text.replace(/&[a-z]+;/gi, (match) => {
    const lm = match.toLowerCase();
    return entityMap[lm] ?? match;
  });
  // Numeric decimal: &#123;
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  // Numeric hex: &#x1F;
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
  return result;
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
  minHeight: "120px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.625rem 1.25rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  background: "var(--text-primary, #111)",
  color: "var(--surface, #fff)",
  cursor: "pointer",
};

const modeButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  fontWeight: active ? 700 : 400,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: active ? "var(--text-primary, #111)" : "transparent",
  color: active ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
  cursor: "pointer",
  transition: "all 0.15s",
});

export function HtmlEntityEncoder() {
  const { t } = useLocale();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setOutput(mode === "encode" ? encodeHtml(input) : decodeHtml(input));
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput(input);
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button style={modeButtonStyle(mode === "encode")} onClick={() => setMode("encode")}>
          {t({ ko: "인코딩 (→ &amp;)", en: "Encode (→ &amp;)" })}
        </button>
        <button style={modeButtonStyle(mode === "decode")} onClick={() => setMode("decode")}>
          {t({ ko: "디코딩 (&amp; →)", en: "Decode (&amp; →)" })}
        </button>
      </div>

      {/* Input */}
      <div style={{ marginBottom: "0.75rem" }}>
        <label style={labelStyle}>
          {mode === "encode"
            ? t({ ko: "원본 텍스트", en: "Original Text" })
            : t({ ko: "HTML 엔티티 텍스트", en: "HTML Entity Text" })}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? t({ ko: '예: <div class="hello">안녕 & 잘가</div>', en: 'e.g. <div class="hello">Hello & Goodbye</div>' })
              : t({ ko: "예: &lt;div&gt;안녕&lt;/div&gt;", en: "e.g. &lt;div&gt;Hello&lt;/div&gt;" })
          }
          style={inputStyle}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button onClick={convert} style={buttonStyle}>
          {mode === "encode" ? t({ ko: "인코딩", en: "Encode" }) : t({ ko: "디코딩", en: "Decode" })}
        </button>
        <button
          onClick={swapMode}
          style={{
            ...buttonStyle,
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            border: "1px solid var(--border, #d1d5db)",
          }}
        >
          ⇄ {t({ ko: "방향 전환", en: "Swap Direction" })}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={labelStyle}>
              {mode === "encode"
                ? t({ ko: "인코딩 결과", en: "Encoded Output" })
                : t({ ko: "디코딩 결과", en: "Decoded Output" })}
            </label>
            <button
              onClick={copyOutput}
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
              {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "복사", en: "Copy" })}
            </button>
          </div>
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "0.875rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "var(--text-primary, #111)",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </div>
        </div>
      )}

      {/* Entity Reference Table */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.75rem" }}>
          {t({ ko: "자주 쓰는 HTML 엔티티", en: "Common HTML Entities" })}
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", borderBottom: "2px solid var(--border, #d1d5db)", color: "var(--text-secondary, #6b7280)" }}>
                  {t({ ko: "문자", en: "Character" })}
                </th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", borderBottom: "2px solid var(--border, #d1d5db)", color: "var(--text-secondary, #6b7280)" }}>
                  {t({ ko: "엔티티", en: "Entity" })}
                </th>
                <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", borderBottom: "2px solid var(--border, #d1d5db)", color: "var(--text-secondary, #6b7280)" }}>
                  {t({ ko: "설명", en: "Description" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { char: "&", entity: "&amp;", desc: { ko: "앰퍼샌드", en: "Ampersand" } },
                { char: "<", entity: "&lt;", desc: { ko: "보다 작음", en: "Less than" } },
                { char: ">", entity: "&gt;", desc: { ko: "보다 큼", en: "Greater than" } },
                { char: '"', entity: "&quot;", desc: { ko: "큰따옴표", en: "Double quote" } },
                { char: "'", entity: "&#x27;", desc: { ko: "작은따옴표", en: "Single quote" } },
                { char: "©", entity: "&copy;", desc: { ko: "저작권", en: "Copyright" } },
                { char: "®", entity: "&reg;", desc: { ko: "등록 상표", en: "Registered" } },
                { char: "™", entity: "&trade;", desc: { ko: "상표", en: "Trademark" } },
                { char: "€", entity: "&euro;", desc: { ko: "유로", en: "Euro sign" } },
                { char: " ", entity: "&nbsp;", desc: { ko: "줄바꿈 없는 공백", en: "Non-breaking space" } },
              ].map(({ char, entity, desc }) => (
                <tr key={entity} style={{ borderBottom: "1px solid var(--border-light, #f3f4f6)" }}>
                  <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace", fontWeight: 700 }}>{char}</td>
                  <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace", color: "var(--text-primary, #111)" }}>{entity}</td>
                  <td style={{ padding: "0.4rem 0.75rem", color: "var(--text-secondary, #6b7280)" }}>{t(desc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
