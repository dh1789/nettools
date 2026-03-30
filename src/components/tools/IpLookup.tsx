"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

interface PrivateRange {
  start: number;
  end: number;
  cidr: string;
  rfc: string;
  description: { ko: string; en: string };
}

const PRIVATE_RANGES: PrivateRange[] = [
  {
    start: ipToInt("10.0.0.0"),
    end: ipToInt("10.255.255.255"),
    cidr: "10.0.0.0/8",
    rfc: "RFC 1918",
    description: {
      ko: "대규모 사설 네트워크 (Class A)",
      en: "Large private network (Class A)",
    },
  },
  {
    start: ipToInt("172.16.0.0"),
    end: ipToInt("172.31.255.255"),
    cidr: "172.16.0.0/12",
    rfc: "RFC 1918",
    description: {
      ko: "중규모 사설 네트워크 (Class B)",
      en: "Medium private network (Class B)",
    },
  },
  {
    start: ipToInt("192.168.0.0"),
    end: ipToInt("192.168.255.255"),
    cidr: "192.168.0.0/16",
    rfc: "RFC 1918",
    description: {
      ko: "소규모 사설 네트워크 (Class C)",
      en: "Small private network (Class C)",
    },
  },
  {
    start: ipToInt("127.0.0.0"),
    end: ipToInt("127.255.255.255"),
    cidr: "127.0.0.0/8",
    rfc: "RFC 1122",
    description: { ko: "루프백 주소", en: "Loopback address" },
  },
  {
    start: ipToInt("169.254.0.0"),
    end: ipToInt("169.254.255.255"),
    cidr: "169.254.0.0/16",
    rfc: "RFC 3927",
    description: { ko: "링크-로컬 주소", en: "Link-local address" },
  },
  {
    start: ipToInt("100.64.0.0"),
    end: ipToInt("100.127.255.255"),
    cidr: "100.64.0.0/10",
    rfc: "RFC 6598",
    description: {
      ko: "CGNAT (Carrier-Grade NAT) 주소",
      en: "CGNAT (Carrier-Grade NAT) address",
    },
  },
  {
    start: ipToInt("0.0.0.0"),
    end: ipToInt("0.255.255.255"),
    cidr: "0.0.0.0/8",
    rfc: "RFC 1122",
    description: {
      ko: "현재 네트워크 (소스 전용)",
      en: "Current network (source only)",
    },
  },
  {
    start: ipToInt("224.0.0.0"),
    end: ipToInt("239.255.255.255"),
    cidr: "224.0.0.0/4",
    rfc: "RFC 5771",
    description: { ko: "멀티캐스트 주소", en: "Multicast address" },
  },
  {
    start: ipToInt("240.0.0.0"),
    end: ipToInt("255.255.255.254"),
    cidr: "240.0.0.0/4",
    rfc: "RFC 1112",
    description: { ko: "예약된 주소 (미래 사용)", en: "Reserved (future use)" },
  },
  {
    start: ipToInt("255.255.255.255"),
    end: ipToInt("255.255.255.255"),
    cidr: "255.255.255.255/32",
    rfc: "RFC 919",
    description: {
      ko: "한정 브로드캐스트 주소",
      en: "Limited broadcast address",
    },
  },
];

interface IpInfo {
  ip: string;
  success: boolean;
  country: string;
  country_code: string;
  region: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: { id: string };
  connection: { isp: string; org: string; asn: number; domain: string };
}

function ipToInt(ip: string): number {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

function parseIp(input: string): string | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return null;
  for (let i = 1; i <= 4; i++) {
    const n = parseInt(match[i], 10);
    if (n < 0 || n > 255 || match[i] !== String(n)) return null;
  }
  return trimmed;
}

function getPrivateRange(ip: string): PrivateRange | null {
  const ipInt = ipToInt(ip);
  for (const range of PRIVATE_RANGES) {
    if (ipInt >= range.start && ipInt <= range.end) return range;
  }
  return null;
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

const secondaryButtonStyle: React.CSSProperties = {
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--text-secondary, #6b7280)",
  cursor: "pointer",
};

type LookupState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "private"; ip: string; range: PrivateRange }
  | { type: "public"; ip: string; info: IpInfo }
  | { type: "error"; message: string };

export function IpLookup() {
  const { t, locale } = useLocale();
  const [input, setInput] = useState("");
  const [state, setState] = useState<LookupState>({ type: "idle" });
  const [copied, setCopied] = useState(false);
  const [myIpLoading, setMyIpLoading] = useState(false);

  const lookup = useCallback(
    async (ipInput: string) => {
      const ip = parseIp(ipInput);
      if (!ip) {
        setState({
          type: "error",
          message: t(T.ipLookupInvalidIp),
        });
        return;
      }

      const privateRange = getPrivateRange(ip);
      if (privateRange) {
        setState({ type: "private", ip, range: privateRange });
        return;
      }

      setState({ type: "loading" });
      try {
        const res = await fetch(`https://ipwho.is/${ip}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: IpInfo = await res.json();
        if (!data.success) {
          throw new Error("Lookup failed");
        }
        setState({ type: "public", ip, info: data });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setState({
          type: "error",
          message: `${t(T.ipLookupFetchError)} (${msg})`,
        });
      }
    },
    [t]
  );

  const handleLookup = () => lookup(input);

  const handleMyIp = async () => {
    setMyIpLoading(true);
    setState({ type: "loading" });
    try {
      const res = await fetch("https://ipwho.is/");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: IpInfo = await res.json();
      if (!data.success) throw new Error("Lookup failed");
      setInput(data.ip);
      setState({ type: "public", ip: data.ip, info: data });
    } catch {
      setState({ type: "error", message: t(T.ipLookupMyIpError) });
    } finally {
      setMyIpLoading(false);
    }
  };

  const copyAll = () => {
    if (state.type !== "public" && state.type !== "private") return;
    let text = "";
    if (state.type === "private") {
      text = [
        `IP: ${state.ip}`,
        `Type: Private`,
        `Range: ${state.range.cidr}`,
        `RFC: ${state.range.rfc}`,
        `Description: ${state.range.description.en}`,
      ].join("\n");
    } else {
      const info = state.info;
      text = [
        `IP: ${info.ip}`,
        `Type: Public`,
        `Country: ${info.country} (${info.country_code})`,
        `Region: ${info.region}`,
        `City: ${info.city}`,
        `ZIP: ${info.postal}`,
        `Timezone: ${info.timezone.id}`,
        `ISP: ${info.connection.isp}`,
        `Org: ${info.connection.org}`,
        `AS: AS${info.connection.asn}`,
        `Location: ${info.latitude}, ${info.longitude}`,
      ].join("\n");
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t(T.ipLookupLabel)}</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="8.8.8.8"
            style={{
              ...inputStyle,
              borderColor:
                state.type === "error"
                  ? "#ef4444"
                  : "var(--border, #d1d5db)",
              flex: 1,
            }}
          />
          <button onClick={handleLookup} style={buttonStyle}>
            {t(T.ipLookupBtn)}
          </button>
          <button
            onClick={handleMyIp}
            disabled={myIpLoading}
            style={{
              ...secondaryButtonStyle,
              opacity: myIpLoading ? 0.6 : 1,
            }}
          >
            {myIpLoading ? t(T.ipLookupDetecting) : t(T.ipLookupMyIp)}
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t(T.ipLookupHint)}
        </p>
        {state.type === "error" && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              marginTop: "0.25rem",
            }}
          >
            {state.message}
          </p>
        )}
      </div>

      {/* Loading */}
      {state.type === "loading" && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-secondary, #6b7280)",
          }}
        >
          {t(T.ipLookupLoading)}
        </div>
      )}

      {/* Private IP Result */}
      {state.type === "private" && (
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
              {t(T.results)}
            </h2>
            <button
              onClick={copyAll}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: copied ? "#10b981" : "transparent",
                color: copied
                  ? "#fff"
                  : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? t(T.copied) : t(T.copyAll)}
            </button>
          </div>

          {/* Type badge */}
          <div
            style={{
              background: "#fef3c7",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "#f59e0b",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              {t(T.ipLookupPrivate)}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontFamily: "monospace",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
              }}
            >
              {state.ip}
            </div>
          </div>

          {/* Private details */}
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupRange)}</span>
              <span style={resultValueStyle}>{state.range.cidr}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupRfc)}</span>
              <span style={resultValueStyle}>{state.range.rfc}</span>
            </div>
            <div style={{ ...resultRowStyle, borderBottom: "none" }}>
              <span style={resultLabelStyle}>
                {t(T.ipLookupDescription)}
              </span>
              <span style={resultValueStyle}>
                {state.range.description[locale]}
              </span>
            </div>
          </div>

          {/* Private IP notice */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              color: "var(--text-secondary, #6b7280)",
              lineHeight: 1.6,
            }}
          >
            {t(T.ipLookupPrivateNotice)}
          </div>
        </div>
      )}

      {/* Public IP Result */}
      {state.type === "public" && (
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
              {t(T.results)}
            </h2>
            <button
              onClick={copyAll}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                border: "1px solid var(--border, #d1d5db)",
                borderRadius: "6px",
                background: copied ? "#10b981" : "transparent",
                color: copied
                  ? "#fff"
                  : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? t(T.copied) : t(T.copyAll)}
            </button>
          </div>

          {/* Type badge */}
          <div
            style={{
              background: "#dbeafe",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "#3b82f6",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              {t(T.ipLookupPublic)}
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontFamily: "monospace",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
              }}
            >
              {state.info.ip}
            </div>
          </div>

          {/* Registration info */}
          <div
            style={{
              background: "var(--result-bg, #f0fdf4)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupCountry)}</span>
              <span style={resultValueStyle}>
                {state.info.country} ({state.info.country_code})
              </span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupRegion)}</span>
              <span style={resultValueStyle}>
                {state.info.region}
              </span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupCity)}</span>
              <span style={resultValueStyle}>{state.info.city}</span>
            </div>
            {state.info.postal && (
              <div style={resultRowStyle}>
                <span style={resultLabelStyle}>{t(T.ipLookupZip)}</span>
                <span style={resultValueStyle}>{state.info.postal}</span>
              </div>
            )}
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>
                {t(T.ipLookupTimezone)}
              </span>
              <span style={resultValueStyle}>
                {state.info.timezone.id}
              </span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupIsp)}</span>
              <span style={resultValueStyle}>{state.info.connection.isp}</span>
            </div>
            <div style={resultRowStyle}>
              <span style={resultLabelStyle}>{t(T.ipLookupOrg)}</span>
              <span style={resultValueStyle}>{state.info.connection.org}</span>
            </div>
            <div style={{ ...resultRowStyle, borderBottom: "none" }}>
              <span style={resultLabelStyle}>{t(T.ipLookupAs)}</span>
              <span style={resultValueStyle}>AS{state.info.connection.asn}</span>
            </div>
          </div>

          {/* Location */}
          <details>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "0.8125rem",
                color: "var(--text-secondary, #6b7280)",
                userSelect: "none",
              }}
            >
              {t(T.ipLookupCoordinates)}
            </summary>
            <div
              style={{
                marginTop: "0.5rem",
                fontFamily: "monospace",
                fontSize: "0.8125rem",
                color: "var(--text-primary, #111)",
              }}
            >
              {state.info.latitude}, {state.info.longitude}
            </div>
          </details>

          {/* API notice */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "8px",
              fontSize: "0.75rem",
              color: "var(--text-tertiary, #9ca3af)",
              lineHeight: 1.5,
            }}
          >
            {t(T.ipLookupApiNotice)}
          </div>
        </div>
      )}
    </div>
  );
}
