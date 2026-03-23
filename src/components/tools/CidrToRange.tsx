"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface CidrResult {
  network: string;
  broadcast: string;
  firstIp: string;
  lastIp: string;
  totalIps: number;
  subnetMask: string;
  wildcardMask: string;
  cidr: number;
  ipBinary: string;
  maskBinary: string;
}

function ipToInt(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

function intToBinary(int: number): string {
  return [
    ((int >>> 24) & 255).toString(2).padStart(8, "0"),
    ((int >>> 16) & 255).toString(2).padStart(8, "0"),
    ((int >>> 8) & 255).toString(2).padStart(8, "0"),
    (int & 255).toString(2).padStart(8, "0"),
  ].join(".");
}

function parseCidr(input: string): { ip: string; cidr: number } | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) return null;

  const ip = match[1];
  const cidr = parseInt(match[2], 10);

  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < 0 || n > 255 || p !== String(n)) return null;
  }

  if (cidr < 0 || cidr > 32) return null;

  return { ip, cidr };
}

function calculate(ip: string, cidr: number): CidrResult {
  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalIps = Math.pow(2, 32 - cidr);

  return {
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    firstIp: intToIp(networkInt),
    lastIp: intToIp(broadcastInt),
    totalIps,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    cidr,
    ipBinary: intToBinary(ipInt),
    maskBinary: intToBinary(maskInt),
  };
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

export function CidrToRange() {
  const { t, tf } = useLocale();
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<CidrResult | null>(() => calculate("192.168.1.0", 24));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    const parsed = parseCidr(input);
    if (!parsed) {
      setError(t(T.cidrInvalidFormat));
      setResult(null);
      return;
    }
    setError("");
    setResult(calculate(parsed.ip, parsed.cidr));
  }, [input, t]);

  const handleInputChange = (value: string) => {
    setInput(value);
    const parsed = parseCidr(value);
    if (parsed) {
      setError("");
      setResult(calculate(parsed.ip, parsed.cidr));
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      `CIDR: ${input}`,
      `First IP: ${result.firstIp}`,
      `Last IP: ${result.lastIp}`,
      `Total IPs: ${result.totalIps.toLocaleString()}`,
      `Subnet Mask: ${result.subnetMask}`,
      `Wildcard Mask: ${result.wildcardMask}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t(T.cidrNotation)}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            placeholder="192.168.1.0/24"
            style={{
              ...inputStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
              flex: 1,
            }}
          />
          <button onClick={handleConvert} style={buttonStyle}>
            {t(T.convert)}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t(T.cidrFormatHint)}
        </p>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Results */}
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
              {t(T.results)}
            </h2>
            <button
              onClick={copyAll}
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
              {copied ? t(T.copied) : t(T.copyAll)}
            </button>
          </div>

          {/* IP Range highlight */}
          <div
            style={{
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                marginBottom: "0.375rem",
              }}
            >
              {t(T.cidrIpRange)}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontFamily: "monospace",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
              }}
            >
              {result.firstIp} — {result.lastIp}
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                marginTop: "0.375rem",
              }}
            >
              {tf(T.cidrTotalCount, { count: result.totalIps.toLocaleString() })}
            </div>
          </div>

          {/* Detail table */}
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.cidrFirstIp)}</span>
              <span style={resultValueStyle}>{result.firstIp}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.cidrLastIp)}</span>
              <span style={resultValueStyle}>{result.lastIp}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.cidrTotalIps)}</span>
              <span style={resultValueStyle}>
                {result.totalIps.toLocaleString()}
              </span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.subnetMask)}</span>
              <span style={resultValueStyle}>{result.subnetMask}</span>
            </div>
            <div style={{ ...resultRowStyle, borderBottom: "none" }}>
              <span style={resultLabelStyle}>{t(T.wildcardMask)}</span>
              <span style={resultValueStyle}>{result.wildcardMask}</span>
            </div>
          </div>

          {/* Binary representation */}
          <details>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                userSelect: "none",
              }}
            >
              {t(T.binaryRepresentation)}
            </summary>
            <div
              style={{
                marginTop: "0.5rem",
                fontFamily: "monospace",
                fontSize: "0.8125rem",
                lineHeight: 1.8,
                color: "var(--text-primary, #111)",
              }}
            >
              <div>IP:   {result.ipBinary}</div>
              <div>Mask: {result.maskBinary}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
