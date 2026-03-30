"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

const textareaStyle: React.CSSProperties = {
  padding: "0.75rem 0.875rem",
  fontSize: "0.8125rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
  resize: "vertical",
  minHeight: "200px",
  lineHeight: 1.7,
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

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Minimal JSON Schema validator (Draft 7 subset)
function validateValue(
  value: unknown,
  schema: unknown,
  path: string,
  errors: ValidationError[]
): void {
  if (schema === true) return;
  if (typeof schema === "object" && schema !== null && !Array.isArray(schema) && Object.keys(schema).length === 0) return;
  if (schema === false) {
    errors.push({ path, message: "Value is not allowed" });
    return;
  }
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return;
  const s = schema as Record<string, unknown>;

  // $ref is not supported in this minimal validator
  if ("$ref" in s) return;

  // type check
  if ("type" in s) {
    const types = Array.isArray(s.type) ? s.type : [s.type];
    const actualType = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
    if (!types.includes(actualType) && !(types.includes("integer") && typeof value === "number" && Number.isInteger(value))) {
      errors.push({ path: path || "(root)", message: `Expected type "${(types as string[]).join("|")}", got "${actualType}"` });
      return;
    }
  }

  // enum
  if ("enum" in s && Array.isArray(s.enum)) {
    if (!(s.enum as unknown[]).some(v => JSON.stringify(v) === JSON.stringify(value))) {
      errors.push({ path: path || "(root)", message: `Value must be one of: ${(s.enum as unknown[]).map(v => JSON.stringify(v)).join(", ")}` });
    }
  }

  // const
  if ("const" in s) {
    if (JSON.stringify(value) !== JSON.stringify(s.const)) {
      errors.push({ path: path || "(root)", message: `Value must equal ${JSON.stringify(s.const)}` });
    }
  }

  if (typeof value === "string") {
    if ("minLength" in s && typeof s.minLength === "number" && value.length < s.minLength) {
      errors.push({ path: path || "(root)", message: `String length ${value.length} < minLength ${s.minLength}` });
    }
    if ("maxLength" in s && typeof s.maxLength === "number" && value.length > s.maxLength) {
      errors.push({ path: path || "(root)", message: `String length ${value.length} > maxLength ${s.maxLength}` });
    }
    if ("pattern" in s && typeof s.pattern === "string") {
      if (!new RegExp(s.pattern).test(value)) {
        errors.push({ path: path || "(root)", message: `String does not match pattern: ${s.pattern}` });
      }
    }
  }

  if (typeof value === "number") {
    if ("minimum" in s && typeof s.minimum === "number" && value < s.minimum) {
      errors.push({ path: path || "(root)", message: `${value} < minimum ${s.minimum}` });
    }
    if ("maximum" in s && typeof s.maximum === "number" && value > s.maximum) {
      errors.push({ path: path || "(root)", message: `${value} > maximum ${s.maximum}` });
    }
    if ("exclusiveMinimum" in s && typeof s.exclusiveMinimum === "number" && value <= s.exclusiveMinimum) {
      errors.push({ path: path || "(root)", message: `${value} <= exclusiveMinimum ${s.exclusiveMinimum}` });
    }
    if ("exclusiveMaximum" in s && typeof s.exclusiveMaximum === "number" && value >= s.exclusiveMaximum) {
      errors.push({ path: path || "(root)", message: `${value} >= exclusiveMaximum ${s.exclusiveMaximum}` });
    }
    if ("multipleOf" in s && typeof s.multipleOf === "number" && value % s.multipleOf !== 0) {
      errors.push({ path: path || "(root)", message: `${value} is not a multiple of ${s.multipleOf}` });
    }
  }

  if (Array.isArray(value)) {
    if ("minItems" in s && typeof s.minItems === "number" && value.length < s.minItems) {
      errors.push({ path: path || "(root)", message: `Array has ${value.length} items, minItems is ${s.minItems}` });
    }
    if ("maxItems" in s && typeof s.maxItems === "number" && value.length > s.maxItems) {
      errors.push({ path: path || "(root)", message: `Array has ${value.length} items, maxItems is ${s.maxItems}` });
    }
    if ("items" in s && s.items && typeof s.items === "object") {
      value.forEach((item, i) => {
        validateValue(item, s.items, `${path}[${i}]`, errors);
      });
    }
    if ("uniqueItems" in s && s.uniqueItems === true) {
      const seen = new Set<string>();
      value.forEach((item, i) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          errors.push({ path: `${path}[${i}]`, message: "Duplicate item (uniqueItems: true)" });
        }
        seen.add(key);
      });
    }
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const props = (s.properties ?? {}) as Record<string, unknown>;
    const required = (s.required ?? []) as string[];

    // required
    for (const req of required) {
      if (!(req in obj)) {
        errors.push({ path: path ? `${path}.${req}` : req, message: `Required property "${req}" is missing` });
      }
    }

    // properties
    for (const [key, propSchema] of Object.entries(props)) {
      if (key in obj) {
        validateValue(obj[key], propSchema, path ? `${path}.${key}` : key, errors);
      }
    }

    // additionalProperties
    if ("additionalProperties" in s && s.additionalProperties === false) {
      for (const key of Object.keys(obj)) {
        if (!(key in props)) {
          errors.push({ path: path ? `${path}.${key}` : key, message: `Additional property "${key}" is not allowed` });
        }
      }
    }

    // minProperties / maxProperties
    const numProps = Object.keys(obj).length;
    if ("minProperties" in s && typeof s.minProperties === "number" && numProps < s.minProperties) {
      errors.push({ path: path || "(root)", message: `Object has ${numProps} properties, minProperties is ${s.minProperties}` });
    }
    if ("maxProperties" in s && typeof s.maxProperties === "number" && numProps > s.maxProperties) {
      errors.push({ path: path || "(root)", message: `Object has ${numProps} properties, maxProperties is ${s.maxProperties}` });
    }
  }

  // allOf / anyOf / oneOf / not
  if ("allOf" in s && Array.isArray(s.allOf)) {
    for (const sub of s.allOf as unknown[]) {
      validateValue(value, sub, path, errors);
    }
  }

  if ("anyOf" in s && Array.isArray(s.anyOf)) {
    let anyValid = false;
    for (const sub of s.anyOf as unknown[]) {
      const subErrors: ValidationError[] = [];
      validateValue(value, sub, path, subErrors);
      if (subErrors.length === 0) { anyValid = true; break; }
    }
    if (!anyValid) {
      errors.push({ path: path || "(root)", message: `Value does not match any of the anyOf schemas` });
    }
  }

  if ("oneOf" in s && Array.isArray(s.oneOf)) {
    let matchCount = 0;
    for (const sub of s.oneOf as unknown[]) {
      const subErrors: ValidationError[] = [];
      validateValue(value, sub, path, subErrors);
      if (subErrors.length === 0) matchCount++;
    }
    if (matchCount !== 1) {
      errors.push({ path: path || "(root)", message: `Value must match exactly one of the oneOf schemas (matched ${matchCount})` });
    }
  }

  if ("not" in s && s.not && typeof s.not === "object") {
    const notErrors: ValidationError[] = [];
    validateValue(value, s.not, path, notErrors);
    if (notErrors.length === 0) {
      errors.push({ path: path || "(root)", message: "Value must NOT match the 'not' schema" });
    }
  }
}

function validate(jsonStr: string, schemaStr: string): ValidationResult {
  let json: unknown;
  let schema: Record<string, unknown>;

  try {
    json = JSON.parse(jsonStr);
  } catch (e) {
    return { valid: false, errors: [{ path: "(json)", message: `JSON parse error: ${(e as Error).message}` }] };
  }

  try {
    schema = JSON.parse(schemaStr);
  } catch (e) {
    return { valid: false, errors: [{ path: "(schema)", message: `Schema parse error: ${(e as Error).message}` }] };
  }

  const errors: ValidationError[] = [];
  validateValue(json, schema, "", errors);
  return { valid: errors.length === 0, errors };
}

const SAMPLE_SCHEMA = JSON.stringify({
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "pattern": "^[^@]+@[^@]+\\.[^@]+$" },
    "role": { "type": "string", "enum": ["admin", "user", "guest"] }
  },
  "additionalProperties": false
}, null, 2);

const SAMPLE_JSON = JSON.stringify({
  "name": "Alice",
  "age": 30,
  "email": "alice@example.com",
  "role": "admin"
}, null, 2);

export function JsonSchemaValidator() {
  const { locale, t } = useLocale();
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [schemaInput, setSchemaInput] = useState(SAMPLE_SCHEMA);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    setResult(validate(jsonInput, schemaInput));
  }, [jsonInput, schemaInput]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--text-secondary, #6b7280)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {locale === "ko"
            ? "JSON 데이터를 JSON Schema(Draft 7)에 따라 검증합니다. 스키마와 JSON을 입력하면 유효성 오류를 즉시 확인할 수 있습니다."
            : "Validate JSON data against a JSON Schema (Draft 7). Enter a schema and JSON to instantly check for validation errors."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={cardStyle}>
          <label style={{ ...labelStyle, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
            {locale === "ko" ? "JSON Schema" : "JSON Schema"}
          </label>
          <textarea
            value={schemaInput}
            onChange={e => setSchemaInput(e.target.value)}
            style={textareaStyle}
            spellCheck={false}
          />
        </div>
        <div style={cardStyle}>
          <label style={{ ...labelStyle, marginBottom: "0.5rem", fontSize: "0.875rem" }}>
            {locale === "ko" ? "JSON 데이터" : "JSON Data"}
          </label>
          <textarea
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            style={textareaStyle}
            spellCheck={false}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={handleValidate}
          style={{
            padding: "0.625rem 2rem",
            fontSize: "0.9375rem",
            background: "var(--accent, #3b82f6)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {locale === "ko" ? "검증" : "Validate"}
        </button>
      </div>

      {result && (
        <div
          style={{
            ...cardStyle,
            borderLeft: `4px solid ${result.valid ? "#22c55e" : "#ef4444"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: result.errors.length > 0 ? "1rem" : 0 }}>
            <span style={{ fontSize: "1.25rem" }}>{result.valid ? "✅" : "❌"}</span>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: result.valid ? "#16a34a" : "#dc2626" }}>
              {result.valid
                ? (locale === "ko" ? "유효한 JSON — 스키마 검증 통과" : "Valid JSON — schema validation passed")
                : (locale === "ko" ? `검증 실패 — ${result.errors.length}개 오류` : `Validation failed — ${result.errors.length} error(s)`)}
            </span>
          </div>
          {result.errors.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.errors.map((err, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.625rem 0.875rem",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                  }}
                >
                  <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#dc2626" }}>
                    {err.path || "(root)"}
                  </span>
                  <span style={{ color: "#7f1d1d", marginLeft: "0.5rem" }}>
                    {err.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ ...cardStyle, background: "var(--bg-secondary, #f3f4f6)" }}>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "지원 키워드 (Draft 7 서브셋)" : "Supported Keywords (Draft 7 Subset)"}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {["type", "properties", "required", "additionalProperties", "enum", "const", "allOf", "anyOf", "oneOf", "not",
            "minLength", "maxLength", "pattern", "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf",
            "minItems", "maxItems", "items", "uniqueItems", "minProperties", "maxProperties"].map(k => (
            <span
              key={k}
              style={{
                padding: "0.125rem 0.5rem",
                background: "var(--card-bg, #fff)",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "var(--text-primary, #111)",
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
