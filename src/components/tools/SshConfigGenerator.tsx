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

interface SshHost {
  id: string;
  alias: string;
  hostname: string;
  user: string;
  port: string;
  identityFile: string;
  serverAliveInterval: string;
  serverAliveCountMax: string;
  forwardAgent: boolean;
  compression: boolean;
  strictHostKeyChecking: string;
  proxyJump: string;
  localForward: string;
  remoteForward: string;
  addKeysToAgent: boolean;
  extraOptions: string;
}

function createEmptyHost(id: string): SshHost {
  return {
    id,
    alias: "",
    hostname: "",
    user: "",
    port: "",
    identityFile: "",
    serverAliveInterval: "",
    serverAliveCountMax: "",
    forwardAgent: false,
    compression: false,
    strictHostKeyChecking: "",
    proxyJump: "",
    localForward: "",
    remoteForward: "",
    addKeysToAgent: false,
    extraOptions: "",
  };
}

function generateHostBlock(host: SshHost): string {
  if (!host.alias.trim()) return "";
  const lines: string[] = [`Host ${host.alias.trim()}`];
  if (host.hostname.trim()) lines.push(`  HostName ${host.hostname.trim()}`);
  if (host.user.trim()) lines.push(`  User ${host.user.trim()}`);
  if (host.port.trim()) lines.push(`  Port ${host.port.trim()}`);
  if (host.identityFile.trim()) lines.push(`  IdentityFile ${host.identityFile.trim()}`);
  if (host.addKeysToAgent) lines.push(`  AddKeysToAgent yes`);
  if (host.forwardAgent) lines.push(`  ForwardAgent yes`);
  if (host.compression) lines.push(`  Compression yes`);
  if (host.serverAliveInterval.trim()) lines.push(`  ServerAliveInterval ${host.serverAliveInterval.trim()}`);
  if (host.serverAliveCountMax.trim()) lines.push(`  ServerAliveCountMax ${host.serverAliveCountMax.trim()}`);
  if (host.strictHostKeyChecking.trim() && host.strictHostKeyChecking !== "") {
    lines.push(`  StrictHostKeyChecking ${host.strictHostKeyChecking}`);
  }
  if (host.proxyJump.trim()) lines.push(`  ProxyJump ${host.proxyJump.trim()}`);
  if (host.localForward.trim()) lines.push(`  LocalForward ${host.localForward.trim()}`);
  if (host.remoteForward.trim()) lines.push(`  RemoteForward ${host.remoteForward.trim()}`);
  if (host.extraOptions.trim()) {
    for (const line of host.extraOptions.split("\n")) {
      const trimmed = line.trim();
      if (trimmed) lines.push(`  ${trimmed}`);
    }
  }
  return lines.join("\n");
}

let idCounter = 1;

export function SshConfigGenerator() {
  const { locale, t } = useLocale();
  const [hosts, setHosts] = useState<SshHost[]>([createEmptyHost("1")]);
  const [copied, setCopied] = useState(false);

  const addHost = () => {
    idCounter++;
    setHosts(prev => [...prev, createEmptyHost(String(idCounter))]);
  };

  const removeHost = (id: string) => {
    setHosts(prev => prev.filter(h => h.id !== id));
  };

  const updateHost = (id: string, field: keyof SshHost, value: string | boolean) => {
    setHosts(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const config = useCallback(() => {
    const blocks = hosts.map(generateHostBlock).filter(Boolean);
    return blocks.join("\n\n");
  }, [hosts]);

  const handleCopy = () => {
    navigator.clipboard.writeText(config());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const output = config();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--text-secondary, #6b7280)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {locale === "ko"
            ? "~/.ssh/config 파일을 시각적으로 편집합니다. 각 호스트 블록을 설정하고 생성된 config를 복사하세요."
            : "Visually edit your ~/.ssh/config file. Configure host blocks and copy the generated config."}
        </p>
      </div>

      {hosts.map((host, idx) => (
        <div key={host.id} style={{ ...cardStyle, borderLeft: "3px solid var(--accent, #3b82f6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
              {locale === "ko" ? `호스트 블록 ${idx + 1}` : `Host Block ${idx + 1}`}
              {host.alias && <span style={{ color: "var(--accent, #3b82f6)", marginLeft: "0.5rem" }}>({host.alias})</span>}
            </h3>
            {hosts.length > 1 && (
              <button
                onClick={() => removeHost(host.id)}
                style={{
                  padding: "0.25rem 0.625rem",
                  fontSize: "0.75rem",
                  background: "transparent",
                  color: "var(--text-secondary, #6b7280)",
                  border: "1px solid var(--border, #d1d5db)",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {locale === "ko" ? "삭제" : "Remove"}
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Host (alias) *</label>
              <input
                type="text"
                value={host.alias}
                onChange={e => updateHost(host.id, "alias", e.target.value)}
                style={inputStyle}
                placeholder="myserver"
              />
            </div>
            <div>
              <label style={labelStyle}>HostName</label>
              <input
                type="text"
                value={host.hostname}
                onChange={e => updateHost(host.id, "hostname", e.target.value)}
                style={inputStyle}
                placeholder="192.168.1.100 or example.com"
              />
            </div>
            <div>
              <label style={labelStyle}>User</label>
              <input
                type="text"
                value={host.user}
                onChange={e => updateHost(host.id, "user", e.target.value)}
                style={inputStyle}
                placeholder="ubuntu"
              />
            </div>
            <div>
              <label style={labelStyle}>Port</label>
              <input
                type="text"
                value={host.port}
                onChange={e => updateHost(host.id, "port", e.target.value)}
                style={inputStyle}
                placeholder="22"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>IdentityFile</label>
              <input
                type="text"
                value={host.identityFile}
                onChange={e => updateHost(host.id, "identityFile", e.target.value)}
                style={inputStyle}
                placeholder="~/.ssh/id_rsa"
              />
            </div>
            <div>
              <label style={labelStyle}>ServerAliveInterval</label>
              <input
                type="text"
                value={host.serverAliveInterval}
                onChange={e => updateHost(host.id, "serverAliveInterval", e.target.value)}
                style={inputStyle}
                placeholder="60"
              />
            </div>
            <div>
              <label style={labelStyle}>ServerAliveCountMax</label>
              <input
                type="text"
                value={host.serverAliveCountMax}
                onChange={e => updateHost(host.id, "serverAliveCountMax", e.target.value)}
                style={inputStyle}
                placeholder="3"
              />
            </div>
            <div>
              <label style={labelStyle}>ProxyJump</label>
              <input
                type="text"
                value={host.proxyJump}
                onChange={e => updateHost(host.id, "proxyJump", e.target.value)}
                style={inputStyle}
                placeholder="bastion"
              />
            </div>
            <div>
              <label style={labelStyle}>StrictHostKeyChecking</label>
              <select
                value={host.strictHostKeyChecking}
                onChange={e => updateHost(host.id, "strictHostKeyChecking", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">{locale === "ko" ? "(기본값)" : "(default)"}</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
                <option value="accept-new">accept-new</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>LocalForward</label>
              <input
                type="text"
                value={host.localForward}
                onChange={e => updateHost(host.id, "localForward", e.target.value)}
                style={inputStyle}
                placeholder="8080 localhost:80"
              />
            </div>
            <div>
              <label style={labelStyle}>RemoteForward</label>
              <input
                type="text"
                value={host.remoteForward}
                onChange={e => updateHost(host.id, "remoteForward", e.target.value)}
                style={inputStyle}
                placeholder="9090 localhost:9090"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.875rem" }}>
            {[
              { field: "forwardAgent" as const, label: "ForwardAgent yes" },
              { field: "compression" as const, label: "Compression yes" },
              { field: "addKeysToAgent" as const, label: "AddKeysToAgent yes" },
            ].map(({ field, label }) => (
              <label key={field} style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: "pointer", fontSize: "0.8125rem", color: "var(--text-primary, #111)" }}>
                <input
                  type="checkbox"
                  checked={host[field] as boolean}
                  onChange={e => updateHost(host.id, field, e.target.checked)}
                  style={{ accentColor: "var(--accent, #3b82f6)" }}
                />
                {label}
              </label>
            ))}
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <label style={labelStyle}>{locale === "ko" ? "추가 옵션 (한 줄에 하나씩)" : "Extra options (one per line)"}</label>
            <textarea
              value={host.extraOptions}
              onChange={e => updateHost(host.id, "extraOptions", e.target.value)}
              style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
              placeholder="ControlMaster auto&#10;ControlPath ~/.ssh/cm/%r@%h:%p"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addHost}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          background: "var(--bg-secondary, #f3f4f6)",
          color: "var(--text-primary, #111)",
          border: "1px dashed var(--border, #d1d5db)",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          width: "100%",
          marginBottom: "1rem",
        }}
      >
        + {locale === "ko" ? "호스트 블록 추가" : "Add Host Block"}
      </button>

      {output && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
              ~/.ssh/config
            </h3>
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
              {copied ? t(T.copied) : t(T.copy)}
            </button>
          </div>
          <pre
            style={{
              background: "var(--code-bg, #1e293b)",
              color: "#e2e8f0",
              borderRadius: "8px",
              padding: "1rem",
              fontFamily: "monospace",
              fontSize: "0.8125rem",
              lineHeight: 1.7,
              margin: 0,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
