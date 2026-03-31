"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import bcrypt from "bcryptjs";

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

export function BcryptGenerator() {
  const { t } = useLocale();
  const [mode, setMode] = useState<"hash" | "verify">("hash");
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(12);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHash = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    try {
      const generated = await bcrypt.hash(password, rounds);
      setResult(generated);
    } finally {
      setLoading(false);
    }
  }, [password, rounds]);

  const verifyPasswordFn = useCallback(async () => {
    if (!verifyPassword || !verifyHash) return;
    setLoading(true);
    setVerifyResult(null);
    try {
      const match = await bcrypt.compare(verifyPassword, verifyHash);
      setVerifyResult(match);
    } finally {
      setLoading(false);
    }
  }, [verifyPassword, verifyHash]);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const roundCost = [4, 6, 8, 10, 11, 12, 13, 14];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          background: "var(--surface-2, #f3f4f6)",
          borderRadius: "10px",
          padding: "0.25rem",
          width: "fit-content",
        }}
      >
        {(["hash", "verify"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "0.375rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: mode === m ? "var(--surface, #fff)" : "transparent",
              color: mode === m ? "var(--text-primary, #111)" : "var(--text-secondary, #6b7280)",
              boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {m === "hash"
              ? t({ ko: "해시 생성", en: "Generate Hash" })
              : t({ ko: "해시 검증", en: "Verify Hash" })}
          </button>
        ))}
      </div>

      {mode === "hash" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={labelStyle}>{t({ ko: "비밀번호", en: "Password" })}</label>
            <input
              style={inputStyle}
              type="password"
              placeholder={t({ ko: "비밀번호 입력", en: "Enter password" })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={labelStyle}>
              {t({ ko: `라운드 수 (cost factor): ${rounds}`, en: `Rounds (cost factor): ${rounds}` })}
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {roundCost.map((r) => (
                <button
                  key={r}
                  onClick={() => setRounds(r)}
                  style={{
                    ...smallButtonStyle,
                    background: rounds === r ? "var(--text-primary, #111)" : "transparent",
                    color: rounds === r ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                    borderColor: rounds === r ? "var(--text-primary, #111)" : "var(--border, #d1d5db)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
              {t({
                ko: `2^${rounds} = ${Math.pow(2, rounds).toLocaleString()} iterations. 라운드가 높을수록 안전하지만 느립니다.`,
                en: `2^${rounds} = ${Math.pow(2, rounds).toLocaleString()} iterations. Higher rounds = more secure but slower.`,
              })}
            </div>
          </div>

          <button style={buttonStyle} onClick={generateHash} disabled={!password || loading}>
            {loading ? t({ ko: "생성 중...", en: "Generating..." }) : t({ ko: "해시 생성", en: "Generate Hash" })}
          </button>

          {result && (
            <div
              style={{
                background: "var(--surface-2, #f9fafb)",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)" }}>
                  {t({ ko: "bcrypt 해시", en: "bcrypt Hash" })}
                </span>
                <button style={smallButtonStyle} onClick={() => copyToClipboard(result)}>
                  {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "복사", en: "Copy" })}
                </button>
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  wordBreak: "break-all",
                  color: "var(--text-primary, #111)",
                  lineHeight: 1.6,
                }}
              >
                {result}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={labelStyle}>{t({ ko: "비밀번호", en: "Password" })}</label>
            <input
              style={inputStyle}
              type="password"
              placeholder={t({ ko: "검증할 비밀번호", en: "Password to verify" })}
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={labelStyle}>{t({ ko: "bcrypt 해시", en: "bcrypt Hash" })}</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="$2b$12$..."
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
            />
          </div>
          <button
            style={buttonStyle}
            onClick={verifyPasswordFn}
            disabled={!verifyPassword || !verifyHash || loading}
          >
            {loading ? t({ ko: "검증 중...", en: "Verifying..." }) : t({ ko: "검증", en: "Verify" })}
          </button>
          {verifyResult !== null && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "10px",
                background: verifyResult ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${verifyResult ? "#86efac" : "#fecaca"}`,
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 700,
                color: verifyResult ? "#15803d" : "#dc2626",
              }}
            >
              {verifyResult
                ? t({ ko: "✓ 일치합니다", en: "✓ Match" })
                : t({ ko: "✗ 일치하지 않습니다", en: "✗ No match" })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
