"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface OuiDB {
  l: Record<string, string>; // MA-L 24-bit (6 hex)
  m: Record<string, string>; // MA-M 28-bit (7 hex)
  s: Record<string, string>; // MA-S 36-bit (9 hex)
}

interface LookupResult {
  oui: string;
  vendor: string;
  mac: string;
  type: "MA-L" | "MA-M" | "MA-S";
}

function normalizeMac(input: string): string | null {
  const cleaned = input.replace(/[\s.:\-]/g, "").toUpperCase();
  if (!/^[0-9A-F]{6,12}$/.test(cleaned)) return null;
  return cleaned;
}

function formatMac(hex: string): string {
  const padded = hex.padEnd(12, "0");
  return padded.match(/.{2}/g)!.join(":");
}

function formatPrefix(hex: string): string {
  return hex.match(/.{2}/g)!.join(":");
}

function lookupOui(db: OuiDB, mac: string): LookupResult | null {
  // MA-S (36-bit, 9 hex) → MA-M (28-bit, 7 hex) → MA-L (24-bit, 6 hex)
  const s9 = mac.slice(0, 9);
  if (s9.length >= 9 && db.s[s9]) {
    return { oui: formatPrefix(s9), vendor: db.s[s9], mac: formatMac(mac), type: "MA-S" };
  }
  const m7 = mac.slice(0, 7);
  if (m7.length >= 7 && db.m[m7]) {
    return { oui: formatPrefix(m7), vendor: db.m[m7], mac: formatMac(mac), type: "MA-M" };
  }
  const l6 = mac.slice(0, 6);
  if (db.l[l6]) {
    return { oui: formatPrefix(l6), vendor: db.l[l6], mac: formatMac(mac), type: "MA-L" };
  }
  return null;
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
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const resultRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem 0",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
};

const resultLabelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--text-secondary, #6b7280)",
};

const resultValueStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontFamily: "monospace",
  fontWeight: 600,
  color: "var(--text-primary, #111)",
};

export function MacOuiLookup() {
  const { t, tf } = useLocale();
  const [mac, setMac] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [dbLoading, setDbLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dbEntryCount, setDbEntryCount] = useState(0);
  const dbRef = useRef<OuiDB | null>(null);

  useEffect(() => {
    fetch("/oui-db.json")
      .then((res) => res.json())
      .then((data: OuiDB) => {
        dbRef.current = data;
        setDbEntryCount(
          Object.keys(data.l).length +
          Object.keys(data.m).length +
          Object.keys(data.s).length
        );
        setDbLoading(false);
      })
      .catch(() => setDbLoading(false));
  }, []);

  const handleLookup = useCallback(() => {
    setError("");
    setResult(null);

    const normalized = normalizeMac(mac);
    if (!normalized || normalized.length < 6) {
      setError(t(T.invalidMac));
      return;
    }

    if (!dbRef.current) {
      setError(t(T.ouiDbLoading));
      return;
    }

    const found = lookupOui(dbRef.current, normalized);
    if (found) {
      setResult(found);
    } else {
      setError(tf(T.ouiNotFound, { oui: formatPrefix(normalized.slice(0, 6)) }));
    }
  }, [mac, t, tf]);

  const handleInputChange = (value: string) => {
    setMac(value);
    setError("");
    setResult(null);
  };

  const copyResult = () => {
    if (!result) return;
    const text = [
      `MAC: ${result.mac}`,
      `OUI: ${result.oui}`,
      `Type: ${result.type}`,
      `Vendor: ${result.vendor}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>{t(T.macAddress)}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={mac}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="AA:BB:CC:DD:EE:FF"
            maxLength={17}
            style={inputStyle}
          />
          <button
            onClick={handleLookup}
            disabled={dbLoading}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              background: dbLoading ? "#9ca3af" : "#3b82f6",
              color: "#fff",
              cursor: dbLoading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            {dbLoading ? t(T.ouiDbLoadingShort) : t(T.lookup)}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t(T.supportedFormats)}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
              }}
            >
              {t(T.lookupResult)}
            </h2>
            <button
              onClick={copyResult}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: copied ? "#10b981" : "transparent",
                color: copied ? "#fff" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>

          {/* Vendor highlight */}
          <div
            style={{
              padding: "1.25rem",
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                marginBottom: "0.25rem",
              }}
            >
              {t(T.manufacturerVendor)}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
              }}
            >
              {result.vendor}
            </div>
          </div>

          {/* Details */}
          <div
            style={{
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.macAddress)}</span>
              <span style={resultValueStyle}>{result.mac}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ouiPrefix)}</span>
              <span style={resultValueStyle}>{result.oui}</span>
            </div>
            <div style={{ ...resultRowStyle, borderBottom: "none" }}>
              <span style={resultLabelStyle}>{t(T.ouiType)}</span>
              <span
                style={{
                  ...resultValueStyle,
                  fontSize: "0.75rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "4px",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontFamily: "inherit",
                }}
              >
                {result.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* OUI 설명 */}
      {!result && !error && (
        <div
          style={{
            padding: "1.25rem",
            background: "var(--info-bg, #eff6ff)",
            borderRadius: "8px",
            fontSize: "0.8125rem",
            lineHeight: 1.7,
            color: "var(--text-secondary, #6b7280)",
          }}
        >
          <strong style={{ color: "var(--text-primary, #111)" }}>
            OUI (Organizationally Unique Identifier)
          </strong>
          <br />
          {t(T.ouiDescription)}
          <br />
          <br />
          <strong style={{ color: "var(--text-primary, #111)" }}>
            {dbLoading
              ? t(T.ouiDbLoadingShort)
              : tf(T.ouiDbCount, { count: dbEntryCount.toLocaleString() })}
          </strong>
          {" "}| MA-L (24-bit) + MA-M (28-bit) + MA-S (36-bit)
        </div>
      )}
    </div>
  );
}
