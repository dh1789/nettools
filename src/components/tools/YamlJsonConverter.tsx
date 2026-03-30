"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import * as yaml from "js-yaml";

const SAMPLE_YAML = `server:
  host: localhost
  port: 31000
  debug: false

database:
  url: postgresql://user:pass@localhost/mydb
  pool:
    min: 2
    max: 10

features:
  - authentication
  - rate-limiting
  - logging`;

const SAMPLE_JSON = `{
  "server": {
    "host": "localhost",
    "port": 31000,
    "debug": false
  },
  "database": {
    "url": "postgresql://user:pass@localhost/mydb",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "features": [
    "authentication",
    "rate-limiting",
    "logging"
  ]
}`;

type Direction = "yaml2json" | "json2yaml";

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
  minHeight: "220px",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

export function YamlJsonConverter() {
  const { t } = useLocale();
  const [direction, setDirection] = useState<Direction>("yaml2json");
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    try {
      if (direction === "yaml2json") {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }, [direction, input]);

  const handleSwap = () => {
    const newDir: Direction = direction === "yaml2json" ? "json2yaml" : "yaml2json";
    setDirection(newDir);
    setInput(output || (newDir === "yaml2json" ? SAMPLE_YAML : SAMPLE_JSON));
    setOutput("");
    setError("");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(direction === "yaml2json" ? SAMPLE_YAML : SAMPLE_JSON);
    setOutput("");
    setError("");
  };

  return (
    <div>
      {/* Direction selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", border: "1px solid var(--border, #d1d5db)", borderRadius: "8px", overflow: "hidden" }}>
          {(["yaml2json", "json2yaml"] as Direction[]).map((dir) => (
            <button
              key={dir}
              onClick={() => {
                setDirection(dir);
                setInput(dir === "yaml2json" ? SAMPLE_YAML : SAMPLE_JSON);
                setOutput("");
                setError("");
              }}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                border: "none",
                background: direction === dir ? "var(--text-primary, #111)" : "transparent",
                color: direction === dir ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
              }}
            >
              {dir === "yaml2json" ? "YAML → JSON" : "JSON → YAML"}
            </button>
          ))}
        </div>
        <button
          onClick={handleSwap}
          title={t({ ko: "방향 전환", en: "Swap direction" })}
          style={{
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
          }}
        >
          ⇄ {t({ ko: "전환", en: "Swap" })}
        </button>
        <button
          onClick={loadSample}
          style={{
            padding: "0.5rem 0.75rem",
            fontSize: "0.8125rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--text-secondary, #6b7280)",
            cursor: "pointer",
          }}
        >
          {t({ ko: "예제 로드", en: "Load Sample" })}
        </button>
      </div>

      {/* Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {direction === "yaml2json"
            ? t({ ko: "YAML 입력", en: "YAML Input" })
            : t({ ko: "JSON 입력", en: "JSON Input" })}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={inputStyle}
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        style={{
          padding: "0.625rem 1.5rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          border: "none",
          borderRadius: "8px",
          background: "var(--text-primary, #111)",
          color: "var(--surface, #fff)",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        {t({ ko: "변환", en: "Convert" })}
      </button>

      {/* Error */}
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
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <strong>{t({ ko: "오류", en: "Error" })}:</strong> {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <label style={labelStyle}>
              {direction === "yaml2json"
                ? t({ ko: "JSON 결과", en: "JSON Output" })
                : t({ ko: "YAML 결과", en: "YAML Output" })}
            </label>
            <button
              onClick={handleCopy}
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
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            style={{ ...inputStyle, background: "var(--result-bg, #f0fdf4)", cursor: "default" }}
          />
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", marginTop: "0.375rem" }}>
            {output.length} {t({ ko: "자", en: "chars" })}
          </p>
        </div>
      )}
    </div>
  );
}
