"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

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
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
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

const flagButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "0.25rem 0.625rem",
  fontSize: "0.75rem",
  fontFamily: "monospace",
  fontWeight: 600,
  border: `1px solid ${active ? "var(--text-primary, #111)" : "var(--border, #d1d5db)"}`,
  borderRadius: "4px",
  background: active ? "var(--text-primary, #111)" : "transparent",
  color: active ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
  cursor: "pointer",
});

interface MatchInfo {
  text: string;
  index: number;
  groups: (string | undefined)[];
  namedGroups: Record<string, string | undefined> | null;
}

export function RegexTester() {
  const { t } = useLocale();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testStr, setTestStr] = useState("");
  const [copiedResult, setCopiedResult] = useState(false);

  const flagStr = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const result = useMemo(() => {
    if (!pattern || !testStr) return null;
    try {
      const re = new RegExp(pattern, flagStr);
      const matches: MatchInfo[] = [];
      if (flags.g) {
        let m: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((m = re.exec(testStr)) !== null) {
          matches.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1),
            namedGroups: m.groups ? { ...m.groups } : null,
          });
          if (!flags.g) break;
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        const m = re.exec(testStr);
        if (m) {
          matches.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1),
            namedGroups: m.groups ? { ...m.groups } : null,
          });
        }
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flagStr, flags.g, testStr]);

  const highlightedText = useMemo(() => {
    if (!result || result.error || result.matches.length === 0) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    for (const m of result.matches) {
      if (m.index > last) parts.push({ text: testStr.slice(last, m.index), match: false });
      parts.push({ text: m.text, match: true });
      last = m.index + m.text.length;
    }
    if (last < testStr.length) parts.push({ text: testStr.slice(last), match: false });
    return parts;
  }, [result, testStr]);

  const toggleFlag = (f: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [f]: !prev[f] }));
  };

  const copyResult = () => {
    if (!result) return;
    const lines = result.matches.map((m, i) =>
      `[${i + 1}] "${m.text}" at index ${m.index}${m.groups.length ? ` | groups: [${m.groups.map((g) => g ?? "undefined").join(", ")}]` : ""}`
    );
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const matchCount = result?.matches.length ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Pattern input */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "정규표현식 패턴", en: "Regular Expression Pattern" })}
        </label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t({ ko: "예: \\d+ 또는 (hello|world)", en: "e.g. \\d+ or (hello|world)" })}
              style={{
                ...inputStyle,
                borderColor: result?.error ? "#ef4444" : "var(--border, #d1d5db)",
              }}
            />
          </div>
          {/* Flags */}
          <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
            {(["g", "i", "m", "s"] as const).map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                style={flagButtonStyle(flags[f])}
                title={
                  f === "g" ? "global"
                  : f === "i" ? "case insensitive"
                  : f === "m" ? "multiline"
                  : "dotAll"
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {result?.error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.375rem" }}>
            {result.error}
          </p>
        )}
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.375rem" }}>
          {t({ ko: `플래그: /${pattern || "..."}/${flagStr}`, en: `Pattern: /${pattern || "..."}/${flagStr}` })}
        </p>
      </div>

      {/* Test string */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "테스트 문자열", en: "Test String" })}
        </label>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          placeholder={t({ ko: "테스트할 텍스트를 입력하세요...", en: "Enter text to test against..." })}
          style={textareaStyle}
        />
      </div>

      {/* Highlighted preview */}
      {testStr && result && !result.error && (
        <div>
          <label style={labelStyle}>
            {t({ ko: "하이라이트 미리보기", en: "Highlight Preview" })}
          </label>
          <div
            style={{
              padding: "0.625rem 0.875rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "var(--input-bg, #f9fafb)",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "var(--text-primary, #111)",
            }}
          >
            {highlightedText
              ? highlightedText.map((part, i) =>
                  part.match ? (
                    <mark
                      key={i}
                      style={{
                        background: "#fef08a",
                        color: "#713f12",
                        borderRadius: "2px",
                        padding: "0 1px",
                      }}
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )
              : testStr}
          </div>
        </div>
      )}

      {/* Matches */}
      {result && !result.error && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <label style={labelStyle}>
              {matchCount > 0
                ? t({ ko: `매칭 결과 (${matchCount}개)`, en: `Matches (${matchCount})` })
                : t({ ko: "매칭 없음", en: "No matches" })}
            </label>
            {matchCount > 0 && (
              <button
                onClick={copyResult}
                style={copiedResult ? copiedButtonStyle : smallButtonStyle}
              >
                {copiedResult ? t(T.copied) : t(T.copy)}
              </button>
            )}
          </div>
          {matchCount > 0 && (
            <div
              style={{
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {result.matches.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.625rem 0.875rem",
                    borderBottom: i < result.matches.length - 1 ? "1px solid var(--border, #d1d5db)" : "none",
                    background: i % 2 === 0 ? "var(--input-bg, #f9fafb)" : "var(--surface, #fff)",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", flexShrink: 0 }}>
                      #{i + 1}
                    </span>
                    <code
                      style={{
                        fontSize: "0.875rem",
                        background: "#fef08a",
                        color: "#713f12",
                        borderRadius: "4px",
                        padding: "0 4px",
                      }}
                    >
                      {m.text}
                    </code>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                      {t({ ko: `인덱스: ${m.index}`, en: `index: ${m.index}` })}
                    </span>
                    {m.groups.length > 0 && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                        {t({ ko: "그룹", en: "groups" })}: [{m.groups.map((g) => g !== undefined ? `"${g}"` : "undefined").join(", ")}]
                      </span>
                    )}
                  </div>
                  {m.namedGroups && Object.keys(m.namedGroups).length > 0 && (
                    <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                      {t({ ko: "명명된 그룹", en: "named groups" })}: {JSON.stringify(m.namedGroups)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick reference */}
      <details style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.5rem" }}>
          {t({ ko: "빠른 참조", en: "Quick Reference" })}
        </summary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.25rem",
            marginTop: "0.5rem",
          }}
        >
          {[
            { pat: ".", desc: t({ ko: "임의의 문자 (줄바꿈 제외)", en: "Any character (except newline)" }) },
            { pat: "\\d", desc: t({ ko: "숫자 [0-9]", en: "Digit [0-9]" }) },
            { pat: "\\w", desc: t({ ko: "단어 문자 [a-zA-Z0-9_]", en: "Word char [a-zA-Z0-9_]" }) },
            { pat: "\\s", desc: t({ ko: "공백 문자", en: "Whitespace" }) },
            { pat: "^", desc: t({ ko: "문자열/줄 시작", en: "Start of string/line" }) },
            { pat: "$", desc: t({ ko: "문자열/줄 끝", en: "End of string/line" }) },
            { pat: "*", desc: t({ ko: "0회 이상 반복", en: "0 or more" }) },
            { pat: "+", desc: t({ ko: "1회 이상 반복", en: "1 or more" }) },
            { pat: "?", desc: t({ ko: "0 또는 1회", en: "0 or 1" }) },
            { pat: "{n,m}", desc: t({ ko: "n~m회 반복", en: "n to m times" }) },
            { pat: "(abc)", desc: t({ ko: "캡처 그룹", en: "Capture group" }) },
            { pat: "(?:abc)", desc: t({ ko: "비캡처 그룹", en: "Non-capture group" }) },
          ].map(({ pat, desc }) => (
            <div key={pat} style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
              <code
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                  background: "var(--input-bg, #f9fafb)",
                  padding: "0 4px",
                  borderRadius: "3px",
                  flexShrink: 0,
                }}
              >
                {pat}
              </code>
              <span style={{ fontSize: "0.75rem" }}>{desc}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
