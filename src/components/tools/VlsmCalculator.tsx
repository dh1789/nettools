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

function ipToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

interface VlsmSubnet {
  name: string;
  requiredHosts: string;
}

interface VlsmResult {
  name: string;
  requiredHosts: number;
  allocatedHosts: number;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
}

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function calculateVlsm(baseNetwork: string, subnets: VlsmSubnet[]): VlsmResult[] | string {
  // Parse base network
  const match = baseNetwork.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
  if (!match) return "invalid_base";

  const baseIp = match[1];
  const basePrefix = parseInt(match[2], 10);
  if (basePrefix < 0 || basePrefix > 32) return "invalid_base";

  // Validate subnets
  const parsed = subnets.filter(s => s.name.trim()).map(s => ({
    name: s.name.trim(),
    requiredHosts: parseInt(s.requiredHosts, 10) || 0,
  })).filter(s => s.requiredHosts > 0);

  if (parsed.length === 0) return "no_subnets";

  // Sort by required hosts descending (VLSM best practice)
  const sorted = [...parsed].sort((a, b) => b.requiredHosts - a.requiredHosts);

  let currentIp = ipToInt(baseIp) & prefixToMask(basePrefix);
  const baseEnd = currentIp + (Math.pow(2, 32 - basePrefix) >>> 0) - 1;
  const results: VlsmResult[] = [];

  for (const subnet of sorted) {
    // Need requiredHosts + 2 (network + broadcast)
    const needed = subnet.requiredHosts + 2;
    const blockSize = nextPowerOf2(needed);
    const prefix = 32 - Math.log2(blockSize);

    if (prefix < 0 || prefix > 32) return "too_large";

    // Align to block size
    const mask = prefixToMask(prefix);
    const aligned = (currentIp + blockSize - 1) & mask;

    const networkInt = aligned;
    const broadcastInt = networkInt + blockSize - 1;

    if (broadcastInt > baseEnd) return "overflow";

    results.push({
      name: subnet.name,
      requiredHosts: subnet.requiredHosts,
      allocatedHosts: blockSize - 2,
      cidr: prefix,
      networkAddress: intToIp(networkInt),
      broadcastAddress: intToIp(broadcastInt),
      firstHost: intToIp(networkInt + 1),
      lastHost: intToIp(broadcastInt - 1),
      subnetMask: intToIp(prefixToMask(prefix)),
    });

    currentIp = broadcastInt + 1;
  }

  return results;
}

let rowId = 1;

export function VlsmCalculator() {
  const { locale, t } = useLocale();
  const [baseNetwork, setBaseNetwork] = useState("192.168.1.0/24");
  const [subnets, setSubnets] = useState<VlsmSubnet[]>([
    { name: "Sales", requiredHosts: "50" },
    { name: "Engineering", requiredHosts: "25" },
    { name: "Management", requiredHosts: "10" },
  ]);
  const [results, setResults] = useState<VlsmResult[] | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addRow = () => {
    rowId++;
    setSubnets(prev => [...prev, { name: "", requiredHosts: "" }]);
  };

  const removeRow = (idx: number) => {
    setSubnets(prev => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, field: keyof VlsmSubnet, value: string) => {
    setSubnets(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const calculate = useCallback(() => {
    setError("");
    const result = calculateVlsm(baseNetwork, subnets);
    if (typeof result === "string") {
      const msgs: Record<string, { ko: string; en: string }> = {
        invalid_base: { ko: "기본 네트워크 주소가 유효하지 않습니다. (예: 192.168.1.0/24)", en: "Invalid base network. (e.g., 192.168.1.0/24)" },
        no_subnets: { ko: "유효한 서브넷이 없습니다. 이름과 호스트 수를 입력해주세요.", en: "No valid subnets. Please enter names and host counts." },
        too_large: { ko: "호스트 수가 너무 큽니다.", en: "Host count too large." },
        overflow: { ko: "기본 네트워크 공간이 부족합니다. 더 큰 기본 네트워크 또는 더 적은 호스트를 사용하세요.", en: "Base network space insufficient. Use a larger base network or fewer hosts." },
      };
      setError(locale === "ko" ? msgs[result]?.ko : msgs[result]?.en);
      setResults(null);
    } else {
      setResults(result);
    }
  }, [baseNetwork, subnets, locale]);

  const handleCopy = () => {
    if (!results) return;
    const lines = results.map(r =>
      `${r.name}: ${r.networkAddress}/${r.cidr}  Mask:${r.subnetMask}  Hosts:${r.allocatedHosts}  Range:${r.firstHost}-${r.lastHost}`
    );
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--text-secondary, #6b7280)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {locale === "ko"
            ? "VLSM(Variable Length Subnet Masking)으로 네트워크를 효율적으로 분할합니다. 각 서브넷에 필요한 호스트 수를 입력하면 최적 할당을 계산합니다."
            : "Split a network efficiently using VLSM (Variable Length Subnet Masking). Enter the required host count per subnet to calculate the optimal allocation."}
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 0.875rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "기본 네트워크" : "Base Network"}
        </h3>
        <div>
          <label style={labelStyle}>{locale === "ko" ? "CIDR 표기법" : "CIDR Notation"}</label>
          <input
            type="text"
            value={baseNetwork}
            onChange={e => setBaseNetwork(e.target.value)}
            style={inputStyle}
            placeholder="192.168.1.0/24"
          />
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 0.875rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
          {locale === "ko" ? "서브넷 요구사항" : "Subnet Requirements"}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>{locale === "ko" ? "서브넷 이름" : "Subnet Name"}</span>
            <span style={{ ...labelStyle, marginBottom: 0 }}>{locale === "ko" ? "필요 호스트 수" : "Required Hosts"}</span>
            <span></span>
          </div>
          {subnets.map((subnet, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                value={subnet.name}
                onChange={e => updateRow(idx, "name", e.target.value)}
                style={inputStyle}
                placeholder={locale === "ko" ? "Sales" : "Sales"}
              />
              <input
                type="number"
                value={subnet.requiredHosts}
                onChange={e => updateRow(idx, "requiredHosts", e.target.value)}
                style={inputStyle}
                placeholder="50"
                min="1"
              />
              <button
                onClick={() => removeRow(idx)}
                disabled={subnets.length <= 1}
                style={{
                  padding: "0.5rem 0.625rem",
                  background: "transparent",
                  color: "var(--text-secondary, #6b7280)",
                  border: "1px solid var(--border, #d1d5db)",
                  borderRadius: "6px",
                  cursor: subnets.length <= 1 ? "not-allowed" : "pointer",
                  opacity: subnets.length <= 1 ? 0.4 : 1,
                  fontSize: "0.875rem",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button
            onClick={addRow}
            style={{
              padding: "0.375rem 0.875rem",
              fontSize: "0.8125rem",
              background: "var(--bg-secondary, #f3f4f6)",
              color: "var(--text-primary, #111)",
              border: "1px dashed var(--border, #d1d5db)",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + {locale === "ko" ? "서브넷 추가" : "Add Subnet"}
          </button>
          <button
            onClick={calculate}
            style={{
              padding: "0.375rem 1.25rem",
              fontSize: "0.875rem",
              background: "var(--accent, #3b82f6)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {locale === "ko" ? "계산" : "Calculate"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.875rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {results && results.length > 0 && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary, #111)" }}>
              {locale === "ko" ? "VLSM 할당 결과" : "VLSM Allocation Results"}
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
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary, #f3f4f6)" }}>
                  {[
                    locale === "ko" ? "이름" : "Name",
                    locale === "ko" ? "필요/할당 호스트" : "Req/Alloc Hosts",
                    locale === "ko" ? "네트워크" : "Network",
                    locale === "ko" ? "서브넷 마스크" : "Subnet Mask",
                    locale === "ko" ? "첫 호스트" : "First Host",
                    locale === "ko" ? "마지막 호스트" : "Last Host",
                    locale === "ko" ? "브로드캐스트" : "Broadcast",
                  ].map(h => (
                    <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 700, color: "var(--text-secondary, #6b7280)", whiteSpace: "nowrap", borderBottom: "2px solid var(--border, #d1d5db)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border, #d1d5db)" }}>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: "var(--accent, #3b82f6)" }}>{r.name}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace" }}>{r.requiredHosts} / {r.allocatedHosts}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace", fontWeight: 600 }}>{r.networkAddress}/{r.cidr}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace" }}>{r.subnetMask}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace" }}>{r.firstHost}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace" }}>{r.lastHost}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontFamily: "monospace" }}>{r.broadcastAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
            {locale === "ko"
              ? "* 서브넷은 필요 호스트 수 내림차순으로 자동 정렬되어 할당됩니다."
              : "* Subnets are automatically sorted by required hosts (descending) before allocation."}
          </p>
        </div>
      )}
    </div>
  );
}
