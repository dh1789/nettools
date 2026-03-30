"use client";

import { useState, useRef, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const textareaStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.75rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
  resize: "vertical",
  minHeight: "120px",
};

export function ImageBase64Converter() {
  const { t } = useLocale();
  const [mode, setMode] = useState<"img2base64" | "base642img">("img2base64");
  const [base64Output, setBase64Output] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError(t({ ko: "이미지 파일만 지원합니다 (PNG, JPG, GIF, WebP, SVG 등).", en: "Only image files are supported (PNG, JPG, GIF, WebP, SVG, etc.)." }));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t({ ko: `파일 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`, en: `File size must be ${MAX_SIZE_MB}MB or less.` }));
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64Output(result);
      setPreviewSrc(result);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const copyBase64 = () => {
    navigator.clipboard.writeText(base64Output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDataUrl = () => {
    navigator.clipboard.writeText(base64Output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOnlyBase64 = () => {
    // Strip data:image/...;base64, prefix
    const match = base64Output.match(/^data:[^;]+;base64,(.+)$/);
    if (match) {
      navigator.clipboard.writeText(match[1]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const convertBase64ToImage = () => {
    setError("");
    let src = base64Input.trim();
    if (!src) return;
    if (!src.startsWith("data:")) {
      // Assume it's raw base64, guess PNG
      src = "data:image/png;base64," + src;
    }
    setPreviewSrc(src);
  };

  const downloadImage = () => {
    if (!previewSrc) return;
    const a = document.createElement("a");
    a.href = previewSrc;
    a.download = "image-from-base64.png";
    a.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const modeButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: active ? 700 : 400,
    border: "1px solid var(--border, #d1d5db)",
    borderRadius: "6px",
    background: active ? "var(--text-primary, #111)" : "transparent",
    color: active ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button style={modeButtonStyle(mode === "img2base64")} onClick={() => { setMode("img2base64"); setError(""); }}>
          {t({ ko: "이미지 → Base64", en: "Image → Base64" })}
        </button>
        <button style={modeButtonStyle(mode === "base642img")} onClick={() => { setMode("base642img"); setError(""); }}>
          {t({ ko: "Base64 → 이미지", en: "Base64 → Image" })}
        </button>
      </div>

      {error && (
        <div style={{ background: "var(--error-bg, #fef2f2)", borderRadius: "8px", padding: "0.875rem", color: "var(--error, #dc2626)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {mode === "img2base64" ? (
        <div>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--text-primary, #111)" : "var(--border, #d1d5db)"}`,
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging ? "var(--warning-bg, #fef3c7)" : "var(--input-bg, #f9fafb)",
              transition: "all 0.2s",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖼️</div>
            <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary, #111)" }}>
              {t({ ko: "이미지를 드래그하거나 클릭하여 선택", en: "Drag & drop or click to select image" })}
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--text-tertiary, #9ca3af)" }}>
              PNG, JPG, GIF, WebP, SVG • {t({ ko: "최대", en: "Max" })} {MAX_SIZE_MB}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {base64Output && (
            <div>
              {/* Preview */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>{t({ ko: "미리보기", en: "Preview" })}</label>
                <div style={{
                  background: "var(--result-bg, #f0fdf4)",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <img
                    src={previewSrc}
                    alt="preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "4px" }}
                  />
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
                    {fileName} · {mimeType} · {formatBytes(fileSize)}
                  </div>
                </div>
              </div>

              {/* Output */}
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <label style={labelStyle}>
                    {t({ ko: "Base64 Data URL", en: "Base64 Data URL" })}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      onClick={copyDataUrl}
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
                      {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "Data URL 복사", en: "Copy Data URL" })}
                    </button>
                    <button
                      onClick={copyOnlyBase64}
                      style={{
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.75rem",
                        border: "1px solid var(--border, #d1d5db)",
                        borderRadius: "6px",
                        background: "transparent",
                        color: "var(--text-secondary, #6b7280)",
                        cursor: "pointer",
                      }}
                    >
                      {t({ ko: "Base64만 복사", en: "Copy Base64 Only" })}
                    </button>
                  </div>
                </div>
                <textarea
                  value={base64Output}
                  readOnly
                  style={{ ...textareaStyle, fontSize: "0.6875rem" }}
                />
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.375rem" }}>
                  {t({ ko: "출력 크기:", en: "Output size:" })} {formatBytes(base64Output.length)}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Base64 Input */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>{t({ ko: "Base64 문자열 (Data URL 또는 순수 Base64)", en: "Base64 String (Data URL or raw Base64)" })}</label>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder={t({ ko: "data:image/png;base64,iVBORw0K... 또는 순수 Base64 문자열을 붙여넣으세요", en: "Paste data:image/png;base64,iVBORw0K... or raw Base64 string" })}
              style={textareaStyle}
            />
          </div>
          <button
            onClick={convertBase64ToImage}
            style={{
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              background: "var(--text-primary, #111)",
              color: "var(--surface, #fff)",
              cursor: "pointer",
              marginBottom: "1.25rem",
            }}
          >
            {t({ ko: "이미지로 변환", en: "Convert to Image" })}
          </button>

          {previewSrc && (
            <div>
              <label style={labelStyle}>{t({ ko: "이미지 미리보기", en: "Image Preview" })}</label>
              <div style={{
                background: "var(--result-bg, #f0fdf4)",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}>
                <img
                  src={previewSrc}
                  alt="converted"
                  style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "4px" }}
                  onError={() => setError(t({ ko: "유효하지 않은 Base64 이미지입니다.", en: "Invalid Base64 image." }))}
                />
                <button
                  onClick={downloadImage}
                  style={{
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    background: "var(--text-primary, #111)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  ⬇ {t({ ko: "이미지 다운로드", en: "Download Image" })}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
