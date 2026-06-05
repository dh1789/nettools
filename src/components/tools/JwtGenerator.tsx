"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { signJwt, type JwtAlg } from "@/lib/jwt-sign";

const SAMPLE_HEADER = `{
  "alg": "HS256",
  "typ": "JWT"
}`;
const SAMPLE_PAYLOAD = `{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`;
const SAMPLE_SECRET = "your-256-bit-secret";

const ALGS: JwtAlg[] = ["HS256", "HS384", "HS512"];

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
  resize: "vertical",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const sectionStyle: React.CSSProperties = {
  background: "var(--result-bg, #f9fafb)",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  padding: "0.875rem 1rem",
  marginBottom: "0.75rem",
};

export function JwtGenerator() {
  const { t } = useLocale();
  const [alg, setAlg] = useState<JwtAlg>("HS256");
  const [header, setHeader] = useState(SAMPLE_HEADER);
  const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
  const [secret, setSecret] = useState(SAMPLE_SECRET);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAlgChange = (newAlg: JwtAlg) => {
    setAlg(newAlg);
    try {
      const h = JSON.parse(header);
      h.alg = newAlg;
      setHeader(JSON.stringify(h, null, 2));
    } catch {
      // header가 깨진 상태면 그대로 두고 생성 시 검증
    }
  };

  const handleGenerate = useCallback(async () => {
    const r = await signJwt(header, payload, secret, alg);
    setToken(r.token);
    setError(r.error);
  }, [header, payload, secret, alg]);

  const handleInsertIat = () => {
    try {
      const p = JSON.parse(payload);
      // 현재시각은 이벤트 핸들러 내부에서만 (렌더 페이즈 비결정 함수 금지 — TR-5)
      p.iat = Math.floor(Date.now() / 1000);
      setPayload(JSON.stringify(p, null, 2));
    } catch {
      setError(t({ ko: "Payload가 올바른 JSON이 아닙니다", en: "Invalid JSON in Payload" }));
    }
  };

  const handleLoadSample = () => {
    setAlg("HS256");
    setHeader(SAMPLE_HEADER);
    setPayload(SAMPLE_PAYLOAD);
    setSecret(SAMPLE_SECRET);
    setToken(null);
    setError("");
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="jwt-alg" style={labelStyle}>
          {t({ ko: "알고리즘 (Algorithm)", en: "Algorithm" })}
        </label>
        <select
          id="jwt-alg"
          value={alg}
          onChange={(e) => handleAlgChange(e.target.value as JwtAlg)}
          style={{ ...inputStyle, width: "auto", minWidth: "140px" }}
        >
          {ALGS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="jwt-header" style={labelStyle}>
          {t({ ko: "헤더 (Header, JSON)", en: "Header (JSON)" })}
        </label>
        <textarea
          id="jwt-header"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          style={{ ...inputStyle, minHeight: "80px" }}
          spellCheck={false}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="jwt-payload" style={labelStyle}>
          {t({ ko: "페이로드 (Payload, JSON)", en: "Payload (JSON)" })}
        </label>
        <textarea
          id="jwt-payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          style={{ ...inputStyle, minHeight: "120px" }}
          spellCheck={false}
        />
        <button
          onClick={handleInsertIat}
          style={{
            marginTop: "0.375rem",
            padding: "0.25rem 0.625rem",
            fontSize: "0.75rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "6px",
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "iat 현재시각 삽입", en: "Insert current iat" })}
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="jwt-secret" style={labelStyle}>
          {t({ ko: "시크릿 (Secret)", en: "Secret" })}
        </label>
        <input
          id="jwt-secret"
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="your-256-bit-secret"
          style={inputStyle}
          spellCheck={false}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
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
          }}
        >
          {t({ ko: "생성", en: "Generate" })}
        </button>
        <button
          onClick={handleLoadSample}
          style={{
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-primary, #111)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "예제 로드", en: "Load Sample" })}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.8125rem",
            color: "#dc2626",
            fontFamily: "monospace",
          }}
        >
          {error}
        </div>
      )}

      {token && (
        <div style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {t({ ko: "생성된 JWT", en: "Generated JWT" })}
            </span>
            <button
              onClick={handleCopy}
              style={{
                padding: "0.25rem 0.625rem",
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
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              fontFamily: "monospace",
              wordBreak: "break-all",
              color: "var(--text-primary, #111)",
            }}
          >
            {token}
          </p>
        </div>
      )}
    </div>
  );
}
