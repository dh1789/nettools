"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/LocaleProvider";

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg, #ffffff)",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "12px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
};

interface CharInfo {
  code: number;
  char: string;
  name: string;
  hex: string;
  oct: string;
  html: string;
  category: string;
}

// ASCII control character names
const ASCII_NAMES: Record<number, string> = {
  0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ", 6: "ACK", 7: "BEL",
  8: "BS", 9: "HT", 10: "LF", 11: "VT", 12: "FF", 13: "CR", 14: "SO", 15: "SI",
  16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
  24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS", 30: "RS", 31: "US",
  32: "SP", 127: "DEL",
};

// Extended common Unicode blocks
const UNICODE_RANGES = [
  { label: { ko: "ASCII (0-127)", en: "ASCII (0-127)" }, start: 0, end: 127 },
  { label: { ko: "확장 ASCII (128-255)", en: "Extended ASCII (128-255)" }, start: 128, end: 255 },
  { label: { ko: "라틴 확장-A (256-383)", en: "Latin Extended-A (256-383)" }, start: 256, end: 383 },
  { label: { ko: "그리스/코프트 (880-1023)", en: "Greek/Coptic (880-1023)" }, start: 880, end: 1023 },
  { label: { ko: "키릴 (1024-1279)", en: "Cyrillic (1024-1279)" }, start: 1024, end: 1279 },
  { label: { ko: "아랍 (1536-1791)", en: "Arabic (1536-1791)" }, start: 1536, end: 1791 },
  { label: { ko: "한글 자모 (12592-12687)", en: "Hangul Jamo (12592-12687)" }, start: 12592, end: 12687 },
  { label: { ko: "CJK 통합 한자 (19968-40959)", en: "CJK Unified Ideographs (19968-40959)" }, start: 19968, end: 40959 },
  { label: { ko: "한글 음절 (44032-55203)", en: "Hangul Syllables (44032-55203)" }, start: 44032, end: 55203 },
  { label: { ko: "이모지 (128512-128591)", en: "Emoji (128512-128591)" }, start: 128512, end: 128591 },
];

function getCharName(code: number): string {
  if (code in ASCII_NAMES) return ASCII_NAMES[code];
  if (code >= 33 && code <= 126) {
    try {
      return String.fromCodePoint(code);
    } catch {
      return "";
    }
  }
  return `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
}

function getCategory(code: number): string {
  if (code < 32 || code === 127) return "control";
  if (code >= 33 && code <= 47) return "punct";
  if (code >= 48 && code <= 57) return "digit";
  if (code >= 58 && code <= 64) return "punct";
  if (code >= 65 && code <= 90) return "upper";
  if (code >= 91 && code <= 96) return "punct";
  if (code >= 97 && code <= 122) return "lower";
  if (code >= 123 && code <= 126) return "punct";
  if (code === 32) return "space";
  return "other";
}

function buildCharInfo(code: number): CharInfo {
  let char = "";
  try {
    char = String.fromCodePoint(code);
  } catch {
    char = "?";
  }
  const display = code < 32 || code === 127 ? "" : char;
  return {
    code,
    char: display,
    name: getCharName(code),
    hex: code.toString(16).toUpperCase().padStart(code > 255 ? 4 : 2, "0"),
    oct: code.toString(8),
    html: code < 128 && display ? (["&", "<", ">", '"', "'"].includes(display) ? `&#${code};` : display) : `&#${code};`,
    category: getCategory(code),
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  control: "var(--text-secondary, #6b7280)",
  punct: "#d97706",
  digit: "#2563eb",
  upper: "#16a34a",
  lower: "#7c3aed",
  space: "#6b7280",
  other: "var(--text-primary, #111)",
};

export function AsciiUnicodeTable() {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState(0);
  const [selectedChar, setSelectedChar] = useState<CharInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const range = UNICODE_RANGES[selectedRange];

  // For large ranges, limit display to first 512 chars unless searching
  const MAX_DISPLAY = 512;
  const isLargeRange = (range.end - range.start + 1) > MAX_DISPLAY;

  const chars = useMemo<CharInfo[]>(() => {
    if (search.trim()) {
      // Search by decimal, hex, char, or name
      const q = search.trim().toLowerCase();
      const results: CharInfo[] = [];
      // Search in current range first
      const start = range.start;
      const end = Math.min(range.end, range.start + 8192); // cap for perf
      for (let i = start; i <= end && results.length < 256; i++) {
        const info = buildCharInfo(i);
        if (
          info.char.toLowerCase() === q ||
          info.code.toString() === q ||
          info.hex.toLowerCase() === q.replace(/^0x/, "") ||
          info.name.toLowerCase().includes(q) ||
          `u+${info.hex.toLowerCase()}` === q
        ) {
          results.push(info);
        }
      }
      return results;
    }
    const end = isLargeRange ? range.start + MAX_DISPLAY - 1 : range.end;
    const result: CharInfo[] = [];
    for (let i = range.start; i <= end; i++) {
      result.push(buildCharInfo(i));
    }
    return result;
  }, [search, range, isLargeRange]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--text-secondary, #6b7280)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {locale === "ko"
            ? "ASCII 및 유니코드 문자 코드를 검색하고 10진수, 16진수, HTML 엔티티 등을 확인합니다."
            : "Look up ASCII and Unicode character codes — decimal, hex, HTML entity, and more."}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.25rem", display: "block" }}>
            {locale === "ko" ? "검색 (문자, 코드, 이름)" : "Search (char, code, name)"}
          </label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
            placeholder={locale === "ko" ? "A, 65, 0x41, LF ..." : "A, 65, 0x41, LF ..."}
          />
        </div>
        <div style={{ flex: 2, minWidth: 220 }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.25rem", display: "block" }}>
            {locale === "ko" ? "범위" : "Range"}
          </label>
          <select
            value={selectedRange}
            onChange={e => { setSelectedRange(Number(e.target.value)); setSearch(""); }}
            style={{ ...inputStyle, cursor: "pointer", width: "100%" }}
          >
            {UNICODE_RANGES.map((r, i) => (
              <option key={i} value={i}>{locale === "ko" ? r.label.ko : r.label.en}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Character grid */}
      <div style={cardStyle}>
        {isLargeRange && !search && (
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
            {locale === "ko"
              ? `이 범위에는 ${range.end - range.start + 1}개 문자가 있습니다. 처음 ${MAX_DISPLAY}개를 표시합니다. 검색으로 특정 문자를 찾으세요.`
              : `This range has ${range.end - range.start + 1} characters. Showing first ${MAX_DISPLAY}. Use search to find specific characters.`}
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
            gap: "0.25rem",
          }}
        >
          {chars.map(info => (
            <button
              key={info.code}
              onClick={() => setSelectedChar(info)}
              title={`${info.name} (${info.code})`}
              style={{
                padding: "0.375rem 0.25rem",
                background: selectedChar?.code === info.code ? "var(--accent, #3b82f6)" : "var(--bg-secondary, #f3f4f6)",
                color: selectedChar?.code === info.code ? "#fff" : CATEGORY_COLORS[info.category],
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: info.char ? "1rem" : "0.625rem",
                fontFamily: "monospace",
                textAlign: "center",
                lineHeight: 1.4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ minHeight: "1.2em" }}>{info.char || <span style={{ fontSize: "0.5rem", opacity: 0.7 }}>{info.name}</span>}</span>
              <span style={{ fontSize: "0.5625rem", opacity: 0.7 }}>{info.code}</span>
            </button>
          ))}
          {chars.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--text-secondary, #6b7280)" }}>
              {locale === "ko" ? "검색 결과가 없습니다." : "No results found."}
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedChar && (
        <div style={{ ...cardStyle, borderLeft: "4px solid var(--accent, #3b82f6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "2.5rem", fontFamily: "monospace", color: "var(--text-primary, #111)", lineHeight: 1 }}>
                {selectedChar.char || <span style={{ fontSize: "1rem", color: "var(--text-secondary, #6b7280)" }}>{selectedChar.name}</span>}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary, #111)" }}>{selectedChar.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
                  {locale === "ko" ? "카테고리: " : "Category: "}
                  {selectedChar.category}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(selectedChar.char || String(selectedChar.code))}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                background: "var(--accent, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? (locale === "ko" ? "복사됨!" : "Copied!") : (locale === "ko" ? "복사" : "Copy")}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem" }}>
            {[
              { label: locale === "ko" ? "10진수" : "Decimal", value: String(selectedChar.code) },
              { label: locale === "ko" ? "16진수" : "Hex", value: `0x${selectedChar.hex}` },
              { label: locale === "ko" ? "8진수" : "Octal", value: `0${selectedChar.oct}` },
              { label: "Binary", value: selectedChar.code.toString(2).padStart(8, "0") },
              { label: "Unicode", value: `U+${selectedChar.hex.padStart(4, "0")}` },
              { label: "HTML Entity", value: selectedChar.html },
              { label: "URL Encoded", value: selectedChar.char ? encodeURIComponent(selectedChar.char) : "" },
            ].map(({ label, value }) => value ? (
              <div
                key={label}
                onClick={() => handleCopy(value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "var(--bg-secondary, #f3f4f6)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1px solid transparent",
                }}
                title={locale === "ko" ? "클릭하여 복사" : "Click to copy"}
              >
                <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary, #6b7280)", marginBottom: "0.125rem" }}>{label}</div>
                <div style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary, #111)" }}>{value}</div>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", fontSize: "0.75rem" }}>
        {Object.entries(CATEGORY_COLORS)
          .filter(([k]) => k !== "other")
          .map(([k, color]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }}></span>
            <span style={{ color: "var(--text-secondary, #6b7280)" }}>{k}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
