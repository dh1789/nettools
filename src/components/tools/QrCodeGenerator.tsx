"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
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

export function QrCodeGenerator() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [size, setSize] = useState(200);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const encoded = encodeURIComponent(trimmed);
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png&margin=10`
    );
    setGenerated(true);
  };

  const download = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <label style={labelStyle}>
          {t({ ko: "URL 또는 텍스트", en: "URL or Text" })}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setGenerated(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder={t({
            ko: "QR 코드로 변환할 URL 또는 텍스트를 입력하세요...",
            en: "Enter URL or text to convert to QR code...",
          })}
          style={inputStyle}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={labelStyle}>
            {t({ ko: "크기 (px)", en: "Size (px)" })}
          </label>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setGenerated(false);
            }}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid var(--border, #d1d5db)",
              background: "var(--input-bg, #f9fafb)",
              color: "var(--text-primary, #111)",
              fontSize: "0.875rem",
            }}
          >
            <option value={100}>100×100</option>
            <option value={200}>200×200</option>
            <option value={300}>300×300</option>
            <option value={400}>400×400</option>
            <option value={500}>500×500</option>
          </select>
        </div>
        <button
          onClick={generate}
          disabled={!input.trim()}
          style={{
            padding: "0.625rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            background: !input.trim()
              ? "var(--border, #d1d5db)"
              : "var(--text-primary, #111)",
            color: !input.trim()
              ? "var(--text-secondary, #6b7280)"
              : "var(--surface, #fff)",
            cursor: !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          {t({ ko: "QR 코드 생성", en: "Generate QR Code" })}
        </button>
      </div>
      {generated && qrUrl && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "12px",
              padding: "1.5rem",
              background: "#fff",
              display: "inline-block",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR Code"
              width={size}
              height={size}
              style={{ display: "block" }}
            />
          </div>
          <button
            onClick={download}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--text-primary, #111)",
              cursor: "pointer",
            }}
          >
            {t({ ko: "PNG 다운로드", en: "Download PNG" })}
          </button>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
              textAlign: "center",
            }}
          >
            {t({
              ko: "QR 코드는 외부 서비스(api.qrserver.com)를 통해 생성됩니다.",
              en: "QR code is generated via external service (api.qrserver.com).",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
