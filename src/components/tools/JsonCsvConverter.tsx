"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { jsonToCsv } from "@/lib/json-csv";

const SAMPLE_JSON = `[
  {"name": "Alice", "age": 30, "city": "Seoul"},
  {"name": "Bob", "age": 25, "city": "Busan"},
  {"name": "Charlie", "age": 35, "city": "Incheon"}
]`;

type Delimiter = ',' | '\t' | ';';

const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: ',', label: '쉼표 (,)' },
  { value: '\t', label: '탭 (\\t)' },
  { value: ';', label: '세미콜론 (;)' },
];

const DELIMITER_OPTIONS_EN: { value: Delimiter; label: string }[] = [
  { value: ',', label: 'Comma (,)' },
  { value: '\t', label: 'Tab (\\t)' },
  { value: ';', label: 'Semicolon (;)' },
];

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
  minHeight: "200px",
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

export function JsonCsvConverter() {
  const { t, locale } = useLocale();
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ rows: number; cols: number } | null>(null);

  const delimiterOptions = locale === 'ko' ? DELIMITER_OPTIONS : DELIMITER_OPTIONS_EN;

  const handleConvert = useCallback(() => {
    const result = jsonToCsv(input, delimiter);
    if (result.error) {
      setError(result.error);
      setOutput("");
      setStats(null);
    } else {
      setError("");
      setOutput(result.csv);
      setStats({ rows: result.rowCount, cols: result.colCount });
    }
  }, [input, delimiter]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
  };

  return (
    <div>
      {/* 입력 섹션 */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
          <label htmlFor="json-input" style={labelStyle}>
            {t({ ko: "JSON 배열 입력", en: "JSON Array Input" })}
          </label>
          <button
            onClick={handleClear}
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "6px",
              background: "transparent",
              color: "var(--text-tertiary, #9ca3af)",
              cursor: "pointer",
            }}
          >
            {t({ ko: "지우기", en: "Clear" })}
          </button>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"key": "value"}]'
          style={inputStyle}
          spellCheck={false}
          aria-label={t({ ko: "JSON 배열 입력", en: "JSON Array Input" })}
        />
      </div>

      {/* 컨트롤 */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <button
          onClick={handleConvert}
          style={buttonStyle}
          aria-label={t({ ko: "JSON을 CSV로 변환", en: "Convert JSON to CSV" })}
        >
          {t({ ko: "변환", en: "Convert" })}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="delimiter-select" style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)", whiteSpace: "nowrap" }}>
            {t({ ko: "구분자", en: "Delimiter" })}:
          </label>
          <select
            id="delimiter-select"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as Delimiter)}
            style={{
              padding: "0.375rem 0.5rem",
              fontSize: "0.8125rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "6px",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
            }}
          >
            {delimiterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div
          role="alert"
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.8125rem",
            color: "#dc2626",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <strong>{t({ ko: "오류", en: "Error" })}:</strong> {error}
        </div>
      )}

      {/* 출력 섹션 */}
      {output && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <label htmlFor="csv-output" style={labelStyle}>
              {t({ ko: "CSV 결과", en: "CSV Output" })}
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleCopy}
                style={{
                  ...secondaryButtonStyle,
                  background: copied ? "#10b981" : "transparent",
                  color: copied ? "#fff" : "var(--text-secondary, #6b7280)",
                  border: copied ? "1px solid #10b981" : "1px solid var(--border, #d1d5db)",
                  transition: "all 0.2s",
                }}
                aria-label={t({ ko: "클립보드에 복사", en: "Copy to clipboard" })}
              >
                {copied ? t(T.copied) : t(T.copy)}
              </button>
              <button
                onClick={handleDownload}
                style={secondaryButtonStyle}
                aria-label={t({ ko: "CSV 파일 다운로드", en: "Download CSV file" })}
              >
                {t({ ko: "다운로드", en: "Download" })}
              </button>
            </div>
          </div>
          <textarea
            id="csv-output"
            value={output}
            readOnly
            style={{
              ...inputStyle,
              background: "var(--result-bg, #f0fdf4)",
              cursor: "default",
            }}
            aria-label={t({ ko: "CSV 결과", en: "CSV Output" })}
          />
          {stats && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.375rem" }}>
              {t({ ko: `${stats.rows}행 × ${stats.cols}열`, en: `${stats.rows} rows × ${stats.cols} columns` })}
              &nbsp;|&nbsp;{output.length} {t({ ko: "자", en: "chars" })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
