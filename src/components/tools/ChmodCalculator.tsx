"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

type PermissionSet = [boolean, boolean, boolean];

function permToBits(perm: PermissionSet): number {
  return (perm[0] ? 4 : 0) + (perm[1] ? 2 : 0) + (perm[2] ? 1 : 0);
}

function bitsToPerm(bits: number): PermissionSet {
  return [(bits & 4) !== 0, (bits & 2) !== 0, (bits & 1) !== 0];
}

function permsToOctal(owner: PermissionSet, group: PermissionSet, others: PermissionSet): string {
  return `${permToBits(owner)}${permToBits(group)}${permToBits(others)}`;
}

function octalToPerms(octal: string): [PermissionSet, PermissionSet, PermissionSet] | null {
  if (!/^[0-7]{3}$/.test(octal)) return null;
  return [
    bitsToPerm(parseInt(octal[0], 10)),
    bitsToPerm(parseInt(octal[1], 10)),
    bitsToPerm(parseInt(octal[2], 10)),
  ];
}

function permToSymbolic(perm: PermissionSet): string {
  return (perm[0] ? "r" : "-") + (perm[1] ? "w" : "-") + (perm[2] ? "x" : "-");
}

function toSymbolicString(owner: PermissionSet, group: PermissionSet, others: PermissionSet): string {
  return permToSymbolic(owner) + permToSymbolic(group) + permToSymbolic(others);
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

const presetButtonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
  fontFamily: "monospace",
  transition: "all 0.2s",
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  fontSize: "0.8125rem",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
  userSelect: "none",
};

interface Preset {
  value: string;
  label: { ko: string; en: string };
}

const PRESETS: Preset[] = [
  { value: "755", label: { ko: "755 (표준 디렉토리/실행파일)", en: "755 (standard dir/exec)" } },
  { value: "644", label: { ko: "644 (표준 파일)", en: "644 (standard file)" } },
  { value: "777", label: { ko: "777 (전체 접근)", en: "777 (full access)" } },
  { value: "600", label: { ko: "600 (소유자 전용)", en: "600 (owner only)" } },
  { value: "750", label: { ko: "750 (소유자 전체, 그룹 읽기+실행)", en: "750 (owner full, group r+x)" } },
  { value: "700", label: { ko: "700 (소유자 전용, 전체 접근)", en: "700 (owner only, full)" } },
];

const PERM_LABELS = {
  read: { ko: "읽기 (r)", en: "Read (r)" },
  write: { ko: "쓰기 (w)", en: "Write (w)" },
  execute: { ko: "실행 (x)", en: "Execute (x)" },
};

const ROW_LABELS = {
  owner: { ko: "소유자 (Owner)", en: "Owner" },
  group: { ko: "그룹 (Group)", en: "Group" },
  others: { ko: "기타 (Others)", en: "Others" },
};

const PERM_EXPLANATIONS = [
  { symbol: "r", value: "4", desc: { ko: "읽기 - 파일 내용을 읽거나 디렉토리 목록을 볼 수 있음", en: "Read - can read file contents or list directory" } },
  { symbol: "w", value: "2", desc: { ko: "쓰기 - 파일을 수정하거나 디렉토리에 파일을 생성/삭제할 수 있음", en: "Write - can modify file or create/delete files in directory" } },
  { symbol: "x", value: "1", desc: { ko: "실행 - 파일을 실행하거나 디렉토리에 접근할 수 있음", en: "Execute - can execute file or access directory" } },
];

export function ChmodCalculator() {
  const { t } = useLocale();
  const [octalInput, setOctalInput] = useState("755");
  const [owner, setOwner] = useState<PermissionSet>([true, true, true]);
  const [group, setGroup] = useState<PermissionSet>([true, false, true]);
  const [others, setOthers] = useState<PermissionSet>([true, false, true]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const updateFromOctal = useCallback((value: string) => {
    setOctalInput(value);
    const perms = octalToPerms(value);
    if (perms) {
      setError("");
      setOwner(perms[0]);
      setGroup(perms[1]);
      setOthers(perms[2]);
    } else if (value.length >= 3) {
      setError(t({ ko: "0-7 사이의 숫자 3자리를 입력하세요", en: "Enter 3 digits between 0-7" }));
    }
  }, [t]);

  const updateFromCheckbox = useCallback((
    target: "owner" | "group" | "others",
    index: number,
    checked: boolean
  ) => {
    const update = (prev: PermissionSet): PermissionSet => {
      const next: PermissionSet = [...prev];
      next[index] = checked;
      return next;
    };
    let newOwner = owner;
    let newGroup = group;
    let newOthers = others;
    if (target === "owner") { newOwner = update(owner); setOwner(newOwner); }
    if (target === "group") { newGroup = update(group); setGroup(newGroup); }
    if (target === "others") { newOthers = update(others); setOthers(newOthers); }
    const newOctal = permsToOctal(newOwner, newGroup, newOthers);
    setOctalInput(newOctal);
    setError("");
  }, [owner, group, others]);

  const applyPreset = useCallback((value: string) => {
    updateFromOctal(value);
  }, [updateFromOctal]);

  const octal = permsToOctal(owner, group, others);
  const symbolic = toSymbolicString(owner, group, others);
  const command = `chmod ${octal}`;
  const lsFormat = `-${symbolic}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCheckboxRow = (
    label: { ko: string; en: string },
    perms: PermissionSet,
    target: "owner" | "group" | "others"
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid var(--border-light, #f3f4f6)",
      }}
    >
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--text-primary, #111)",
          minWidth: "7rem",
        }}
      >
        {t(label)}
      </span>
      {[0, 1, 2].map((i) => (
        <label key={i} style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={perms[i]}
            onChange={(e) => updateFromCheckbox(target, i, e.target.checked)}
            style={{ accentColor: "var(--text-primary, #111)" }}
          />
          {["r", "w", "x"][i]}
        </label>
      ))}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.8125rem",
          color: "var(--text-secondary, #6b7280)",
          marginLeft: "auto",
        }}
      >
        {permToBits(perms)}
      </span>
    </div>
  );

  return (
    <div>
      {/* Numeric Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "8진수 권한 값", en: "Octal Permission Value" })}
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={octalInput}
            onChange={(e) => updateFromOctal(e.target.value.replace(/[^0-7]/g, "").slice(0, 3))}
            placeholder="755"
            maxLength={3}
            style={{
              ...inputStyle,
              borderColor: error ? "#ef4444" : "var(--border, #d1d5db)",
              flex: 1,
              maxWidth: "10rem",
            }}
          />
        </div>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
            {error}
          </p>
        )}
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t({ ko: "0-7 사이의 숫자 3자리 (예: 755, 644)", en: "3 digits between 0-7 (e.g., 755, 644)" })}
        </p>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "자주 사용하는 권한", en: "Common Presets" })}
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => applyPreset(preset.value)}
              style={{
                ...presetButtonStyle,
                background: octal === preset.value ? "var(--text-primary, #111)" : "transparent",
                color: octal === preset.value ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                borderColor: octal === preset.value ? "var(--text-primary, #111)" : "var(--border, #d1d5db)",
              }}
            >
              {t(preset.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Permission Checkboxes */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "권한 설정", en: "Permission Settings" })}
        </label>
        <div
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid var(--border, #d1d5db)",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ minWidth: "7rem" }} />
            {[PERM_LABELS.read, PERM_LABELS.write, PERM_LABELS.execute].map((label, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-tertiary, #9ca3af)",
                  minWidth: "3rem",
                }}
              >
                {t(label)}
              </span>
            ))}
          </div>
          {renderCheckboxRow(ROW_LABELS.owner, owner, "owner")}
          {renderCheckboxRow(ROW_LABELS.group, group, "group")}
          <div style={{ borderBottom: "none" }}>
            {renderCheckboxRow(ROW_LABELS.others, others, "others")}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
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
            {t({ ko: "결과", en: "Results" })}
          </h2>
          <button
            onClick={copyCommand}
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

        {/* Highlighted chmod command */}
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
            {t({ ko: "chmod 명령어", en: "chmod Command" })}
          </div>
          <div
            style={{
              fontSize: "1.25rem",
              fontFamily: "monospace",
              fontWeight: 700,
              color: "var(--text-primary, #111)",
            }}
          >
            {command} &lt;{t({ ko: "파일명", en: "filename" })}&gt;
          </div>
        </div>

        {/* Detail table */}
        <div
          style={{
            background: "var(--result-bg, #f0fdf4)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={resultRowStyle}>
            <span style={resultLabelStyle}>
              {t({ ko: "8진수 (Numeric)", en: "Numeric (Octal)" })}
            </span>
            <span style={resultValueStyle}>{octal}</span>
          </div>
          <div style={resultRowStyle}>
            <span style={resultLabelStyle}>
              {t({ ko: "기호식 (Symbolic)", en: "Symbolic" })}
            </span>
            <span style={resultValueStyle}>{symbolic}</span>
          </div>
          <div style={resultRowStyle}>
            <span style={resultLabelStyle}>
              {t({ ko: "명령어 (Command)", en: "Command" })}
            </span>
            <span style={resultValueStyle}>{command}</span>
          </div>
          <div style={{ ...resultRowStyle, borderBottom: "none" }}>
            <span style={resultLabelStyle}>
              {t({ ko: "ls -l 형식", en: "ls -l Format" })}
            </span>
            <span style={resultValueStyle}>{lsFormat}</span>
          </div>
        </div>

        {/* Permission Explanation */}
        <details>
          <summary
            style={{
              cursor: "pointer",
              fontSize: "0.8125rem",
              color: "var(--text-secondary, #6b7280)",
              userSelect: "none",
            }}
          >
            {t({ ko: "권한 설명", en: "Permission Explanation" })}
          </summary>
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.8125rem",
              lineHeight: 1.8,
              color: "var(--text-primary, #111)",
            }}
          >
            {PERM_EXPLANATIONS.map((perm) => (
              <div
                key={perm.symbol}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "baseline",
                  padding: "0.25rem 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    minWidth: "1.5rem",
                  }}
                >
                  {perm.symbol}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    color: "var(--text-tertiary, #9ca3af)",
                    minWidth: "1.5rem",
                  }}
                >
                  ({perm.value})
                </span>
                <span>{t(perm.desc)}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
