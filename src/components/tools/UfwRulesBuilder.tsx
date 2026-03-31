"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type Action = "allow" | "deny" | "reject" | "limit";
type Direction = "in" | "out" | "both";
type Protocol = "tcp" | "udp" | "any";

const COMMON_PORTS = [
  { port: "22", label: "SSH" },
  { port: "80", label: "HTTP" },
  { port: "443", label: "HTTPS" },
  { port: "3306", label: "MySQL" },
  { port: "5432", label: "PostgreSQL" },
  { port: "6379", label: "Redis" },
  { port: "27017", label: "MongoDB" },
  { port: "8080", label: "HTTP Alt" },
  { port: "25", label: "SMTP" },
  { port: "53", label: "DNS" },
];

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
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

const selectStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
  cursor: "pointer",
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

const smallButtonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
};

function buildCommand(
  action: Action,
  direction: Direction,
  protocol: Protocol,
  port: string,
  fromIp: string,
  toIp: string,
  comment: string,
  useV6: boolean
): string[] {
  const cmds: string[] = [];
  const portPart = port ? (protocol === "any" ? `${port}` : `${port}/${protocol}`) : "";

  const buildSingle = (v: "ufw" | "ufw6") => {
    let cmd = `sudo ${v} ${action}`;
    if (direction !== "both") cmd += ` ${direction}`;
    if (fromIp) cmd += ` from ${fromIp}`;
    if (toIp) cmd += ` to ${toIp}`;
    if (portPart) cmd += ` port ${portPart}`;
    if (comment) cmd += ` comment '${comment}'`;
    return cmd;
  };

  cmds.push(buildSingle("ufw"));
  if (useV6) cmds.push(buildSingle("ufw6"));
  return cmds;
}

export function UfwRulesBuilder() {
  const { t } = useLocale();
  const [action, setAction] = useState<Action>("allow");
  const [direction, setDirection] = useState<Direction>("in");
  const [protocol, setProtocol] = useState<Protocol>("tcp");
  const [port, setPort] = useState("22");
  const [fromIp, setFromIp] = useState("");
  const [toIp, setToIp] = useState("");
  const [comment, setComment] = useState("");
  const [useV6, setUseV6] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const cmds = buildCommand(action, direction, protocol, port, fromIp, toIp, comment, useV6);
    setCommands(cmds);
  }, [action, direction, protocol, port, fromIp, toIp, comment, useV6]);

  const copyCmd = useCallback(async (cmd: string, idx: number) => {
    await navigator.clipboard.writeText(cmd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(commands.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  }, [commands]);

  const actionColors: Record<Action, string> = {
    allow: "#10b981",
    deny: "#ef4444",
    reject: "#f59e0b",
    limit: "#8b5cf6",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Common port shortcuts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={labelStyle}>{t({ ko: "자주 사용하는 포트", en: "Common Ports" })}</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {COMMON_PORTS.map(({ port: p, label }) => (
            <button
              key={p}
              style={{
                ...smallButtonStyle,
                background: port === p ? "var(--text-primary, #111)" : "transparent",
                color: port === p ? "var(--surface, #fff)" : "var(--text-secondary, #6b7280)",
                borderColor: port === p ? "var(--text-primary, #111)" : "var(--border, #d1d5db)",
              }}
              onClick={() => setPort(p)}
            >
              {label} ({p})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "동작", en: "Action" })}</label>
          <select style={selectStyle} value={action} onChange={(e) => setAction(e.target.value as Action)}>
            <option value="allow">allow</option>
            <option value="deny">deny</option>
            <option value="reject">reject</option>
            <option value="limit">limit (rate limit)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "방향", en: "Direction" })}</label>
          <select style={selectStyle} value={direction} onChange={(e) => setDirection(e.target.value as Direction)}>
            <option value="in">{t({ ko: "in (인바운드)", en: "in (inbound)" })}</option>
            <option value="out">{t({ ko: "out (아웃바운드)", en: "out (outbound)" })}</option>
            <option value="both">{t({ ko: "both (양방향)", en: "both (bidirectional)" })}</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "포트", en: "Port" })}</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="22 or 8000:9000"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "프로토콜", en: "Protocol" })}</label>
          <select style={selectStyle} value={protocol} onChange={(e) => setProtocol(e.target.value as Protocol)}>
            <option value="tcp">tcp</option>
            <option value="udp">udp</option>
            <option value="any">any</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "출발지 IP (선택)", en: "From IP (optional)" })}</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="192.168.1.0/24 or any"
            value={fromIp}
            onChange={(e) => setFromIp(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={labelStyle}>{t({ ko: "목적지 IP (선택)", en: "To IP (optional)" })}</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="10.0.0.1 or any"
            value={toIp}
            onChange={(e) => setToIp(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={labelStyle}>{t({ ko: "설명 (선택)", en: "Comment (optional)" })}</label>
        <input
          style={inputStyle}
          type="text"
          placeholder={t({ ko: "예: Allow web traffic", en: "e.g. Allow web traffic" })}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          color: "var(--text-secondary, #6b7280)",
        }}
      >
        <input type="checkbox" checked={useV6} onChange={(e) => setUseV6(e.target.checked)} />
        {t({ ko: "IPv6 규칙도 생성 (ufw6)", en: "Also generate IPv6 rule (ufw6)" })}
      </label>

      <button style={buttonStyle} onClick={generate}>
        {t({ ko: "규칙 생성", en: "Generate Rule" })}
      </button>

      {commands.length > 0 && (
        <div
          style={{
            background: "var(--surface-2, #f9fafb)",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "10px",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  padding: "0.125rem 0.5rem",
                  borderRadius: "4px",
                  background: actionColors[action],
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {action.toUpperCase()}
              </span>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary, #6b7280)" }}>
                {t({ ko: "생성된 명령어", en: "Generated Commands" })}
              </span>
            </div>
            {commands.length > 1 && (
              <button style={smallButtonStyle} onClick={copyAll}>
                {copied === -1 ? t({ ko: "복사됨!", en: "Copied!" }) : t({ ko: "전체 복사", en: "Copy All" })}
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {commands.map((cmd, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "#1e1e2e",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <code
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#a6e3a1",
                    flex: 1,
                    wordBreak: "break-all",
                  }}
                >
                  {cmd}
                </code>
                <button
                  style={{ ...smallButtonStyle, borderColor: "#444", color: "#888" }}
                  onClick={() => copyCmd(cmd, i)}
                >
                  {copied === i ? "✓" : t({ ko: "복사", en: "Copy" })}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UFW setup hints */}
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "var(--surface-2, #f9fafb)",
          border: "1px solid var(--border, #d1d5db)",
          borderRadius: "8px",
          fontSize: "0.8125rem",
          color: "var(--text-secondary, #6b7280)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.375rem", color: "var(--text-primary, #111)" }}>
          {t({ ko: "UFW 기본 명령어", en: "UFW Basic Commands" })}
        </div>
        <pre style={{ fontFamily: "monospace", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
          {`sudo ufw enable       # ${t({ ko: "UFW 활성화", en: "Enable UFW" })}
sudo ufw disable      # ${t({ ko: "UFW 비활성화", en: "Disable UFW" })}
sudo ufw status verbose  # ${t({ ko: "규칙 목록 확인", en: "List all rules" })}
sudo ufw reset        # ${t({ ko: "모든 규칙 초기화", en: "Reset all rules" })}`}
        </pre>
      </div>
    </div>
  );
}
