"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type Unit = "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "KiB" | "MiB" | "GiB" | "TiB" | "PiB";

const SI_UNITS: { unit: Unit; label: string; bytes: number }[] = [
  { unit: "B", label: "Bytes (B)", bytes: 1 },
  { unit: "KB", label: "Kilobytes (KB)", bytes: 1_000 },
  { unit: "MB", label: "Megabytes (MB)", bytes: 1_000_000 },
  { unit: "GB", label: "Gigabytes (GB)", bytes: 1_000_000_000 },
  { unit: "TB", label: "Terabytes (TB)", bytes: 1_000_000_000_000 },
  { unit: "PB", label: "Petabytes (PB)", bytes: 1_000_000_000_000_000 },
];

const BINARY_UNITS: { unit: Unit; label: string; bytes: number }[] = [
  { unit: "KiB", label: "Kibibytes (KiB)", bytes: 1_024 },
  { unit: "MiB", label: "Mebibytes (MiB)", bytes: 1_048_576 },
  { unit: "GiB", label: "Gibibytes (GiB)", bytes: 1_073_741_824 },
  { unit: "TiB", label: "Tebibytes (TiB)", bytes: 1_099_511_627_776 },
  { unit: "PiB", label: "Pebibytes (PiB)", bytes: 1_125_899_906_842_624 },
];

const ALL_UNITS = [...SI_UNITS, ...BINARY_UNITS];

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (n < 0.0001 && n > 0) return n.toExponential(4);
  if (n >= 1e15) return n.toExponential(4);
  // Up to 10 significant digits
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "1rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  flex: 1,
  minWidth: 0,
};

const selectStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

export function ByteUnitConverter() {
  const { t } = useLocale();
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<Unit>("GB");

  const parsed = parseFloat(value.replace(/,/g, ""));
  const isValid = !isNaN(parsed) && isFinite(parsed) && parsed >= 0;

  const baseBytes = isValid
    ? parsed * (ALL_UNITS.find((u) => u.unit === unit)?.bytes ?? 1)
    : null;

  const presets = [
    { label: "1 KB", value: "1", unit: "KB" as Unit },
    { label: "1 MB", value: "1", unit: "MB" as Unit },
    { label: "1 GB", value: "1", unit: "GB" as Unit },
    { label: "1 TB", value: "1", unit: "TB" as Unit },
    { label: "512 MB", value: "512", unit: "MB" as Unit },
    { label: "4 GiB", value: "4", unit: "GiB" as Unit },
  ];

  return (
    <div>
      {/* Input Row */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>{t({ ko: "변환할 값", en: "Value to Convert" })}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1"
            min="0"
            style={inputStyle}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} style={selectStyle}>
            <optgroup label={t({ ko: "SI 단위 (10진수)", en: "SI Units (Decimal)" })}>
              {SI_UNITS.map((u) => (
                <option key={u.unit} value={u.unit}>{u.unit}</option>
              ))}
            </optgroup>
            <optgroup label={t({ ko: "이진 단위 (2진수)", en: "Binary Units (Binary)" })}>
              {BINARY_UNITS.map((u) => (
                <option key={u.unit} value={u.unit}>{u.unit}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>{t({ ko: "빠른 선택", en: "Quick Presets" })}</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => { setValue(p.value); setUnit(p.unit); }}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.8125rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: value === p.value && unit === p.unit ? "var(--text-primary, #111)" : "transparent",
                color: value === p.value && unit === p.unit ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {baseBytes !== null && isValid ? (
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary, #111)", marginBottom: "0.75rem" }}>
            {t({ ko: "변환 결과", en: "Conversion Results" })}
          </h2>

          {/* Base bytes display */}
          <div style={{
            background: "var(--result-bg, #f0fdf4)",
            borderRadius: "8px",
            padding: "0.875rem 1rem",
            marginBottom: "1rem",
            fontFamily: "monospace",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--text-primary, #111)",
          }}>
            = {baseBytes.toLocaleString()} {t({ ko: "바이트", en: "bytes" })}
          </div>

          {/* SI Units */}
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.5rem" }}>
              {t({ ko: "SI 단위 (10진수, 1 KB = 1,000 B)", en: "SI Units (Decimal, 1 KB = 1,000 B)" })}
            </h3>
            <div style={{ background: "var(--result-bg, #f0fdf4)", borderRadius: "8px", overflow: "hidden" }}>
              {SI_UNITS.map((u, i) => {
                const converted = baseBytes / u.bytes;
                return (
                  <div
                    key={u.unit}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0.875rem",
                      borderBottom: i < SI_UNITS.length - 1 ? "1px solid var(--border-light, #f3f4f6)" : "none",
                      background: u.unit === unit ? "var(--warning-bg, #fef3c7)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary, #6b7280)", fontWeight: u.unit === unit ? 700 : 400 }}>
                      {u.label}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary, #111)" }}>
                      {formatNum(converted)} {u.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Binary Units */}
          <div>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)", marginBottom: "0.5rem" }}>
              {t({ ko: "이진 단위 (2진수, 1 KiB = 1,024 B)", en: "Binary Units (Binary, 1 KiB = 1,024 B)" })}
            </h3>
            <div style={{ background: "var(--result-bg, #f0fdf4)", borderRadius: "8px", overflow: "hidden" }}>
              {BINARY_UNITS.map((u, i) => {
                const converted = baseBytes / u.bytes;
                return (
                  <div
                    key={u.unit}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0.875rem",
                      borderBottom: i < BINARY_UNITS.length - 1 ? "1px solid var(--border-light, #f3f4f6)" : "none",
                      background: u.unit === unit ? "var(--warning-bg, #fef3c7)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary, #6b7280)", fontWeight: u.unit === unit ? 700 : 400 }}>
                      {u.label}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary, #111)" }}>
                      {formatNum(converted)} {u.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : value && !isValid ? (
        <div style={{ background: "var(--error-bg, #fef2f2)", borderRadius: "8px", padding: "1rem", color: "var(--error, #dc2626)", fontSize: "0.875rem" }}>
          {t({ ko: "유효한 숫자를 입력해주세요.", en: "Please enter a valid number." })}
        </div>
      ) : null}
    </div>
  );
}
