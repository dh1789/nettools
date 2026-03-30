"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const hn = h / 360,
    sn = s / 100,
    ln = l / 100;
  let r: number, g: number, b: number;
  if (sn === 0) {
    r = g = b = ln;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    r = hue2rgb(p, q, hn + 1 / 3);
    g = hue2rgb(p, q, hn);
    b = hue2rgb(p, q, hn - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
};

const numInputStyle: React.CSSProperties = {
  ...inputStyle,
  width: "80px",
};

const btnStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  background: "var(--text-primary, #111)",
  color: "var(--surface, #fff)",
  cursor: "pointer",
};

const copyBtnStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
};

const copiedBtnStyle: React.CSSProperties = {
  ...copyBtnStyle,
  background: "#10b981",
  color: "#fff",
  borderColor: "#10b981",
};

export function ColorConverter() {
  const { t } = useLocale();
  const [hex, setHex] = useState("#3B82F6");
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [h, setH] = useState(217);
  const [s, setS] = useState(91);
  const [l, setL] = useState(60);
  const [copied, setCopied] = useState<string | null>(null);
  const [hexError, setHexError] = useState("");
  const [rgbError, setRgbError] = useState("");
  const [hslError, setHslError] = useState("");

  const previewColor = `rgb(${r}, ${g}, ${b})`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const fromHex = (value: string) => {
    setHex(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setHexError("");
      setR(rgb.r);
      setG(rgb.g);
      setB(rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h);
      setS(hsl.s);
      setL(hsl.l);
    } else {
      setHexError(
        t({
          ko: "올바른 HEX 코드를 입력하세요 (예: #3B82F6)",
          en: "Enter a valid HEX code (e.g., #3B82F6)",
        })
      );
    }
  };

  const fromRgb = () => {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      setRgbError(
        t({
          ko: "RGB 값은 0~255 사이여야 합니다.",
          en: "RGB values must be between 0 and 255.",
        })
      );
      return;
    }
    setRgbError("");
    const newHex = rgbToHex(r, g, b);
    setHex(newHex);
    const hsl = rgbToHsl(r, g, b);
    setH(hsl.h);
    setS(hsl.s);
    setL(hsl.l);
  };

  const fromHsl = () => {
    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
      setHslError(
        t({
          ko: "H: 0~360, S/L: 0~100 범위여야 합니다.",
          en: "H: 0-360, S/L: 0-100 range required.",
        })
      );
      return;
    }
    setHslError("");
    const rgb = hslToRgb(h, s, l);
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const sectionStyle: React.CSSProperties = {
    border: "1px solid var(--border, #d1d5db)",
    borderRadius: "10px",
    padding: "1rem",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Color Preview */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            background: previewColor,
            border: "1px solid var(--border, #d1d5db)",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "var(--text-primary, #111)",
            }}
          >
            {hex.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #6b7280)",
            }}
          >
            rgb({r}, {g}, {b})
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #6b7280)",
            }}
          >
            hsl({h}, {s}%, {l}%)
          </div>
        </div>
      </div>

      {/* HEX */}
      <div style={sectionStyle}>
        <label style={labelStyle}>HEX</label>
        <div style={rowStyle}>
          <input
            value={hex}
            onChange={(e) => fromHex(e.target.value)}
            style={inputStyle}
            placeholder="#3B82F6"
          />
          <input
            type="color"
            value={hex.match(/^#[0-9a-fA-F]{6}$/) ? hex : "#000000"}
            onChange={(e) => fromHex(e.target.value)}
            style={{
              width: "40px",
              height: "38px",
              borderRadius: "6px",
              border: "1px solid var(--border, #d1d5db)",
              cursor: "pointer",
              padding: "2px",
              flexShrink: 0,
            }}
          />
          <button
            onClick={() => copyText(hex.toUpperCase(), "hex")}
            style={copied === "hex" ? copiedBtnStyle : copyBtnStyle}
          >
            {copied === "hex" ? t(T.copied) : t(T.copy)}
          </button>
        </div>
        {hexError && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              marginTop: "0.25rem",
            }}
          >
            {hexError}
          </p>
        )}
      </div>

      {/* RGB */}
      <div style={sectionStyle}>
        <label style={labelStyle}>RGB</label>
        <div style={rowStyle}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              R
            </span>
            <input
              type="number"
              min={0}
              max={255}
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              style={numInputStyle}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              G
            </span>
            <input
              type="number"
              min={0}
              max={255}
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              style={numInputStyle}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              B
            </span>
            <input
              type="number"
              min={0}
              max={255}
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              style={numInputStyle}
            />
          </div>
          <button onClick={fromRgb} style={btnStyle}>
            {t({ ko: "변환", en: "Convert" })}
          </button>
          <button
            onClick={() => copyText(`rgb(${r}, ${g}, ${b})`, "rgb")}
            style={copied === "rgb" ? copiedBtnStyle : copyBtnStyle}
          >
            {copied === "rgb" ? t(T.copied) : t(T.copy)}
          </button>
        </div>
        {rgbError && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              marginTop: "0.25rem",
            }}
          >
            {rgbError}
          </p>
        )}
      </div>

      {/* HSL */}
      <div style={sectionStyle}>
        <label style={labelStyle}>HSL</label>
        <div style={rowStyle}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              H
            </span>
            <input
              type="number"
              min={0}
              max={360}
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              style={numInputStyle}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              S
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={s}
              onChange={(e) => setS(Number(e.target.value))}
              style={numInputStyle}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              %
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              L
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={l}
              onChange={(e) => setL(Number(e.target.value))}
              style={numInputStyle}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
              }}
            >
              %
            </span>
          </div>
          <button onClick={fromHsl} style={btnStyle}>
            {t({ ko: "변환", en: "Convert" })}
          </button>
          <button
            onClick={() => copyText(`hsl(${h}, ${s}%, ${l}%)`, "hsl")}
            style={copied === "hsl" ? copiedBtnStyle : copyBtnStyle}
          >
            {copied === "hsl" ? t(T.copied) : t(T.copy)}
          </button>
        </div>
        {hslError && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              marginTop: "0.25rem",
            }}
          >
            {hslError}
          </p>
        )}
      </div>
    </div>
  );
}
