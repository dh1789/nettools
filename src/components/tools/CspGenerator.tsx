"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

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

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg, #ffffff)",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "12px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

interface DirectiveConfig {
  enabled: boolean;
  value: string;
}

interface CspConfig {
  "default-src": DirectiveConfig;
  "script-src": DirectiveConfig;
  "style-src": DirectiveConfig;
  "img-src": DirectiveConfig;
  "font-src": DirectiveConfig;
  "connect-src": DirectiveConfig;
  "frame-src": DirectiveConfig;
  "media-src": DirectiveConfig;
  "object-src": DirectiveConfig;
  "base-uri": DirectiveConfig;
  "form-action": DirectiveConfig;
  "frame-ancestors": DirectiveConfig;
  "upgrade-insecure-requests": DirectiveConfig;
  "block-all-mixed-content": DirectiveConfig;
}

const DEFAULT_CONFIG: CspConfig = {
  "default-src": { enabled: true, value: "'self'" },
  "script-src": { enabled: true, value: "'self'" },
  "style-src": { enabled: true, value: "'self' 'unsafe-inline'" },
  "img-src": { enabled: true, value: "'self' data:" },
  "font-src": { enabled: false, value: "'self'" },
  "connect-src": { enabled: false, value: "'self'" },
  "frame-src": { enabled: false, value: "'none'" },
  "media-src": { enabled: false, value: "'self'" },
  "object-src": { enabled: true, value: "'none'" },
  "base-uri": { enabled: true, value: "'self'" },
  "form-action": { enabled: false, value: "'self'" },
  "frame-ancestors": { enabled: false, value: "'none'" },
  "upgrade-insecure-requests": { enabled: false, value: "" },
  "block-all-mixed-content": { enabled: false, value: "" },
};

const BOOLEAN_DIRECTIVES = new Set(["upgrade-insecure-requests", "block-all-mixed-content"]);

const DIRECTIVE_HINTS: Record<string, { ko: string; en: string }> = {
  "default-src": { ko: "기본 소스 정책 (명시되지 않은 지시어의 폴백)", en: "Default source policy (fallback for unspecified directives)" },
  "script-src": { ko: "JavaScript 소스", en: "JavaScript sources" },
  "style-src": { ko: "CSS 스타일시트 소스", en: "CSS stylesheet sources" },
  "img-src": { ko: "이미지 소스", en: "Image sources" },
  "font-src": { ko: "웹 폰트 소스", en: "Web font sources" },
  "connect-src": { ko: "XHR, WebSocket, fetch 연결 대상", en: "XHR, WebSocket, and fetch targets" },
  "frame-src": { ko: "iframe 소스", en: "Frame sources" },
  "media-src": { ko: "audio/video 미디어 소스", en: "audio/video media sources" },
  "object-src": { ko: "Flash 등 플러그인 소스 ('none' 권장)", en: "Plugin sources, e.g., Flash ('none' recommended)" },
  "base-uri": { ko: "base 태그가 사용할 수 있는 URL 제한", en: "Restricts URLs in base elements" },
  "form-action": { ko: "폼 제출 대상 URL", en: "Form submission target URLs" },
  "frame-ancestors": { ko: "이 페이지를 iframe으로 허용할 호스트", en: "Hosts allowed to embed this page in frames" },
  "upgrade-insecure-requests": { ko: "HTTP 요청을 HTTPS로 자동 업그레이드", en: "Automatically upgrade HTTP requests to HTTPS" },
  "block-all-mixed-content": { ko: "혼합 콘텐츠(HTTPS 페이지의 HTTP 리소스) 차단", en: "Block mixed content (HTTP resources on HTTPS pages)" },
};

export function CspGenerator() {
  const { locale, t } = useLocale();
  const [config, setConfig] = useState<CspConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  const generateHeader = useCallback(() => {
    const parts: string[] = [];
    for (const [directive, cfg] of Object.entries(config) as [keyof CspConfig, DirectiveConfig][]) {
      if (!cfg.enabled) continue;
      if (BOOLEAN_DIRECTIVES.has(directive)) {
        parts.push(directive);
      } else if (cfg.value.trim()) {
        parts.push(`${directive} ${cfg.value.trim()}`);
      }
    }
    return parts.join("; ");
  }, [config]);

  const toggleDirective = (key: keyof CspConfig) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateValue = (key: keyof CspConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const header = generateHeader();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Content-Security-Policy: ${header}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(`<meta http-equiv="Content-Security-Policy" content="${header}">`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--text-secondary, #6b7280)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {locale === "ko"
            ? "Content-Security-Policy 헤더를 시각적으로 빌드합니다. 각 지시어를 활성화하고 값을 설정하세요."
            : "Visually build a Content-Security-Policy header. Enable directives and configure their values."}
        </p>
      </div>

      {/* Directives */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "지시어 설정" : "Directive Configuration"}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {(Object.entries(config) as [keyof CspConfig, DirectiveConfig][]).map(([directive, cfg]) => (
            <div key={directive}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ paddingTop: "0.125rem" }}>
                  <input
                    type="checkbox"
                    checked={cfg.enabled}
                    onChange={() => toggleDirective(directive)}
                    style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--accent, #3b82f6)" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.875rem", color: cfg.enabled ? "var(--accent, #3b82f6)" : "var(--text-secondary, #6b7280)" }}>
                      {directive}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                      {locale === "ko" ? DIRECTIVE_HINTS[directive].ko : DIRECTIVE_HINTS[directive].en}
                    </span>
                  </div>
                  {!BOOLEAN_DIRECTIVES.has(directive) && cfg.enabled && (
                    <div style={{ marginTop: "0.375rem" }}>
                      <input
                        type="text"
                        value={cfg.value}
                        onChange={e => updateValue(directive, e.target.value)}
                        style={{ ...inputStyle, fontSize: "0.8125rem", padding: "0.375rem 0.625rem" }}
                        placeholder="'self' https://cdn.example.com"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "생성된 헤더" : "Generated Header"}
        </h3>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>{locale === "ko" ? "HTTP 응답 헤더" : "HTTP Response Header"}</label>
          <div
            style={{
              background: "var(--code-bg, #1e293b)",
              color: "#e2e8f0",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              fontFamily: "monospace",
              fontSize: "0.8125rem",
              wordBreak: "break-all",
              lineHeight: 1.7,
              minHeight: "3rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Content-Security-Policy: </span>
            <span>{header || (locale === "ko" ? "(활성화된 지시어 없음)" : "(no directives enabled)")}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={handleCopy}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                background: "var(--accent, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? t(T.copied) : t(T.copy)} (Header)
            </button>
            <button
              onClick={handleCopyMeta}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                background: "var(--bg-secondary, #f3f4f6)",
                color: "var(--text-primary, #111)",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t(T.copy)} (meta tag)
            </button>
          </div>
        </div>

        <div>
          <label style={labelStyle}>{locale === "ko" ? "HTML meta 태그" : "HTML meta tag"}</label>
          <div
            style={{
              background: "var(--code-bg, #1e293b)",
              color: "#e2e8f0",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              fontFamily: "monospace",
              fontSize: "0.8125rem",
              wordBreak: "break-all",
              lineHeight: 1.7,
            }}
          >
            {`<meta http-equiv="Content-Security-Policy" content="${header}">`}
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "빠른 프리셋" : "Quick Presets"}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            {
              label: locale === "ko" ? "엄격 (권장)" : "Strict (Recommended)",
              apply: () => setConfig({
                ...DEFAULT_CONFIG,
                "default-src": { enabled: true, value: "'none'" },
                "script-src": { enabled: true, value: "'self'" },
                "style-src": { enabled: true, value: "'self'" },
                "img-src": { enabled: true, value: "'self'" },
                "font-src": { enabled: true, value: "'self'" },
                "connect-src": { enabled: true, value: "'self'" },
                "frame-src": { enabled: true, value: "'none'" },
                "object-src": { enabled: true, value: "'none'" },
                "base-uri": { enabled: true, value: "'self'" },
                "form-action": { enabled: true, value: "'self'" },
                "frame-ancestors": { enabled: true, value: "'none'" },
                "upgrade-insecure-requests": { enabled: true, value: "" },
                "block-all-mixed-content": { enabled: true, value: "" },
                "media-src": { enabled: false, value: "'self'" },
              }),
            },
            {
              label: locale === "ko" ? "CDN 허용" : "Allow CDN",
              apply: () => setConfig({
                ...DEFAULT_CONFIG,
                "default-src": { enabled: true, value: "'self'" },
                "script-src": { enabled: true, value: "'self' https://cdn.jsdelivr.net https://unpkg.com" },
                "style-src": { enabled: true, value: "'self' 'unsafe-inline' https://fonts.googleapis.com" },
                "img-src": { enabled: true, value: "'self' data: https:" },
                "font-src": { enabled: true, value: "'self' https://fonts.gstatic.com" },
                "connect-src": { enabled: true, value: "'self' https://api.example.com" },
                "frame-src": { enabled: false, value: "'none'" },
                "media-src": { enabled: false, value: "'self'" },
                "object-src": { enabled: true, value: "'none'" },
                "base-uri": { enabled: true, value: "'self'" },
                "form-action": { enabled: true, value: "'self'" },
                "frame-ancestors": { enabled: false, value: "'none'" },
                "upgrade-insecure-requests": { enabled: false, value: "" },
                "block-all-mixed-content": { enabled: false, value: "" },
              }),
            },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={preset.apply}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                background: "var(--bg-secondary, #f3f4f6)",
                color: "var(--text-primary, #111)",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
