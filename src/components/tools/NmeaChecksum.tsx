"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { processInput, xorSteps, type NmeaResult } from "@/lib/nmea-checksum";

const SAMPLE = `$GPGGA,092750.000,5321.6802,N,00630.3372,W,1,8,1.03,61.7,M,55.2,M,,*76
$GPRMC,092751.000,A,5321.6802,N,00630.3371,W,0.06,31.66,280511,,,A*45
!AIVDM,1,1,,B,177KQJ5000G?tO\`K>RA1wUbN0TKH,0*5C
GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,`;

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
  minHeight: "160px",
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

const secondaryButtonStyle: React.CSSProperties = {
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
};

const smallBtnStyle: React.CSSProperties = {
  padding: "0.25rem 0.5rem",
  fontSize: "0.75rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-tertiary, #9ca3af)",
  cursor: "pointer",
};

const codeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.8125rem",
  wordBreak: "break-all",
  color: "var(--text-primary, #111)",
};

/** 결과 1행의 상태 → 표시 마크/색 */
function markOf(r: NmeaResult): { icon: string; color: string } {
  if (r.error) return { icon: "⚠️", color: "#d97706" };
  if (r.valid === true) return { icon: "✅", color: "#10b981" };
  if (r.valid === false) return { icon: "❌", color: "#dc2626" };
  return { icon: "🔵", color: "#3b82f6" }; // 계산 모드
}

export function NmeaChecksum() {
  const { t, locale } = useLocale();
  const [input, setInput] = useState(SAMPLE);
  const [results, setResults] = useState<NmeaResult[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleRun = useCallback(() => {
    setResults(processInput(input, locale));
    setCopiedIdx(null);
  }, [input, locale]);

  const handleClear = () => {
    setInput("");
    setResults([]);
  };

  const handleSample = () => {
    setInput(SAMPLE);
    setResults([]);
  };

  const handleCopy = (text: string, idx: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const validCount = results.filter((r) => r.valid === true).length;
  const invalidCount = results.filter((r) => r.valid === false).length;
  const calcCount = results.filter((r) => r.valid === null && !r.error).length;
  const errorCount = results.filter((r) => !!r.error).length;

  return (
    <div>
      {/* 입력 */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem", gap: "0.5rem", flexWrap: "wrap" }}>
          <label htmlFor="nmea-input" style={labelStyle}>
            {t({ ko: "NMEA 문장 입력 (여러 줄 가능)", en: "NMEA Sentences (one per line)" })}
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleSample} style={smallBtnStyle}>
              {t({ ko: "샘플", en: "Sample" })}
            </button>
            <button onClick={handleClear} style={smallBtnStyle}>
              {t({ ko: "지우기", en: "Clear" })}
            </button>
          </div>
        </div>
        <textarea
          id="nmea-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="$GPGGA,...*76"
          style={inputStyle}
          spellCheck={false}
          aria-label={t({ ko: "NMEA 문장 입력", en: "NMEA sentences input" })}
        />
      </div>

      {/* 컨트롤 */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <button
          onClick={handleRun}
          style={buttonStyle}
          aria-label={t({ ko: "체크섬 검증 및 계산", en: "Validate and calculate checksum" })}
        >
          {t({ ko: "검증 / 계산", en: "Validate / Calculate" })}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showSteps}
            onChange={(e) => setShowSteps(e.target.checked)}
          />
          {t({ ko: "XOR 과정 표시", en: "Show XOR steps" })}
        </label>
      </div>

      {/* 요약 */}
      {results.length > 0 && (
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)", marginBottom: "0.75rem" }}>
          {t({
            ko: `총 ${results.length}줄 — ✅ 유효 ${validCount} · ❌ 무효 ${invalidCount} · 🔵 계산 ${calcCount}${errorCount ? ` · ⚠️ 오류 ${errorCount}` : ""}`,
            en: `${results.length} lines — ✅ valid ${validCount} · ❌ invalid ${invalidCount} · 🔵 calc ${calcCount}${errorCount ? ` · ⚠️ error ${errorCount}` : ""}`,
          })}
        </p>
      )}

      {/* 결과 */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {results.map((r, idx) => {
            const mark = markOf(r);
            return (
              <div
                key={idx}
                role="group"
                style={{
                  border: `1px solid ${mark.color}33`,
                  borderLeft: `4px solid ${mark.color}`,
                  borderRadius: "8px",
                  padding: "0.75rem 0.875rem",
                  background: "var(--result-bg, #f9fafb)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                    <span aria-hidden="true" style={{ fontSize: "1rem" }}>{mark.icon}</span>
                    <code style={codeStyle}>{r.input}</code>
                  </div>
                  {!r.error && (
                    <button
                      onClick={() => handleCopy(r.full, idx)}
                      style={{
                        ...secondaryButtonStyle,
                        padding: "0.25rem 0.625rem",
                        fontSize: "0.75rem",
                        background: copiedIdx === idx ? "#10b981" : "transparent",
                        color: copiedIdx === idx ? "#fff" : "var(--text-secondary, #6b7280)",
                        whiteSpace: "nowrap",
                      }}
                      aria-label={t({ ko: "완성 문장 복사", en: "Copy full sentence" })}
                    >
                      {copiedIdx === idx ? t(T.copied) : t(T.copy)}
                    </button>
                  )}
                </div>

                {/* 상세 */}
                {r.error ? (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem", color: mark.color, fontFamily: "monospace" }}>
                    {r.error}
                  </p>
                ) : (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)", display: "flex", flexWrap: "wrap", gap: "0.25rem 1rem" }}>
                    <span>
                      {t({ ko: "계산값", en: "Computed" })}: <code style={{ ...codeStyle, fontWeight: 700, color: mark.color }}>*{r.computed}</code>
                    </span>
                    {r.given !== null && (
                      <span>
                        {t({ ko: "입력값", en: "Given" })}: <code style={codeStyle}>*{r.given}</code>
                        {" "}
                        {r.valid
                          ? t({ ko: "(일치)", en: "(match)" })
                          : t({ ko: "(불일치)", en: "(mismatch)" })}
                      </span>
                    )}
                    <span>
                      {t({ ko: "완성", en: "Full" })}: <code style={codeStyle}>{r.full}</code>
                    </span>
                  </div>
                )}

                {/* XOR 과정 */}
                {showSteps && !r.error && r.body.length > 0 && (
                  <div style={{ marginTop: "0.5rem", overflowX: "auto" }}>
                    <code style={{ ...codeStyle, fontSize: "0.6875rem", color: "var(--text-tertiary, #9ca3af)", whiteSpace: "nowrap" }}>
                      {xorSteps(r.body)
                        .map((s) => `${s.char === " " ? "␠" : s.char}=${s.acc.toString(16).toUpperCase().padStart(2, "0")}`)
                        .join(" ⊕ ")}
                    </code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
