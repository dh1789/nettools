"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

const FIELD_NAMES_KO = ["분", "시", "일", "월", "요일"];
const FIELD_NAMES_EN = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];

const MONTH_NAMES_EN = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_NAMES_KO = [
  "", "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NAMES_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

const MONTH_MAP: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

const DAY_MAP: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

interface ParsedField {
  raw: string;
  description: { ko: string; en: string };
}

interface CronResult {
  fields: ParsedField[];
  summary: { ko: string; en: string };
}

function normalizeValue(val: string, fieldIndex: number): string {
  const upper = val.toUpperCase();
  if (fieldIndex === 3) {
    return MONTH_MAP[upper] !== undefined ? String(MONTH_MAP[upper]) : val;
  }
  if (fieldIndex === 4) {
    if (DAY_MAP[upper] !== undefined) return String(DAY_MAP[upper]);
    if (val === "7") return "0";
    return val;
  }
  return val;
}

function parseFieldValues(part: string, fieldIndex: number): number[] | null {
  const values: number[] = [];
  const segments = part.split(",");
  const ranges: [number, number][] = [
    [0, 59], [0, 23], [1, 31], [1, 12], [0, 6],
  ];
  const [min, max] = ranges[fieldIndex];

  for (const seg of segments) {
    const normalized = normalizeValue(seg.trim(), fieldIndex);
    if (normalized === "*") {
      for (let i = min; i <= max; i++) values.push(i);
    } else if (normalized.includes("/")) {
      const [rangePart, stepStr] = normalized.split("/");
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) return null;
      let start = min;
      let end = max;
      if (rangePart !== "*") {
        if (rangePart.includes("-")) {
          const [a, b] = rangePart.split("-").map((v) => parseInt(normalizeValue(v, fieldIndex), 10));
          if (isNaN(a) || isNaN(b)) return null;
          start = a;
          end = b;
        } else {
          start = parseInt(rangePart, 10);
          if (isNaN(start)) return null;
          end = max;
        }
      }
      for (let i = start; i <= end; i += step) values.push(i);
    } else if (normalized.includes("-")) {
      const parts = normalized.split("-").map((v) => parseInt(normalizeValue(v, fieldIndex), 10));
      if (parts.length !== 2 || parts.some(isNaN)) return null;
      const [a, b] = parts;
      for (let i = a; i <= b; i++) values.push(i);
    } else {
      const n = parseInt(normalized, 10);
      if (isNaN(n)) return null;
      values.push(n);
    }
  }
  return values;
}

function describeField(part: string, fieldIndex: number): { ko: string; en: string } {
  const normalized = part.toUpperCase().split(",").map((s) => {
    const trimmed = s.trim();
    if (fieldIndex === 3) {
      return Object.keys(MONTH_MAP).reduce((v, name) =>
        v.replace(new RegExp(`\\b${name}\\b`, "gi"), String(MONTH_MAP[name])), trimmed);
    }
    if (fieldIndex === 4) {
      let result = trimmed;
      result = Object.keys(DAY_MAP).reduce((v, name) =>
        v.replace(new RegExp(`\\b${name}\\b`, "gi"), String(DAY_MAP[name])), result);
      return result.replace(/\b7\b/g, "0");
    }
    return trimmed;
  }).join(",");

  if (normalized === "*") {
    return {
      ko: `매 ${FIELD_NAMES_KO[fieldIndex]}`,
      en: `Every ${FIELD_NAMES_EN[fieldIndex].toLowerCase()}`,
    };
  }

  if (normalized.includes("/")) {
    const [rangePart, step] = normalized.split("/");
    if (rangePart === "*") {
      return {
        ko: `${step}${FIELD_NAMES_KO[fieldIndex]}마다`,
        en: `Every ${step} ${FIELD_NAMES_EN[fieldIndex].toLowerCase()}(s)`,
      };
    }
    return {
      ko: `${rangePart} 범위에서 ${step}${FIELD_NAMES_KO[fieldIndex]}마다`,
      en: `Every ${step} ${FIELD_NAMES_EN[fieldIndex].toLowerCase()}(s) in range ${rangePart}`,
    };
  }

  if (normalized.includes("-")) {
    const [a, b] = normalized.split("-");
    if (fieldIndex === 4) {
      const dayA = parseInt(a, 10);
      const dayB = parseInt(b, 10);
      if (!isNaN(dayA) && !isNaN(dayB) && dayA >= 0 && dayA <= 6 && dayB >= 0 && dayB <= 6) {
        return {
          ko: `${DAY_NAMES_KO[dayA]}부터 ${DAY_NAMES_KO[dayB]}까지`,
          en: `${DAY_NAMES_EN[dayA]} through ${DAY_NAMES_EN[dayB]}`,
        };
      }
    }
    if (fieldIndex === 3) {
      const mA = parseInt(a, 10);
      const mB = parseInt(b, 10);
      if (!isNaN(mA) && !isNaN(mB) && mA >= 1 && mA <= 12 && mB >= 1 && mB <= 12) {
        return {
          ko: `${MONTH_NAMES_KO[mA]}부터 ${MONTH_NAMES_KO[mB]}까지`,
          en: `${MONTH_NAMES_EN[mA]} through ${MONTH_NAMES_EN[mB]}`,
        };
      }
    }
    return {
      ko: `${a}부터 ${b}까지`,
      en: `${a} through ${b}`,
    };
  }

  if (normalized.includes(",")) {
    const vals = normalized.split(",").map((v) => v.trim());
    if (fieldIndex === 4) {
      return {
        ko: vals.map((v) => DAY_NAMES_KO[parseInt(v, 10)] || v).join(", "),
        en: vals.map((v) => DAY_NAMES_EN[parseInt(v, 10)] || v).join(", "),
      };
    }
    if (fieldIndex === 3) {
      return {
        ko: vals.map((v) => MONTH_NAMES_KO[parseInt(v, 10)] || v).join(", "),
        en: vals.map((v) => MONTH_NAMES_EN[parseInt(v, 10)] || v).join(", "),
      };
    }
    return {
      ko: vals.join(", "),
      en: vals.join(", "),
    };
  }

  const n = parseInt(normalized, 10);
  if (fieldIndex === 4 && !isNaN(n) && n >= 0 && n <= 6) {
    return { ko: DAY_NAMES_KO[n], en: DAY_NAMES_EN[n] };
  }
  if (fieldIndex === 3 && !isNaN(n) && n >= 1 && n <= 12) {
    return { ko: MONTH_NAMES_KO[n], en: MONTH_NAMES_EN[n] };
  }

  return { ko: normalized, en: normalized };
}

function buildSummary(fields: string[]): { ko: string; en: string } {
  const [minute, hour, dom, month, dow] = fields;

  const isWild = (f: string) => f === "*";
  const pad = (n: number) => String(n).padStart(2, "0");

  if (fields.every(isWild)) {
    return { ko: "매 분마다 실행", en: "Runs every minute" };
  }

  let koTime = "";
  let enTime = "";

  const minVal = parseInt(minute, 10);
  const hourVal = parseInt(hour, 10);
  const hasSpecificTime = !isNaN(minVal) && !isNaN(hourVal) && !minute.includes("/") && !hour.includes("/")
    && !minute.includes("-") && !hour.includes("-") && !minute.includes(",") && !hour.includes(",");

  if (hasSpecificTime) {
    const ampm = hourVal >= 12 ? "PM" : "AM";
    const h12 = hourVal === 0 ? 12 : hourVal > 12 ? hourVal - 12 : hourVal;
    enTime = `at ${h12}:${pad(minVal)} ${ampm}`;
    koTime = `${pad(hourVal)}:${pad(minVal)}에`;
  } else if (isWild(minute) && isWild(hour)) {
    enTime = "every minute";
    koTime = "매 분";
  } else if (!isNaN(minVal) && isWild(hour)) {
    enTime = `at minute ${minVal} of every hour`;
    koTime = `매 시 ${minVal}분에`;
  } else if (isWild(minute) && !isNaN(hourVal)) {
    enTime = `every minute during hour ${hourVal}`;
    koTime = `${hourVal}시 매 분`;
  } else if (minute.includes("/")) {
    const step = minute.split("/")[1];
    enTime = `every ${step} minutes`;
    koTime = `${step}분마다`;
  } else if (hour.includes("/")) {
    const step = hour.split("/")[1];
    enTime = `every ${step} hours`;
    koTime = `${step}시간마다`;
  } else {
    enTime = `at ${describeField(minute, 0).en} minute, ${describeField(hour, 1).en} hour`;
    koTime = `${describeField(hour, 1).ko} ${describeField(minute, 0).ko}`;
  }

  let koDow = "";
  let enDow = "";
  if (!isWild(dow)) {
    const dowDesc = describeField(dow, 4);
    koDow = dowDesc.ko;
    enDow = dowDesc.en;
  }

  let koDom = "";
  let enDom = "";
  if (!isWild(dom)) {
    koDom = `${dom}일`;
    enDom = dom.includes(",") ? `on days ${dom}` : `on day ${dom}`;
  }

  let koMonth = "";
  let enMonth = "";
  if (!isWild(month)) {
    const mDesc = describeField(month, 3);
    koMonth = mDesc.ko;
    enMonth = `in ${mDesc.en}`;
  }

  const koParts: string[] = [];
  const enParts: string[] = [];

  if (koMonth) koParts.push(koMonth);
  if (koDom) koParts.push(koDom);
  if (koDow) koParts.push(koDow);
  koParts.push(koTime);
  koParts.push("실행");

  enParts.push("Runs");
  enParts.push(enTime);
  if (enDom) enParts.push(enDom);
  if (enDow) enParts.push(`on ${enDow}`);
  if (enMonth) enParts.push(enMonth);

  return {
    ko: koParts.join(" "),
    en: enParts.join(" "),
  };
}

function parseCron(expression: string): CronResult | null {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) return null;

  const fields: ParsedField[] = [];
  for (let i = 0; i < 5; i++) {
    const vals = parseFieldValues(parts[i], i);
    if (vals === null) return null;
    fields.push({
      raw: parts[i],
      description: describeField(parts[i], i),
    });
  }

  return {
    fields,
    summary: buildSummary(parts),
  };
}

interface PresetExample {
  expression: string;
  label: { ko: string; en: string };
}

const PRESETS: PresetExample[] = [
  { expression: "* * * * *", label: { ko: "매 분마다", en: "Every minute" } },
  { expression: "0 * * * *", label: { ko: "매 시 정각", en: "Every hour" } },
  { expression: "0 0 * * *", label: { ko: "매일 자정", en: "Every day at midnight" } },
  { expression: "0 9 * * 1-5", label: { ko: "평일 오전 9시", en: "Weekdays at 9 AM" } },
  { expression: "*/5 * * * *", label: { ko: "5분마다", en: "Every 5 minutes" } },
  { expression: "0 0 1 * *", label: { ko: "매월 1일 자정", en: "First day of every month" } },
  { expression: "0 0 * * 0", label: { ko: "매주 일요일 자정", en: "Every Sunday at midnight" } },
  { expression: "30 4 1,15 * *", label: { ko: "1일, 15일 오전 4:30", en: "4:30 AM on 1st and 15th" } },
];

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

const resultRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem 0",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
};

const resultLabelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--text-secondary, #6b7280)",
};

const resultValueStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontFamily: "monospace",
  fontWeight: 600,
  color: "var(--text-primary, #111)",
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

const presetButtonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
  textAlign: "left" as const,
  transition: "all 0.2s",
};

const FIELD_REFERENCE = [
  {
    field: { ko: "분", en: "Minute" },
    range: "0-59",
    special: "* , - /",
  },
  {
    field: { ko: "시", en: "Hour" },
    range: "0-23",
    special: "* , - /",
  },
  {
    field: { ko: "일", en: "Day of Month" },
    range: "1-31",
    special: "* , - /",
  },
  {
    field: { ko: "월", en: "Month" },
    range: "1-12 / JAN-DEC",
    special: "* , - /",
  },
  {
    field: { ko: "요일", en: "Day of Week" },
    range: "0-7 / SUN-SAT",
    special: "* , - /",
  },
];

export function CronParser() {
  const { t } = useLocale();
  const [input, setInput] = useState("0 9 * * 1-5");
  const [result, setResult] = useState<CronResult | null>(() => parseCron("0 9 * * 1-5"));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleParse = useCallback(() => {
    const parsed = parseCron(input);
    if (!parsed) {
      setError(t({ ko: "유효하지 않은 크론 표현식입니다. 5개 필드(분 시 일 월 요일)를 입력하세요.", en: "Invalid cron expression. Enter 5 fields: minute hour day month weekday." }));
      setResult(null);
      return;
    }
    setError("");
    setResult(parsed);
  }, [input, t]);

  const handleInputChange = (value: string) => {
    setInput(value);
    const parsed = parseCron(value);
    if (parsed) {
      setError("");
      setResult(parsed);
    }
  };

  const handlePreset = (expression: string) => {
    setInput(expression);
    setError("");
    setResult(parseCron(expression));
  };

  const copyDescription = () => {
    if (!result) return;
    const lang = t({ ko: "ko", en: "en" }) as "ko" | "en";
    const text = result.summary[lang];
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fieldNames = t({ ko: "ko", en: "en" }) === "ko" ? FIELD_NAMES_KO : FIELD_NAMES_EN;
  const currentLang = t({ ko: "ko", en: "en" }) as "ko" | "en";

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "크론 표현식", en: "Cron Expression" })}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            placeholder="0 9 * * 1-5"
            style={{
              ...inputStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
              flex: 1,
            }}
          />
          <button onClick={handleParse} style={buttonStyle}>
            {t({ ko: "파싱", en: "Parse" })}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t({ ko: "형식: 분 시 일 월 요일 (예: 0 9 * * 1-5)", en: "Format: minute hour day month weekday (e.g., 0 9 * * 1-5)" })}
        </p>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Preset Examples */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "자주 사용하는 예제", en: "Common Examples" })}</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.expression}
              onClick={() => handlePreset(preset.expression)}
              style={{
                ...presetButtonStyle,
                background: input === preset.expression ? "var(--text-primary, #111)" : "transparent",
                color: input === preset.expression ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: "0.6875rem" }}>
                {preset.expression}
              </span>
              <span style={{ marginLeft: "0.375rem", fontSize: "0.6875rem" }}>
                {preset.label[currentLang]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Summary */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
              }}
            >
              {t({ ko: "결과", en: "Result" })}
            </h2>
            <button
              onClick={copyDescription}
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
              {copied ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "설명 복사", en: "Copy Description" })}
            </button>
          </div>

          {/* Human-readable description */}
          <div
            style={{
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                marginBottom: "0.375rem",
              }}
            >
              {t({ ko: "설명", en: "Description" })}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
              }}
            >
              {result.summary[currentLang]}
            </div>
          </div>

          {/* Field Breakdown */}
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
                marginBottom: "0.5rem",
              }}
            >
              {t({ ko: "필드별 분석", en: "Field Breakdown" })}
            </div>
            {result.fields.map((field, i) => (
              <div
                key={i}
                style={{
                  ...resultRowStyle,
                  borderBottom: i === result.fields.length - 1 ? "none" : resultRowStyle.borderBottom,
                }}
              >
                <span style={resultLabelStyle}>
                  {fieldNames[i]}
                  <span
                    style={{
                      fontFamily: "monospace",
                      marginLeft: "0.5rem",
                      color: "var(--text-primary, #111)",
                      fontWeight: 600,
                    }}
                  >
                    {field.raw}
                  </span>
                </span>
                <span style={resultValueStyle}>
                  {field.description[currentLang]}
                </span>
              </div>
            ))}
          </div>

          {/* Field Reference Table */}
          <details>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                userSelect: "none",
              }}
            >
              {t({ ko: "필드 참조표", en: "Field Reference" })}
            </summary>
            <div
              style={{
                marginTop: "0.5rem",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--border-light, #f3f4f6)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8125rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "var(--input-bg, #f9fafb)",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-secondary, #6b7280)", fontWeight: 600 }}>
                      {t({ ko: "필드", en: "Field" })}
                    </th>
                    <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-secondary, #6b7280)", fontWeight: 600 }}>
                      {t({ ko: "허용 값", en: "Allowed Values" })}
                    </th>
                    <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-secondary, #6b7280)", fontWeight: 600 }}>
                      {t({ ko: "특수 문자", en: "Special Characters" })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FIELD_REFERENCE.map((ref, i) => (
                    <tr
                      key={i}
                      style={{
                        borderTop: "1px solid var(--border-light, #f3f4f6)",
                      }}
                    >
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 500, color: "var(--text-primary, #111)" }}>
                        {ref.field[currentLang]}
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", color: "var(--text-primary, #111)" }}>
                        {ref.range}
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", color: "var(--text-secondary, #6b7280)" }}>
                        {ref.special}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
