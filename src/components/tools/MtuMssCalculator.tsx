"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import {
  ENCAPSULATIONS,
  computeMtu,
  isBelowPractical,
} from "@/lib/mtu-mss";

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "120px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "0.375rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
};

const PRESETS: { id: string; label: { ko: string; en: string }; mtu: number; stack: string[] }[] = [
  { id: "wg-home", label: { ko: "가정 인터넷 + WireGuard", en: "Home + WireGuard" }, mtu: 1500, stack: ["wireguard"] },
  { id: "pppoe-wg", label: { ko: "PPPoE + WireGuard", en: "PPPoE + WireGuard" }, mtu: 1500, stack: ["pppoe", "wireguard"] },
  { id: "dc-vxlan", label: { ko: "DC 오버레이 (VXLAN)", en: "DC overlay (VXLAN)" }, mtu: 1500, stack: ["vxlan"] },
  { id: "ipsec", label: { ko: "사이트 간 IPsec", en: "Site-to-site IPsec" }, mtu: 1500, stack: ["ipsec-esp-tunnel"] },
];

export function MtuMssCalculator() {
  const { t, locale } = useLocale();
  const [linkMtu, setLinkMtu] = useState("1500");
  const [stack, setStack] = useState<string[]>(["wireguard"]);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    const mtu = parseInt(linkMtu, 10);
    if (Number.isNaN(mtu)) return null;
    return computeMtu(mtu, stack, locale);
  }, [linkMtu, stack, locale]);

  const toggle = (id: string) => {
    setStack((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const clampCmds = result && !result.error
    ? [
        {
          key: "iptables",
          label: "iptables (Linux)",
          cmd: `iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --set-mss ${result.mssV4}`,
        },
        {
          key: "interface",
          label: t({ ko: "인터페이스 MTU (Linux)", en: "Interface MTU (Linux)" }),
          cmd: `ip link set dev wg0 mtu ${result.effectiveMtu}`,
        },
        {
          key: "mikrotik",
          label: "MikroTik",
          cmd: `/ip firewall mangle add chain=forward protocol=tcp tcp-flags=syn action=change-mss new-mss=${result.mssV4} passthrough=yes tcp-mss=${result.mssV4 + 1}-65535`,
        },
      ]
    : [];

  return (
    <div>
      {/* 링크 MTU + 프리셋 */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
        <div>
          <label htmlFor="link-mtu" style={labelStyle}>
            {t({ ko: "링크 MTU", en: "Link MTU" })}
          </label>
          <input
            id="link-mtu"
            type="number"
            value={linkMtu}
            onChange={(e) => setLinkMtu(e.target.value)}
            style={inputStyle}
            min={68}
            max={65535}
            aria-label={t({ ko: "링크 MTU", en: "Link MTU" })}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setLinkMtu(String(p.mtu)); setStack(p.stack); }}
              style={secondaryButtonStyle}
            >
              {p.label[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* 캡슐화 스택 선택 */}
      <div style={{ marginBottom: "1rem" }}>
        <span style={labelStyle}>
          {t({ ko: "캡슐화 스택 (중첩 가능 — 선택 순서대로 차감)", en: "Encapsulation stack (stackable — subtracted in order)" })}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "0.375rem" }}>
          {ENCAPSULATIONS.map((e) => (
            <label
              key={e.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "var(--text-primary, #111)",
                cursor: "pointer",
                padding: "0.375rem 0.5rem",
                border: stack.includes(e.id) ? "1px solid var(--text-primary, #111)" : "1px solid var(--border, #e5e7eb)",
                borderRadius: "6px",
              }}
            >
              <input
                type="checkbox"
                checked={stack.includes(e.id)}
                onChange={() => toggle(e.id)}
                style={{ marginTop: "2px" }}
              />
              <span>
                {e.name[locale]}{" "}
                <code style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>−{e.overhead}B</code>
                {e.note && (
                  <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--text-tertiary, #9ca3af)" }}>
                    {e.note[locale]}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {result?.error && (
        <div role="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "#dc2626" }}>
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div>
          {/* 핵심 수치 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {[
              { label: t({ ko: "유효 MTU", en: "Effective MTU" }), value: result.effectiveMtu, main: true },
              { label: "TCP MSS (IPv4)", value: result.mssV4 },
              { label: "TCP MSS (IPv6)", value: result.mssV6 },
              { label: t({ ko: "총 오버헤드", en: "Total overhead" }), value: `${result.totalOverhead}B` },
            ].map((c, i) => (
              <div key={i} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: "8px", padding: "0.75rem", background: c.main ? "var(--result-bg, #f0fdf4)" : "var(--surface, #fff)" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-tertiary, #9ca3af)", marginBottom: "0.25rem" }}>{c.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "monospace", color: "var(--text-primary, #111)" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {result.hasVariable && (
            <p style={{ fontSize: "0.75rem", color: "#d97706", marginBottom: "0.75rem" }}>
              ⚠️ {t({
                ko: "가변 오버헤드 항목 포함 — worst-case 값으로 계산했습니다. 실제 오버헤드는 암호 스위트/옵션에 따라 이보다 작을 수 있습니다.",
                en: "Includes variable-overhead entries — calculated with worst-case values. Actual overhead may be smaller depending on cipher suite/options.",
              })}
            </p>
          )}
          {isBelowPractical(result.effectiveMtu) && (
            <p style={{ fontSize: "0.75rem", color: "#dc2626", marginBottom: "0.75rem" }}>
              {t({ ko: "유효 MTU가 576B 미만 — 실환경에서 문제 소지가 큽니다.", en: "Effective MTU below 576B — likely to cause real-world issues." })}
            </p>
          )}

          {/* 차감 브레이크다운 */}
          {result.breakdown.length > 0 && (
            <div style={{ marginBottom: "1rem", overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "320px" }}>
                <thead>
                  <tr>
                    {[t({ ko: "계층", en: "Layer" }), t({ ko: "오버헤드", en: "Overhead" }), t({ ko: "차감 후 MTU", en: "MTU after" })].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "0.375rem 0.75rem", borderBottom: "2px solid var(--border, #e5e7eb)", color: "var(--text-secondary, #6b7280)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.375rem 0.75rem", color: "var(--text-tertiary, #9ca3af)" }}>{t({ ko: "링크", en: "Link" })}</td>
                    <td style={{ padding: "0.375rem 0.75rem" }}>—</td>
                    <td style={{ padding: "0.375rem 0.75rem", fontFamily: "monospace" }}>{result.linkMtu}</td>
                  </tr>
                  {result.breakdown.map((b) => (
                    <tr key={b.id} style={{ borderTop: "1px solid var(--border, #f3f4f6)" }}>
                      <td style={{ padding: "0.375rem 0.75rem" }}>{b.name[locale]}{b.variable ? " ⚠️" : ""}</td>
                      <td style={{ padding: "0.375rem 0.75rem", fontFamily: "monospace" }}>−{b.overhead}B</td>
                      <td style={{ padding: "0.375rem 0.75rem", fontFamily: "monospace", fontWeight: 600 }}>{b.mtuAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 클램프 명령 */}
          <div>
            <span style={labelStyle}>{t({ ko: "바로 쓰는 설정 명령", en: "Ready-to-use commands" })}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {clampCmds.map((c) => (
                <div key={c.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary, #9ca3af)", minWidth: "140px" }}>{c.label}</span>
                  <code style={{ fontSize: "0.75rem", fontFamily: "monospace", background: "var(--input-bg, #f9fafb)", border: "1px solid var(--border, #e5e7eb)", borderRadius: "6px", padding: "0.375rem 0.5rem", flex: "1 1 300px", wordBreak: "break-all" }}>{c.cmd}</code>
                  <button
                    onClick={() => handleCopy(c.cmd, c.key)}
                    style={{ ...secondaryButtonStyle, background: copied === c.key ? "#10b981" : "transparent", color: copied === c.key ? "#fff" : "var(--text-secondary, #6b7280)" }}
                    aria-label={t({ ko: "명령 복사", en: "Copy command" })}
                  >
                    {copied === c.key ? t(T.copied) : t(T.copy)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
