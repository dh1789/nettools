"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
  ipBinary: string;
  maskBinary: string;
  isPrivate: boolean;
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

function getIpClass(firstOctet: number): string {
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D (Multicast)";
  return "E (Reserved)";
}

function isPrivateIp(ip: number): boolean {
  const first = (ip >>> 24) & 255;
  const second = (ip >>> 16) & 255;
  if (first === 10) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  return false;
}

function validateIp(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = parseInt(p, 10);
    return !isNaN(n) && n >= 0 && n <= 255 && p === String(n);
  });
}

/** 구체적인 IP 에러를 반환. null이면 유효 */
function getIpError(ip: string): { key: "octets" | "range"; n?: number; val?: string } | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return { key: "octets" };
  for (let i = 0; i < 4; i++) {
    const p = parts[i];
    const n = parseInt(p, 10);
    if (isNaN(n) || n < 0 || n > 255 || p !== String(n)) {
      return { key: "range", n: i + 1, val: p };
    }
  }
  return null;
}

function cidrToMask(cidr: number): string {
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  return intToIp(maskInt);
}

function maskToCidr(mask: string): number | null {
  if (!validateIp(mask)) return null;
  const maskInt = ipToInt(mask);
  // 연속된 1 뒤에 연속된 0인지 검증
  const inverted = (~maskInt) >>> 0;
  if (((inverted + 1) & inverted) !== 0) return null;
  let bits = 0;
  let n = maskInt;
  while (n) {
    bits += n & 1;
    n >>>= 1;
  }
  return bits;
}

function calculate(ip: string, cidr: number): SubnetResult | null {
  if (!validateIp(ip) || cidr < 0 || cidr > 32) return null;

  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;
  const firstOctet = (ipInt >>> 24) & 255;

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
    lastHost: cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    totalHosts,
    usableHosts,
    cidr,
    ipClass: getIpClass(firstOctet),
    ipBinary: intToBinary(ipInt),
    maskBinary: intToBinary(maskInt),
    isPrivate: isPrivateIp(ipInt),
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

export function SubnetCalculator() {
  const { t, tf } = useLocale();
  const [ip, setIp] = useState("192.168.1.100");
  const [cidr, setCidr] = useState(24);
  const [mask, setMask] = useState("255.255.255.0");
  const [result, setResult] = useState<SubnetResult | null>(() =>
    calculate("192.168.1.100", 24),
  );
  const [copied, setCopied] = useState(false);
  const [ipError, setIpError] = useState("");
  const [maskError, setMaskError] = useState("");

  const handleCalculate = useCallback(() => {
    setResult(calculate(ip, cidr));
  }, [ip, cidr]);

  const resolveIpError = (value: string): string => {
    const err = getIpError(value);
    if (!err) return "";
    if (err.key === "octets") return t(T.ipNeedsFourOctets);
    return tf(T.ipOctetRange, { n: err.n!, val: err.val! });
  };

  const handleIpChange = (value: string) => {
    setIp(value);
    const err = resolveIpError(value);
    setIpError(err);
    const r = calculate(value, cidr);
    if (r) setResult(r);
  };

  const handleCidrChange = (value: number) => {
    setCidr(value);
    setMask(cidrToMask(value));
    setMaskError("");
    const r = calculate(ip, value);
    if (r) setResult(r);
  };

  const handleMaskChange = (value: string) => {
    setMask(value);
    const c = maskToCidr(value);
    if (c !== null) {
      setMaskError("");
      setCidr(c);
      const r = calculate(ip, c);
      if (r) setResult(r);
    } else if (value.length > 0) {
      const ipErr = getIpError(value);
      if (ipErr) {
        setMaskError(ipErr.key === "octets" ? t(T.ipNeedsFourOctets) : tf(T.ipOctetRange, { n: ipErr.n!, val: ipErr.val! }));
      } else {
        setMaskError(t(T.invalidMaskMsg));
      }
    } else {
      setMaskError("");
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      `IP: ${ip}/${cidr}`,
      `Network: ${result.networkAddress}`,
      `Broadcast: ${result.broadcastAddress}`,
      `Host Range: ${result.firstHost} - ${result.lastHost}`,
      `Subnet Mask: ${result.subnetMask}`,
      `Wildcard: ${result.wildcardMask}`,
      `Usable Hosts: ${result.usableHosts.toLocaleString()}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label style={labelStyle}>{t(T.ipAddress)}</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => handleIpChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            placeholder="192.168.1.100"
            style={{
              ...inputStyle,
              borderColor: ipError ? "#ef4444" : "var(--border, #d1d5db)",
            }}
          />
          {ipError && (
            <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
              {ipError}
            </p>
          )}
        </div>
        <div>
          <label style={labelStyle}>{t(T.subnetMask)}</label>
          <input
            type="text"
            value={mask}
            onChange={(e) => handleMaskChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            placeholder="255.255.255.0"
            style={{
              ...inputStyle,
              borderColor: maskError ? "#ef4444" : "var(--border, #d1d5db)",
            }}
          />
          {maskError && (
            <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
              {maskError}
            </p>
          )}
        </div>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>{tf(T.cidrPrefix, { cidr })}</label>
        <input
          type="range"
          min={0}
          max={32}
          value={cidr}
          onChange={(e) => handleCidrChange(parseInt(e.target.value))}
          style={{ width: "100%", marginTop: "0.25rem" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "var(--text-secondary, #6b7280)",
            marginTop: "0.125rem",
          }}
        >
          <span>/0</span>
          <span>/{cidr} — {mask}</span>
          <span>/32</span>
        </div>
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

          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.networkAddress)}</span>
              <span style={resultValueStyle}>{result.networkAddress}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.broadcastAddress)}</span>
              <span style={resultValueStyle}>{result.broadcastAddress}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.firstUsableHost)}</span>
              <span style={resultValueStyle}>{result.firstHost}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.lastUsableHost)}</span>
              <span style={resultValueStyle}>{result.lastHost}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.subnetMask)}</span>
              <span style={resultValueStyle}>{result.subnetMask}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.wildcardMask)}</span>
              <span style={resultValueStyle}>{result.wildcardMask}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.totalHosts)}</span>
              <span style={resultValueStyle}>
                {result.totalHosts.toLocaleString()}
              </span>
            </div>
            <div style={{ ...resultRowStyle, borderBottom: "none" }}>
              <span style={resultLabelStyle}>{t(T.usableHosts)}</span>
              <span style={resultValueStyle}>
                {result.usableHosts.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "0.75rem",
                background: "var(--info-bg, #eff6ff)",
                borderRadius: "8px",
                fontSize: "0.8125rem",
              }}
            >
              <div style={{ color: "var(--text-secondary, #6b7280)" }}>
                {t(T.ipClass)}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text-primary, #111)",
                }}
              >
                Class {result.ipClass}
              </div>
            </div>
            <div
              style={{
                padding: "0.75rem",
                background: result.isPrivate
                  ? "var(--success-bg, #f0fdf4)"
                  : "var(--warn-bg, #fffbeb)",
                borderRadius: "8px",
                fontSize: "0.8125rem",
              }}
            >
              <div style={{ color: "var(--text-secondary, #6b7280)" }}>
                {t(T.addressType)}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--text-primary, #111)",
                }}
              >
                {result.isPrivate ? t(T.privateRfc) : t(T.public)}
              </div>
            </div>
          </div>

          {/* Binary representation */}
          <details style={{ marginTop: "1rem" }}>
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

      {!result && (ipError || maskError) && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "0.875rem",
          }}
        >
          {ipError && <div>{ipError}</div>}
          {maskError && <div>{maskError}</div>}
        </div>
      )}
    </div>
  );
}
