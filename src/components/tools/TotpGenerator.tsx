"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

// Base32 decode
function base32Decode(encoded: string): Uint8Array {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = encoded.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const char of cleaned) {
    const idx = base32Chars.indexOf(char);
    if (idx === -1) throw new Error("Invalid base32 character: " + char);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
}

// HMAC-SHA1 using Web Crypto API
async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const dataBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataBuffer);
  return new Uint8Array(signature);
}

// TOTP generation
async function generateTotp(secret: string, period = 30, digits = 6): Promise<string> {
  const keyBytes = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / period);
  const counterBytes = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const hmac = await hmacSha1(keyBytes, counterBytes);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = code % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

function generateRandomSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    secret += chars[byte % 32];
  }
  return secret;
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
  letterSpacing: "0.05em",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.625rem 1.25rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  background: "var(--text-primary, #111)",
  color: "var(--surface, #fff)",
  cursor: "pointer",
};

export function TotpGenerator() {
  const { t } = useLocale();
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (secretVal: string) => {
    if (!secretVal.trim()) return;
    setIsGenerating(true);
    setError("");
    try {
      const totp = await generateTotp(secretVal.trim());
      setCode(totp);
    } catch {
      setError(t({ ko: "유효하지 않은 Base32 시크릿입니다.", en: "Invalid Base32 secret key." }));
      setCode("");
    }
    setIsGenerating(false);
  }, [t]);

  // Auto-refresh every second
  useEffect(() => {
    const tick = async () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeLeft(remaining);
      if (remaining === 30 || code === "") {
        await generate(secret);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [secret, generate, code]);

  const refreshNow = () => generate(secret);

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSecret = () => {
    const newSecret = generateRandomSecret();
    setSecret(newSecret);
  };

  const progress = ((30 - timeLeft) / 30) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div>
      {/* Secret Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "TOTP 시크릿 키 (Base32)", en: "TOTP Secret Key (Base32)" })}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/\s/g, ""))}
            placeholder="JBSWY3DPEHPK3PXP"
            style={{ ...inputStyle, flex: 1 }}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={generateSecret}
            style={{
              ...buttonStyle,
              background: "transparent",
              color: "var(--text-secondary, #6b7280)",
              border: "1px solid var(--border, #d1d5db)",
              whiteSpace: "nowrap",
            }}
          >
            {t({ ko: "랜덤 생성", en: "Random" })}
          </button>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.375rem" }}>
          {t({ ko: "2FA 앱(Google Authenticator 등)에 표시된 Base32 시크릿 키를 입력하세요.", en: "Enter the Base32 secret key shown in your 2FA app (e.g., Google Authenticator)." })}
        </p>
      </div>

      {error && (
        <div style={{ background: "var(--error-bg, #fef2f2)", borderRadius: "8px", padding: "0.875rem", color: "var(--error, #dc2626)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* TOTP Code Display */}
      {code && !error && (
        <div style={{
          background: "var(--result-bg, #f0fdf4)",
          borderRadius: "12px",
          padding: "1.5rem",
          textAlign: "center",
          marginBottom: "1.25rem",
        }}>
          {/* Code */}
          <div style={{ fontSize: "3rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.2em", color: isUrgent ? "var(--error, #dc2626)" : "var(--text-primary, #111)", marginBottom: "0.75rem" }}>
            {code.slice(0, 3)} {code.slice(3)}
          </div>

          {/* Timer bar */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{
              height: "6px",
              background: "var(--border, #d1d5db)",
              borderRadius: "3px",
              overflow: "hidden",
              maxWidth: "200px",
              margin: "0 auto 0.375rem",
            }}>
              <div style={{
                height: "100%",
                width: `${100 - progress}%`,
                background: isUrgent ? "var(--error, #dc2626)" : "#10b981",
                borderRadius: "3px",
                transition: "width 1s linear",
              }} />
            </div>
            <div style={{ fontSize: "0.8125rem", color: isUrgent ? "var(--error, #dc2626)" : "var(--text-secondary, #6b7280)" }}>
              {timeLeft}{t({ ko: "초 후 갱신", en: "s remaining" })}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button
              onClick={copyCode}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                background: copied ? "#10b981" : "var(--text-primary, #111)",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "코드 복사", en: "Copy Code" })}
            </button>
            <button
              onClick={refreshNow}
              disabled={isGenerating}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-secondary, #6b7280)",
                cursor: "pointer",
              }}
            >
              ↻ {t({ ko: "지금 갱신", en: "Refresh" })}
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{
        background: "var(--info-bg, #eff6ff)",
        borderRadius: "8px",
        padding: "0.875rem 1rem",
        fontSize: "0.8125rem",
        color: "var(--text-secondary, #6b7280)",
      }}>
        <p style={{ margin: 0, marginBottom: "0.375rem", fontWeight: 600 }}>
          {t({ ko: "TOTP란?", en: "What is TOTP?" })}
        </p>
        <p style={{ margin: 0 }}>
          {t({
            ko: "TOTP(Time-based One-Time Password)는 현재 시간과 시크릿 키를 조합하여 30초마다 새로운 6자리 코드를 생성합니다. RFC 6238 표준을 따르며, Google Authenticator, Authy 등과 호환됩니다.",
            en: "TOTP (Time-based One-Time Password) generates a new 6-digit code every 30 seconds using the current time and a secret key. Follows RFC 6238 and is compatible with Google Authenticator, Authy, and more.",
          })}
        </p>
      </div>
    </div>
  );
}
