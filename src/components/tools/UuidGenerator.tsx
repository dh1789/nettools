"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

// UUID v4 using Web Crypto API
function generateUuidV4(): string {
  return crypto.randomUUID();
}

function padHex(n: number, len: number): string {
  return Math.floor(n).toString(16).padStart(len, "0");
}

// UUID v7 — time-ordered (Unix ms timestamp in top 48 bits)
// Format: tttttttt-tttt-7rrr-8rrr-rrrrrrrrrrrr
function generateUuidV7(): string {
  const now = Date.now(); // 48 bits worth (< 2^48 until year 10889)
  const rand = crypto.getRandomValues(new Uint8Array(10));

  // 48-bit timestamp split into high 32 bits and low 16 bits
  const tsHigh = Math.floor(now / 0x10000); // top 32 bits
  const tsLow = now & 0xffff; // low 16 bits

  // version nibble (0x7) + 12 random bits
  const verRandA = 0x7000 | ((rand[0] << 4) | (rand[1] >> 4)) & 0x0fff;

  // variant (0b10) + 14 random bits for clock_seq_hi
  const varRandB = 0x8000 | ((rand[2] & 0x3f) << 8) | rand[3];

  // 48-bit random node
  const node = Array.from(rand.slice(4))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    padHex(tsHigh, 8),
    padHex(tsLow, 4),
    padHex(verRandA, 4),
    padHex(varRandB, 4),
    node,
  ].join("-");
}

// UUID v1 — simplified timestamp-based
function generateUuidV1(): string {
  // Gregorian offset: 100-nanosecond intervals between 1582-10-15 and 1970-01-01
  const OFFSET = 122192928000000000;
  const now = Date.now();
  // milliseconds to 100-ns intervals
  const ts100ns = now * 10000 + OFFSET;

  // Split: ts100ns can exceed safe integer; use floored division
  // low 32 bits of 60-bit timestamp
  const timeLow = ts100ns % 0x100000000;
  const tsHigh = Math.floor(ts100ns / 0x100000000);
  const timeMid = tsHigh & 0xffff;
  const timeHi = (tsHigh >>> 16) & 0x0fff | 0x1000; // version 1

  const clockSeq = (Math.floor(Math.random() * 0x3fff)) | 0x8000;

  const node = crypto.getRandomValues(new Uint8Array(6));
  node[0] |= 0x01; // multicast bit
  const nodeHex = Array.from(node).map((b) => b.toString(16).padStart(2, "0")).join("");

  return [
    padHex(timeLow, 8),
    padHex(timeMid, 4),
    padHex(timeHi, 4),
    padHex(clockSeq, 4),
    nodeHex,
  ].join("-");
}

// ULID — 26-char Crockford Base32
const ULID_CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeBase32(value: number, chars: number): string {
  let result = "";
  let v = value;
  for (let i = 0; i < chars; i++) {
    result = ULID_CHARS[v & 0x1f] + result;
    v = Math.floor(v / 32);
  }
  return result;
}

function generateUlid(): string {
  const now = Date.now();
  // Time part: 10 Crockford base32 chars (48 bits covers current timestamps)
  const ts = encodeBase32(now, 10);

  // Random part: 16 chars
  const randBytes = crypto.getRandomValues(new Uint8Array(10));
  let randomPart = "";
  for (let i = 0; i < 10; i++) {
    randomPart += ULID_CHARS[randBytes[i] % 32];
  }
  // Pad to 16 chars with additional random chars
  while (randomPart.length < 16) {
    randomPart += ULID_CHARS[Math.floor(Math.random() * 32)];
  }

  return ts + randomPart;
}

type UuidType = "v4" | "v7" | "v1" | "ulid";

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.875rem",
  fontSize: "0.875rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
};

export function UuidGenerator() {
  const { t } = useLocale();
  const [uuidType, setUuidType] = useState<UuidType>("v4");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateOne = useCallback((type: UuidType): string => {
    switch (type) {
      case "v4": return generateUuidV4();
      case "v7": return generateUuidV7();
      case "v1": return generateUuidV1();
      case "ulid": return generateUlid();
    }
  }, []);

  const handleGenerate = useCallback(() => {
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      items.push(generateOne(uuidType));
    }
    setResults(items);
    setCopiedIdx(null);
    setCopiedAll(false);
  }, [count, uuidType, generateOne]);

  const handleCopyOne = (val: string, idx: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const TYPE_LABELS: Record<UuidType, string> = {
    v4: "UUID v4 (Random)",
    v7: "UUID v7 (Time-ordered)",
    v1: "UUID v1 (Timestamp)",
    ulid: "ULID (Sortable)",
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.25rem", display: "block" }}>
            {t({ ko: "생성 타입", en: "Type" })}
          </label>
          <select
            value={uuidType}
            onChange={(e) => setUuidType(e.target.value as UuidType)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {(Object.entries(TYPE_LABELS) as [UuidType, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div style={{ width: "120px" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.25rem", display: "block" }}>
            {t({ ko: "개수", en: "Count" })}
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            style={inputStyle}
          />
        </div>
        <button
          onClick={handleGenerate}
          style={{
            padding: "0.625rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            background: "var(--text-primary, #111)",
            color: "var(--surface, #fff)",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          {t({ ko: "생성", en: "Generate" })}
        </button>
      </div>

      {/* Type info */}
      <div style={{
        fontSize: "0.8125rem",
        color: "var(--text-secondary, #6b7280)",
        background: "var(--result-bg, #f9fafb)",
        border: "1px solid var(--border, #d1d5db)",
        borderRadius: "8px",
        padding: "0.625rem 1rem",
        marginBottom: "1rem",
      }}>
        {uuidType === "v4" && t({ ko: "128비트 완전 랜덤 UUID. 가장 일반적으로 사용됩니다.", en: "128-bit fully random UUID. Most commonly used." })}
        {uuidType === "v7" && t({ ko: "Unix 타임스탬프 기반의 시간 정렬 UUID. 데이터베이스 인덱싱에 적합합니다.", en: "Time-ordered UUID based on Unix timestamp. Great for database indexing." })}
        {uuidType === "v1" && t({ ko: "60비트 타임스탬프 기반 UUID. 시계 시퀀스와 노드 ID를 포함합니다.", en: "UUID based on 60-bit timestamp with clock sequence and node ID." })}
        {uuidType === "ulid" && t({ ko: "26자 Crockford Base32 인코딩. 시간 정렬 가능하고 대소문자를 구분하지 않습니다.", en: "26-char Crockford Base32 encoding. Time-sortable and case-insensitive." })}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)" }}>
              {t({ ko: `${results.length}개 결과`, en: `${results.length} results` })}
            </span>
            <button
              onClick={handleCopyAll}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: copiedAll ? "#10b981" : "transparent",
                color: copiedAll ? "#fff" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copiedAll ? t(T.copied) : t(T.copyAll)}
            </button>
          </div>
          <div style={{
            background: "var(--result-bg, #f9fafb)",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            overflow: "hidden",
          }}>
            {results.map((val, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  borderBottom: idx < results.length - 1 ? "1px solid var(--border, #d1d5db)" : "none",
                  gap: "0.5rem",
                }}
              >
                <code style={{ fontSize: "0.8125rem", fontFamily: "monospace", wordBreak: "break-all", flex: 1, color: "var(--text-primary, #111)" }}>
                  {val}
                </code>
                <button
                  onClick={() => handleCopyOne(val, idx)}
                  style={{
                    padding: "0.25rem 0.625rem",
                    fontSize: "0.75rem",
                    border: "1px solid var(--border, #d1d5db)",
                    borderRadius: "6px",
                    background: copiedIdx === idx ? "#10b981" : "transparent",
                    color: copiedIdx === idx ? "#fff" : "var(--text-secondary, #6b7280)",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {copiedIdx === idx ? t(T.copied) : t(T.copy)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
