"use client";

import { useState, useEffect } from "react";
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

const resultRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.625rem 0.875rem",
  borderBottom: "1px solid var(--border, #d1d5db)",
};

const resultLabelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "var(--text-secondary, #6b7280)",
  flexShrink: 0,
  marginRight: "1rem",
};

const resultValueStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontFamily: "monospace",
  color: "var(--text-primary, #111)",
  wordBreak: "break-all",
};

function padZero(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDatetime(d: Date): string {
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())} ${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
}

function formatDatetimeUtc(d: Date): string {
  return `${d.getUTCFullYear()}-${padZero(d.getUTCMonth() + 1)}-${padZero(d.getUTCDate())} ${padZero(d.getUTCHours())}:${padZero(d.getUTCMinutes())}:${padZero(d.getUTCSeconds())} UTC`;
}

interface ConvertResult {
  unix: number;
  local: string;
  utc: string;
  iso: string;
  relative: string;
}

function getRelative(d: Date, locale: string): string {
  const now = Date.now();
  const diff = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (abs < 60) return rtf.format(diff, "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), "month");
  return rtf.format(Math.round(diff / 31536000), "year");
}

export function UnixTimestamp() {
  const { locale, t } = useLocale();
  const [tsInput, setTsInput] = useState("");
  const [dtInput, setDtInput] = useState("");
  const [tsResult, setTsResult] = useState<ConvertResult | null>(null);
  const [dtResult, setDtResult] = useState<ConvertResult | null>(null);
  const [tsError, setTsError] = useState("");
  const [dtError, setDtError] = useState("");
  const [copiedTs, setCopiedTs] = useState<string | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleConvertTs = () => {
    setTsError("");
    setTsResult(null);
    const raw = tsInput.trim();
    if (!raw) {
      setTsError(t({ ko: "Unix 타임스탬프를 입력하세요.", en: "Please enter a Unix timestamp." }));
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      setTsError(t({ ko: "유효하지 않은 타임스탬프입니다.", en: "Invalid timestamp." }));
      return;
    }
    const ms = Math.abs(num) > 1e10 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setTsError(t({ ko: "변환할 수 없는 타임스탬프입니다.", en: "Cannot convert this timestamp." }));
      return;
    }
    setTsResult({
      unix: Math.floor(ms / 1000),
      local: formatDatetime(d),
      utc: formatDatetimeUtc(d),
      iso: d.toISOString(),
      relative: getRelative(d, locale),
    });
  };

  const handleConvertDt = () => {
    setDtError("");
    setDtResult(null);
    const raw = dtInput.trim();
    if (!raw) {
      setDtError(t({ ko: "날짜/시간을 입력하세요.", en: "Please enter a date/time." }));
      return;
    }
    const d = new Date(raw);
    if (isNaN(d.getTime())) {
      setDtError(t({ ko: "유효하지 않은 날짜/시간 형식입니다.", en: "Invalid date/time format." }));
      return;
    }
    setDtResult({
      unix: Math.floor(d.getTime() / 1000),
      local: formatDatetime(d),
      utc: formatDatetimeUtc(d),
      iso: d.toISOString(),
      relative: getRelative(d, locale),
    });
  };

  const useNow = () => {
    setTsInput(now.toString());
    setTsError("");
    setTsResult(null);
  };

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedTs(key);
    setTimeout(() => setCopiedTs(null), 2000);
  };

  const renderResult = (result: ConvertResult, prefix: string) => (
    <div
      style={{
        border: "1px solid var(--border, #d1d5db)",
        borderRadius: "8px",
        overflow: "hidden",
        marginTop: "1rem",
      }}
    >
      {[
        { label: t({ ko: "Unix 타임스탬프", en: "Unix Timestamp" }), value: result.unix.toString(), key: `${prefix}-unix` },
        { label: t({ ko: "로컬 시간", en: "Local Time" }), value: result.local, key: `${prefix}-local` },
        { label: "UTC", value: result.utc, key: `${prefix}-utc` },
        { label: "ISO 8601", value: result.iso, key: `${prefix}-iso` },
        { label: t({ ko: "상대 시간", en: "Relative Time" }), value: result.relative, key: `${prefix}-rel` },
      ].map(({ label, value, key }) => (
        <div key={key} style={resultRowStyle}>
          <span style={resultLabelStyle}>{label}</span>
          <span style={resultValueStyle}>{value}</span>
          <button
            onClick={() => copyValue(value, key)}
            style={{ ...((copiedTs === key) ? copiedButtonStyle : smallButtonStyle), marginLeft: "0.5rem", flexShrink: 0 }}
          >
            {copiedTs === key ? t(T.copied) : t(T.copy)}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Current time banner */}
      <div
        style={{
          padding: "0.875rem 1rem",
          background: "var(--input-bg, #f9fafb)",
          border: "1px solid var(--border, #d1d5db)",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
          {t({ ko: "현재 Unix 타임스탬프", en: "Current Unix Timestamp" })}
        </span>
        <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary, #111)" }}>
          {now}
        </span>
      </div>

      {/* Timestamp → Date */}
      <section>
        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary, #111)" }}>
          {t({ ko: "Unix 타임스탬프 → 날짜/시간", en: "Unix Timestamp → Date/Time" })}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={labelStyle}>
              {t({ ko: "타임스탬프 (초)", en: "Timestamp (seconds)" })}
            </label>
            <input
              type="number"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvertTs()}
              placeholder={t({ ko: "예: 1700000000", en: "e.g. 1700000000" })}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={handleConvertTs} style={buttonStyle}>
              {t({ ko: "변환", en: "Convert" })}
            </button>
            <button onClick={useNow} style={smallButtonStyle}>
              {t({ ko: "지금", en: "Now" })}
            </button>
          </div>
        </div>
        {tsError && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.5rem" }}>{tsError}</p>
        )}
        {tsResult && renderResult(tsResult, "ts")}
      </section>

      {/* Date → Timestamp */}
      <section>
        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary, #111)" }}>
          {t({ ko: "날짜/시간 → Unix 타임스탬프", en: "Date/Time → Unix Timestamp" })}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={labelStyle}>
              {t({ ko: "날짜/시간", en: "Date/Time" })}
            </label>
            <input
              type="datetime-local"
              value={dtInput}
              onChange={(e) => setDtInput(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={handleConvertDt} style={buttonStyle}>
              {t({ ko: "변환", en: "Convert" })}
            </button>
          </div>
        </div>
        {dtError && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.5rem" }}>{dtError}</p>
        )}
        {dtResult && renderResult(dtResult, "dt")}
      </section>

      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
        {t({
          ko: "Unix 타임스탬프는 1970년 1월 1일 00:00:00 UTC(Unix 에포크)부터 경과한 초 단위 시간입니다.",
          en: "Unix timestamp is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC (Unix epoch).",
        })}
      </p>
    </div>
  );
}
