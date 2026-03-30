"use client";

import { useState } from "react";
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

const badgeStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  padding: "0.125rem 0.375rem",
  borderRadius: "4px",
  marginLeft: "0.375rem",
  verticalAlign: "middle",
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

const BASES = [
  { base: 2, label: "Binary", prefix: "0b", badge: "BIN", badgeBg: "#dbeafe", badgeColor: "#1d4ed8" },
  { base: 8, label: "Octal", prefix: "0o", badge: "OCT", badgeBg: "#fce7f3", badgeColor: "#9d174d" },
  { base: 10, label: "Decimal", prefix: "", badge: "DEC", badgeBg: "#dcfce7", badgeColor: "#166534" },
  { base: 16, label: "Hexadecimal", prefix: "0x", badge: "HEX", badgeBg: "#fef9c3", badgeColor: "#854d0e" },
] as const;

type BaseEntry = (typeof BASES)[number];

function parseInput(value: string, base: number): bigint | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  try {
    let raw = trimmed;
    if (base === 16 && raw.startsWith("0x")) raw = raw.slice(2);
    else if (base === 8 && raw.startsWith("0o")) raw = raw.slice(2);
    else if (base === 2 && raw.startsWith("0b")) raw = raw.slice(2);
    if (!raw) return null;
    return BigInt(`0${base === 10 ? "" : base === 16 ? "x" : base === 8 ? "o" : "b"}${raw}`);
  } catch {
    return null;
  }
}

export function NumberBaseConverter() {
  const { t } = useLocale();
  const [values, setValues] = useState<Record<number, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const [error, setError] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState<number | null>(null);

  const handleChange = (sourceBase: number, rawValue: string) => {
    const newValues: Record<number, string> = { ...values, [sourceBase]: rawValue };
    const parsed = parseInput(rawValue, sourceBase);
    const newError: Record<number, string> = {};

    if (rawValue.trim() && parsed === null) {
      newError[sourceBase] = t({ ko: "유효하지 않은 값입니다.", en: "Invalid value." });
      setValues(newValues);
      setError(newError);
      return;
    }

    if (parsed !== null) {
      for (const { base } of BASES) {
        if (base !== sourceBase) {
          newValues[base] = parsed.toString(base).toUpperCase();
        }
      }
    } else {
      for (const { base } of BASES) {
        if (base !== sourceBase) newValues[base] = "";
      }
    }

    setValues(newValues);
    setError(newError);
  };

  const copyValue = (base: number) => {
    navigator.clipboard.writeText(values[base] || "");
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setValues({ 2: "", 8: "", 10: "", 16: "" });
    setError({});
    setCopied(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleClear} style={smallButtonStyle}>
          {t({ ko: "초기화", en: "Clear" })}
        </button>
      </div>

      {/* Base inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {(BASES as readonly BaseEntry[]).map(({ base, label, prefix, badge, badgeBg, badgeColor }) => (
          <div key={base}>
            <label style={labelStyle}>
              {t({ ko: label === "Binary" ? "2진수" : label === "Octal" ? "8진수" : label === "Decimal" ? "10진수" : "16진수", en: label })}
              <span style={{ ...badgeStyle, background: badgeBg, color: badgeColor }}>
                {badge}
              </span>
              {prefix && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", fontFamily: "monospace", marginLeft: "0.375rem" }}>
                  ({prefix}...)
                </span>
              )}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={values[base]}
                onChange={(e) => handleChange(base, e.target.value)}
                placeholder={
                  base === 2 ? "e.g. 1010" :
                  base === 8 ? "e.g. 12" :
                  base === 10 ? "e.g. 10" :
                  "e.g. A"
                }
                style={{
                  ...inputStyle,
                  borderColor: error[base] ? "#ef4444" : "var(--border, #d1d5db)",
                  paddingRight: "5rem",
                }}
              />
              <button
                onClick={() => copyValue(base)}
                disabled={!values[base]}
                style={{
                  ...(copied === base ? copiedButtonStyle : smallButtonStyle),
                  position: "absolute",
                  right: "0.375rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {copied === base ? t(T.copied) : t(T.copy)}
              </button>
            </div>
            {error[base] && (
              <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
                {error[base]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bit visualization for binary */}
      {values[2] && !error[2] && (
        <div>
          <label style={labelStyle}>
            {t({ ko: "비트 시각화", en: "Bit Visualization" })}
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem",
              padding: "0.75rem",
              background: "var(--input-bg, #f9fafb)",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
            }}
          >
            {values[2]
              .padStart(Math.ceil(values[2].length / 8) * 8, "0")
              .split("")
              .map((bit, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.125rem" }}>
                  <span
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bit === "1" ? "var(--text-primary, #111)" : "var(--surface, #fff)",
                      color: bit === "1" ? "var(--surface, #fff)" : "var(--text-tertiary, #9ca3af)",
                      border: "1px solid var(--border, #d1d5db)",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {bit}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Info */}
      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>
        {t({
          ko: "임의의 필드에 값을 입력하면 다른 진수로 자동 변환됩니다. 음수는 지원하지 않습니다.",
          en: "Enter a value in any field and other bases will be automatically converted. Negative numbers are not supported.",
        })}
      </p>

      <style>{`
@media (max-width: 640px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
      `}</style>
    </div>
  );
}
