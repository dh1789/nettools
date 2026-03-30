"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type DiffLine = { type: "equal" | "added" | "removed"; text: string };

function diffLines(a: string, b: string): DiffLine[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const m = aLines.length;
  const n = bLines.length;

  // LCS-based line diff
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        aLines[i - 1] === bLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = m,
    j = n;
  const ops: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      ops.push({ type: "equal", text: aLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: "added", text: bLines[j - 1] });
      j--;
    } else {
      ops.push({ type: "removed", text: aLines[i - 1] });
      i--;
    }
  }
  return ops.reverse();
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

export function TextDiff() {
  const { t } = useLocale();
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const compare = () => {
    setDiff(diffLines(textA, textB));
  };

  const clear = () => {
    setTextA("");
    setTextB("");
    setDiff(null);
  };

  const added = diff?.filter((d) => d.type === "added").length ?? 0;
  const removed = diff?.filter((d) => d.type === "removed").length ?? 0;
  const equal = diff?.filter((d) => d.type === "equal").length ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <div>
          <label style={labelStyle}>
            {t({ ko: "원본 텍스트 (A)", en: "Original Text (A)" })}
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder={t({
              ko: "원본 텍스트를 입력하세요...",
              en: "Enter original text...",
            })}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            {t({ ko: "수정된 텍스트 (B)", en: "Modified Text (B)" })}
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder={t({
              ko: "비교할 텍스트를 입력하세요...",
              en: "Enter modified text...",
            })}
            style={textareaStyle}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={compare}
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
          {t({ ko: "비교하기", en: "Compare" })}
        </button>
        <button
          onClick={clear}
          style={{
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "초기화", en: "Clear" })}
        </button>
      </div>
      {diff && (
        <div>
          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                padding: "0.25rem 0.625rem",
                borderRadius: "4px",
                background: "#dcfce7",
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              +{added} {t({ ko: "줄 추가됨", en: "lines added" })}
            </span>
            <span
              style={{
                fontSize: "0.8125rem",
                padding: "0.25rem 0.625rem",
                borderRadius: "4px",
                background: "#fee2e2",
                color: "#dc2626",
                fontWeight: 600,
              }}
            >
              -{removed} {t({ ko: "줄 삭제됨", en: "lines removed" })}
            </span>
            <span
              style={{
                fontSize: "0.8125rem",
                padding: "0.25rem 0.625rem",
                borderRadius: "4px",
                background: "var(--input-bg, #f9fafb)",
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              {equal} {t({ ko: "줄 동일함", en: "lines unchanged" })}
            </span>
          </div>

          {/* Diff output */}
          <div
            style={{
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              overflow: "hidden",
              fontFamily: "monospace",
              fontSize: "0.8125rem",
            }}
          >
            {diff.length === 0 ? (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--text-tertiary, #9ca3af)",
                }}
              >
                {t({ ko: "두 텍스트가 동일합니다.", en: "The texts are identical." })}
              </div>
            ) : (
              diff.map((line, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.25rem 0.75rem",
                    background:
                      line.type === "added"
                        ? "#f0fdf4"
                        : line.type === "removed"
                        ? "#fef2f2"
                        : "transparent",
                    color:
                      line.type === "added"
                        ? "#16a34a"
                        : line.type === "removed"
                        ? "#dc2626"
                        : "var(--text-primary, #111)",
                    borderBottom: "1px solid var(--border, #d1d5db)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      userSelect: "none",
                      opacity: 0.5,
                      minWidth: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    {line.type === "added"
                      ? "+"
                      : line.type === "removed"
                      ? "-"
                      : " "}
                  </span>
                  <span>{line.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
