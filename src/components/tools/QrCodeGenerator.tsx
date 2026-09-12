"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import {
  encodeQr,
  toSvg,
  drawToCanvas,
  fitCanvasSize,
  utf8ByteLength,
  ERROR_CORRECTION,
  type ErrorCorrection,
} from "@/lib/qr";

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

const selectStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border, #d1d5db)",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  fontSize: "0.875rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1.25rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
};

const SIZES = [100, 200, 300, 400, 500] as const;

export function QrCodeGenerator() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [size, setSize] = useState<number>(200);
  const [level, setLevel] = useState<ErrorCorrection>("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 입력이 바뀔 때마다 즉시 인코딩한다 — 버튼을 누를 이유가 없다(외부 호출이 없으므로)
  const result = useMemo(() => encodeQr(input.trim(), level), [input, level]);
  const byteLength = utf8ByteLength(input.trim());
  const maxBytes = ERROR_CORRECTION.find((e) => e.level === level)?.maxBytes ?? 2331;

  // 캔버스를 CSS 로 늘리면 모듈 경계가 리샘플링돼 흐려진다 — 실제 픽셀 크기로 표시한다
  const renderedPx = result.ok ? fitCanvasSize(result, size) : 0;

  useEffect(() => {
    if (result.ok && canvasRef.current) {
      drawToCanvas(canvasRef.current, result, { size });
    }
  }, [result, size]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !result.ok) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const downloadSvg = () => {
    if (!result.ok) return;
    const svg = toSvg(result, { size });
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const overLimit = !result.ok && result.reason === "too-long";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 프라이버시 고지 — 이 도구의 핵심 약속 */}
      <p
        style={{
          margin: 0,
          padding: "0.625rem 0.875rem",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          color: "var(--text-secondary, #6b7280)",
          background: "var(--info-bg, #eff6ff)",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: "8px",
        }}
      >
        🔒{" "}
        <strong style={{ color: "var(--text-primary, #111)" }}>
          {t({
            ko: "QR 코드는 브라우저 안에서 생성되며, 입력한 내용은 서버로 전송되지 않습니다.",
            en: "The QR code is generated in your browser; what you type is never sent to a server.",
          })}
        </strong>{" "}
        {t({
          ko: "와이파이 비밀번호나 내부 주소를 넣어도 네트워크 요청이 발생하지 않으므로 폐쇄망에서도 그대로 쓸 수 있습니다.",
          en: "No network request is made even for Wi-Fi passwords or internal addresses, so it works the same on an air-gapped network.",
        })}
      </p>

      <div>
        <label style={labelStyle} htmlFor="qr-input">
          {t({ ko: "URL 또는 텍스트", en: "URL or Text" })}
        </label>
        <textarea
          id="qr-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder={t({
            ko: "QR 코드로 변환할 URL 또는 텍스트를 입력하세요...",
            en: "Enter URL or text to convert to QR code...",
          })}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
        <p
          style={{
            margin: "0.375rem 0 0",
            fontSize: "0.75rem",
            color: overLimit ? "var(--error-text, #b91c1c)" : "var(--text-tertiary, #9ca3af)",
          }}
        >
          {byteLength} / {maxBytes} {t({ ko: "바이트 (UTF-8)", en: "bytes (UTF-8)" })}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label style={labelStyle} htmlFor="qr-size">
            {t({ ko: "크기 (px)", en: "Size (px)" })}
          </label>
          <select
            id="qr-size"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={selectStyle}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}×{s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="qr-ec">
            {t({ ko: "에러 정정", en: "Error Correction" })}
          </label>
          <select
            id="qr-ec"
            value={level}
            onChange={(e) => setLevel(e.target.value as ErrorCorrection)}
            style={selectStyle}
          >
            {ERROR_CORRECTION.map((e) => (
              <option key={e.level} value={e.level}>
                {e.level} — {e.recovery}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          lineHeight: 1.6,
          color: "var(--text-tertiary, #9ca3af)",
        }}
      >
        {t({
          ko: "에러 정정 레벨이 높을수록 코드 일부가 훼손돼도 읽히지만, 같은 내용이면 코드가 커집니다. 장비 라벨처럼 긁히거나 가려지기 쉬운 곳에는 Q 또는 H 를 씁니다.",
          en: "A higher error correction level keeps the code readable when part of it is damaged, but makes the code larger for the same content. Use Q or H for equipment labels that get scratched or partly covered.",
        })}
      </p>

      {input.trim() && !result.ok && (
        <p
          style={{
            margin: 0,
            padding: "0.625rem 0.875rem",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            color: "var(--error-text, #b91c1c)",
            background: "var(--error-bg, #fef2f2)",
            border: "1px solid var(--error-border, #fecaca)",
            borderRadius: "8px",
          }}
        >
          {t(result.message)}
        </p>
      )}

      {result.ok && (
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
            <canvas
              ref={canvasRef}
              aria-label={t({ ko: "생성된 QR 코드", en: "Generated QR code" })}
              style={{
                display: "block",
                width: renderedPx,
                height: renderedPx,
                maxWidth: "100%",
                imageRendering: "pixelated",
              }}
            />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
            }}
          >
            {result.count}×{result.count} {t({ ko: "모듈", en: "modules" })} · {renderedPx}×{renderedPx}px ·{" "}
            {t({ ko: "에러 정정", en: "EC" })} {result.level}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={downloadPng} style={buttonStyle}>
              {t({ ko: "PNG 다운로드", en: "Download PNG" })}
            </button>
            <button onClick={downloadSvg} style={buttonStyle}>
              {t({ ko: "SVG 다운로드", en: "Download SVG" })}
            </button>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
              textAlign: "center",
            }}
          >
            {t({
              ko: "인쇄용 라벨에는 확대해도 깨지지 않는 SVG 를 쓰세요.",
              en: "Use the SVG for printed labels — it stays sharp at any size.",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
