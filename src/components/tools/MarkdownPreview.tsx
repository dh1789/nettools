"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { marked } from "marked";

const SAMPLE_MD = `# Markdown Preview

## 기능 목록 / Features

- **굵게** / **Bold text**
- *기울임* / *Italic text*
- \`인라인 코드\` / \`inline code\`
- [링크](https://beomanro.com) / [Link](https://beomanro.com)

## 코드 블록 / Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("World"));
\`\`\`

## 표 / Table

| 이름 | 역할 | 언어 |
|------|------|------|
| Alice | Frontend | React |
| Bob | Backend | Go |
| Carol | DevOps | Bash |

## 인용문 / Blockquote

> 좋은 코드는 그 자체로 문서입니다.
> Good code is its own documentation.

## 체크리스트 / Checklist

- [x] JWT 디코더
- [x] UUID 생성기
- [x] YAML/JSON 변환기
- [x] SQL 포맷터
- [x] 마크다운 미리보기
`;

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
  lineHeight: 1.6,
  minHeight: "300px",
};

export function MarkdownPreview() {
  const { t } = useLocale();
  const [source, setSource] = useState(SAMPLE_MD);
  const [view, setView] = useState<"split" | "editor" | "preview">("split");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return marked.parse(source, { async: false }) as string;
    } catch {
      return "<p>Parse error</p>";
    }
  }, [source]);

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showEditor = view === "split" || view === "editor";
  const showPreview = view === "split" || view === "preview";

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", border: "1px solid var(--border, #d1d5db)", borderRadius: "8px", overflow: "hidden" }}>
          {(["split", "editor", "preview"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "0.4rem 0.75rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                border: "none",
                background: view === v ? "var(--text-primary, #111)" : "transparent",
                color: view === v ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
              }}
            >
              {v === "split" && t({ ko: "분할", en: "Split" })}
              {v === "editor" && t({ ko: "편집", en: "Editor" })}
              {v === "preview" && t({ ko: "미리보기", en: "Preview" })}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setSource(SAMPLE_MD)}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--text-secondary, #6b7280)",
              cursor: "pointer",
            }}
          >
            {t({ ko: "예제 로드", en: "Load Sample" })}
          </button>
          <button
            onClick={handleCopy}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: copied ? "#10b981" : "transparent",
              color: copied ? "#fff" : "var(--text-secondary, #6b7280)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? t(T.copied) : t({ ko: "마크다운 복사", en: "Copy MD" })}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}>
        {/* Editor */}
        {showEditor && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-secondary, #6b7280)",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {t({ ko: "마크다운 입력", en: "Markdown" })}
            </div>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              style={inputStyle}
              spellCheck={false}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.25rem" }}>
              {source.length} {t({ ko: "자", en: "chars" })} · {source.split("\n").length} {t({ ko: "줄", en: "lines" })}
            </div>
          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-secondary, #6b7280)",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {t({ ko: "미리보기", en: "Preview" })}
            </div>
            <div
              style={{
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "8px",
                background: "var(--surface, #fff)",
                padding: "1rem 1.25rem",
                minHeight: "300px",
                overflowY: "auto",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "var(--text-primary, #111)",
              }}
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      {/* Markdown preview styles */}
      <style>{`
        .markdown-preview h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; border-bottom: 2px solid var(--border, #d1d5db); padding-bottom: 0.25rem; }
        .markdown-preview h2 { font-size: 1.2rem; font-weight: 700; margin: 0.875rem 0 0.375rem; }
        .markdown-preview h3 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
        .markdown-preview p { margin: 0 0 0.75rem; }
        .markdown-preview ul, .markdown-preview ol { padding-left: 1.5rem; margin: 0 0 0.75rem; }
        .markdown-preview li { margin-bottom: 0.25rem; }
        .markdown-preview code { background: var(--input-bg, #f3f4f6); padding: 0.125rem 0.375rem; border-radius: 4px; font-family: monospace; font-size: 0.875em; color: #e11d48; }
        .markdown-preview pre { background: var(--input-bg, #f3f4f6); border-radius: 8px; padding: 1rem; margin: 0 0 0.75rem; overflow-x: auto; }
        .markdown-preview pre code { background: none; padding: 0; color: var(--text-primary, #111); font-size: 0.875rem; }
        .markdown-preview blockquote { border-left: 3px solid var(--border, #d1d5db); padding-left: 1rem; color: var(--text-secondary, #6b7280); margin: 0 0 0.75rem; }
        .markdown-preview table { border-collapse: collapse; width: 100%; margin-bottom: 0.75rem; }
        .markdown-preview th, .markdown-preview td { border: 1px solid var(--border, #d1d5db); padding: 0.375rem 0.75rem; text-align: left; font-size: 0.875rem; }
        .markdown-preview th { background: var(--input-bg, #f3f4f6); font-weight: 600; }
        .markdown-preview a { color: #3b82f6; text-decoration: underline; }
        .markdown-preview hr { border: none; border-top: 1px solid var(--border, #d1d5db); margin: 1rem 0; }
        .markdown-preview input[type="checkbox"] { margin-right: 0.375rem; }
        .markdown-preview li input[type="checkbox"] { list-style: none; }
      `}</style>
    </div>
  );
}
