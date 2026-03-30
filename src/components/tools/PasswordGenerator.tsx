"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()_+-=[]{}|;:,.<>?";

type StrengthLevel = "weak" | "fair" | "strong" | "veryStrong";

interface StrengthInfo {
  level: StrengthLevel;
  score: number;
  color: string;
}

function getCharPool(
  upper: boolean,
  lower: boolean,
  numbers: boolean,
  special: boolean,
): string {
  let pool = "";
  if (upper) pool += UPPERCASE;
  if (lower) pool += LOWERCASE;
  if (numbers) pool += NUMBERS;
  if (special) pool += SPECIAL;
  return pool;
}

function generatePassword(pool: string, length: number): string {
  if (pool.length === 0) return "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => pool[v % pool.length]).join("");
}

function calcStrength(
  password: string,
  upper: boolean,
  lower: boolean,
  numbers: boolean,
  special: boolean,
): StrengthInfo {
  if (!password) return { level: "weak", score: 0, color: "#ef4444" };

  let poolSize = 0;
  if (upper) poolSize += 26;
  if (lower) poolSize += 26;
  if (numbers) poolSize += 10;
  if (special) poolSize += SPECIAL.length;

  const entropy = password.length * Math.log2(Math.max(poolSize, 1));

  const charTypes = [upper, lower, numbers, special].filter(Boolean).length;
  const diversityBonus = charTypes * 5;

  const lengthScore = Math.min(password.length / 128, 1) * 40;
  const entropyScore = Math.min(entropy / 128, 1) * 40;
  const diversityScore = Math.min(diversityBonus, 20);

  const total = lengthScore + entropyScore + diversityScore;

  if (total < 30) return { level: "weak", score: total, color: "#ef4444" };
  if (total < 55) return { level: "fair", score: total, color: "#f59e0b" };
  if (total < 80) return { level: "strong", score: total, color: "#10b981" };
  return { level: "veryStrong", score: total, color: "#059669" };
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

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.875rem",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
};

export function PasswordGenerator() {
  const { t } = useLocale();

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const pool = getCharPool(useUpper, useLower, useNumbers, useSpecial);
    if (pool.length === 0) {
      setPasswords([]);
      return;
    }
    const count = multiple ? 5 : 1;
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generatePassword(pool, length));
    }
    setPasswords(results);
  }, [length, useUpper, useLower, useNumbers, useSpecial, multiple]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyPassword = (index: number) => {
    navigator.clipboard.writeText(passwords[index]);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const hasCharSet = useUpper || useLower || useNumbers || useSpecial;

  const strengthLabel = (level: StrengthLevel): string => {
    const labels: Record<StrengthLevel, { ko: string; en: string }> = {
      weak: { ko: "약함", en: "Weak" },
      fair: { ko: "보통", en: "Fair" },
      strong: { ko: "강함", en: "Strong" },
      veryStrong: { ko: "매우 강함", en: "Very Strong" },
    };
    return t(labels[level]);
  };

  return (
    <div>
      {/* Length Slider */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "비밀번호 길이", en: "Password Length" })}: {length}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
            }}
          >
            8
          </span>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--text-primary, #111)" }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
            }}
          >
            128
          </span>
          <input
            type="number"
            min={8}
            max={128}
            value={length}
            onChange={(e) => {
              const v = Math.max(8, Math.min(128, Number(e.target.value)));
              setLength(v);
            }}
            style={{
              ...inputStyle,
              width: "4.5rem",
              textAlign: "center",
              padding: "0.375rem 0.5rem",
            }}
          />
        </div>
      </div>

      {/* Character Set Checkboxes */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "문자 구성", en: "Character Sets" })}
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}
        >
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
            />
            {t({ ko: "대문자 (A-Z)", en: "Uppercase (A-Z)" })}
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
            />
            {t({ ko: "소문자 (a-z)", en: "Lowercase (a-z)" })}
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
            />
            {t({ ko: "숫자 (0-9)", en: "Numbers (0-9)" })}
          </label>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={useSpecial}
              onChange={(e) => setUseSpecial(e.target.checked)}
            />
            {t({ ko: "특수문자 (!@#$%...)", en: "Special (!@#$%...)" })}
          </label>
        </div>
        {!hasCharSet && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {t({ ko: "최소 하나의 문자 집합을 선택하세요.", en: "Select at least one character set." })}
          </p>
        )}
      </div>

      {/* Multiple Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={multiple}
            onChange={(e) => setMultiple(e.target.checked)}
          />
          {t({ ko: "5개 동시 생성", en: "Generate 5 at once" })}
        </label>
      </div>

      {/* Generate Button */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={generate} style={buttonStyle} disabled={!hasCharSet}>
          {t({ ko: "생성", en: "Generate" })}
        </button>
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary, #111)",
              marginBottom: "0.75rem",
            }}
          >
            {t(T.results)}
          </h2>

          {passwords.map((pw, idx) => {
            const strength = calcStrength(pw, useUpper, useLower, useNumbers, useSpecial);
            return (
              <div
                key={idx}
                style={{
                  background: "var(--result-bg, #f0fdf4)",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                {/* Password Display */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontFamily: "monospace",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--text-primary, #111)",
                      wordBreak: "break-all",
                      lineHeight: 1.5,
                    }}
                  >
                    {pw}
                  </div>
                  <button
                    onClick={() => copyPassword(idx)}
                    style={{
                      padding: "0.375rem 0.75rem",
                      fontSize: "0.75rem",
                      border: "1px solid var(--border, #d1d5db)",
                      borderRadius: "6px",
                      background: copied === idx ? "#10b981" : "transparent",
                      color: copied === idx ? "#fff" : "var(--text-secondary, #6b7280)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {copied === idx ? t(T.copied) : t(T.copy)}
                  </button>
                </div>

                {/* Strength Indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      borderRadius: "3px",
                      background: "var(--border-light, #f3f4f6)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(strength.score, 100)}%`,
                        height: "100%",
                        borderRadius: "3px",
                        background: strength.color,
                        transition: "width 0.3s, background 0.3s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: strength.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {strengthLabel(strength.level)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Info */}
          <div
            style={{
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginTop: "0.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary, #6b7280)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {t({
                ko: "비밀번호는 브라우저의 crypto.getRandomValues()를 사용하여 안전하게 생성됩니다. 서버로 전송되지 않습니다.",
                en: "Passwords are generated securely using your browser's crypto.getRandomValues(). Nothing is sent to any server.",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
