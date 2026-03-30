"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

interface PortEntry {
  port: number;
  service: string;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  description: { ko: string; en: string };
}

const PORT_DATABASE: PortEntry[] = [
  { port: 20, service: "FTP-Data", protocol: "TCP", description: { ko: "FTP 데이터 전송", en: "FTP data transfer" } },
  { port: 21, service: "FTP", protocol: "TCP", description: { ko: "FTP 제어 연결", en: "FTP control connection" } },
  { port: 22, service: "SSH", protocol: "TCP", description: { ko: "보안 셸 접속", en: "Secure Shell" } },
  { port: 23, service: "Telnet", protocol: "TCP", description: { ko: "텔넷 원격 접속", en: "Telnet remote login" } },
  { port: 25, service: "SMTP", protocol: "TCP", description: { ko: "메일 전송 프로토콜", en: "Simple Mail Transfer Protocol" } },
  { port: 53, service: "DNS", protocol: "TCP/UDP", description: { ko: "도메인 이름 시스템", en: "Domain Name System" } },
  { port: 67, service: "DHCP Server", protocol: "UDP", description: { ko: "DHCP 서버", en: "DHCP server" } },
  { port: 68, service: "DHCP Client", protocol: "UDP", description: { ko: "DHCP 클라이언트", en: "DHCP client" } },
  { port: 69, service: "TFTP", protocol: "UDP", description: { ko: "간이 파일 전송 프로토콜", en: "Trivial File Transfer Protocol" } },
  { port: 80, service: "HTTP", protocol: "TCP", description: { ko: "웹 서버 (비암호화)", en: "Hypertext Transfer Protocol" } },
  { port: 110, service: "POP3", protocol: "TCP", description: { ko: "메일 수신 프로토콜", en: "Post Office Protocol v3" } },
  { port: 119, service: "NNTP", protocol: "TCP", description: { ko: "뉴스 그룹 전송 프로토콜", en: "Network News Transfer Protocol" } },
  { port: 123, service: "NTP", protocol: "UDP", description: { ko: "네트워크 시간 프로토콜", en: "Network Time Protocol" } },
  { port: 135, service: "MS-RPC", protocol: "TCP", description: { ko: "마이크로소프트 RPC", en: "Microsoft Remote Procedure Call" } },
  { port: 137, service: "NetBIOS-NS", protocol: "TCP/UDP", description: { ko: "NetBIOS 이름 서비스", en: "NetBIOS Name Service" } },
  { port: 138, service: "NetBIOS-DGM", protocol: "UDP", description: { ko: "NetBIOS 데이터그램 서비스", en: "NetBIOS Datagram Service" } },
  { port: 139, service: "NetBIOS-SSN", protocol: "TCP", description: { ko: "NetBIOS 세션 서비스", en: "NetBIOS Session Service" } },
  { port: 143, service: "IMAP", protocol: "TCP", description: { ko: "인터넷 메시지 접근 프로토콜", en: "Internet Message Access Protocol" } },
  { port: 161, service: "SNMP", protocol: "UDP", description: { ko: "네트워크 관리 프로토콜", en: "Simple Network Management Protocol" } },
  { port: 162, service: "SNMP Trap", protocol: "UDP", description: { ko: "SNMP 트랩 알림", en: "SNMP Trap notifications" } },
  { port: 179, service: "BGP", protocol: "TCP", description: { ko: "경계 게이트웨이 프로토콜", en: "Border Gateway Protocol" } },
  { port: 389, service: "LDAP", protocol: "TCP/UDP", description: { ko: "경량 디렉터리 접근 프로토콜", en: "Lightweight Directory Access Protocol" } },
  { port: 443, service: "HTTPS", protocol: "TCP", description: { ko: "보안 웹 서버 (SSL/TLS)", en: "HTTP over TLS/SSL" } },
  { port: 445, service: "SMB", protocol: "TCP", description: { ko: "서버 메시지 블록 (파일 공유)", en: "Server Message Block (file sharing)" } },
  { port: 465, service: "SMTPS", protocol: "TCP", description: { ko: "보안 SMTP (SSL)", en: "SMTP over SSL" } },
  { port: 514, service: "Syslog", protocol: "UDP", description: { ko: "시스템 로그 전송", en: "System logging" } },
  { port: 515, service: "LPD", protocol: "TCP", description: { ko: "라인 프린터 데몬", en: "Line Printer Daemon" } },
  { port: 587, service: "SMTP Submission", protocol: "TCP", description: { ko: "메일 발송 (인증)", en: "SMTP message submission" } },
  { port: 636, service: "LDAPS", protocol: "TCP", description: { ko: "보안 LDAP (SSL/TLS)", en: "LDAP over TLS/SSL" } },
  { port: 993, service: "IMAPS", protocol: "TCP", description: { ko: "보안 IMAP (SSL/TLS)", en: "IMAP over TLS/SSL" } },
  { port: 995, service: "POP3S", protocol: "TCP", description: { ko: "보안 POP3 (SSL/TLS)", en: "POP3 over TLS/SSL" } },
  { port: 1080, service: "SOCKS", protocol: "TCP", description: { ko: "SOCKS 프록시", en: "SOCKS proxy" } },
  { port: 1433, service: "MSSQL", protocol: "TCP", description: { ko: "Microsoft SQL Server", en: "Microsoft SQL Server" } },
  { port: 1434, service: "MSSQL Browser", protocol: "UDP", description: { ko: "MSSQL 브라우저 서비스", en: "MSSQL Browser Service" } },
  { port: 1521, service: "Oracle", protocol: "TCP", description: { ko: "Oracle 데이터베이스", en: "Oracle Database" } },
  { port: 1723, service: "PPTP", protocol: "TCP", description: { ko: "지점 간 터널링 프로토콜", en: "Point-to-Point Tunneling Protocol" } },
  { port: 2049, service: "NFS", protocol: "TCP/UDP", description: { ko: "네트워크 파일 시스템", en: "Network File System" } },
  { port: 2181, service: "Zookeeper", protocol: "TCP", description: { ko: "Apache Zookeeper 클라이언트", en: "Apache Zookeeper client" } },
  { port: 2379, service: "etcd Client", protocol: "TCP", description: { ko: "etcd 클라이언트 통신", en: "etcd client communication" } },
  { port: 2380, service: "etcd Peer", protocol: "TCP", description: { ko: "etcd 피어 통신", en: "etcd peer communication" } },
  { port: 3306, service: "MySQL", protocol: "TCP", description: { ko: "MySQL 데이터베이스", en: "MySQL Database" } },
  { port: 3389, service: "RDP", protocol: "TCP/UDP", description: { ko: "원격 데스크톱 프로토콜", en: "Remote Desktop Protocol" } },
  { port: 4369, service: "Erlang Port", protocol: "TCP", description: { ko: "Erlang 포트 매퍼 데몬", en: "Erlang Port Mapper Daemon" } },
  { port: 5060, service: "SIP", protocol: "TCP/UDP", description: { ko: "세션 개시 프로토콜", en: "Session Initiation Protocol" } },
  { port: 5061, service: "SIPS", protocol: "TCP", description: { ko: "보안 SIP (TLS)", en: "SIP over TLS" } },
  { port: 5432, service: "PostgreSQL", protocol: "TCP", description: { ko: "PostgreSQL 데이터베이스", en: "PostgreSQL Database" } },
  { port: 5672, service: "RabbitMQ", protocol: "TCP", description: { ko: "RabbitMQ AMQP 메시지 브로커", en: "RabbitMQ AMQP message broker" } },
  { port: 5900, service: "VNC", protocol: "TCP", description: { ko: "원격 데스크톱 (VNC)", en: "Virtual Network Computing" } },
  { port: 6379, service: "Redis", protocol: "TCP", description: { ko: "Redis 인메모리 데이터 저장소", en: "Redis in-memory data store" } },
  { port: 6443, service: "Kubernetes API", protocol: "TCP", description: { ko: "Kubernetes API 서버", en: "Kubernetes API Server" } },
  { port: 8080, service: "HTTP-Alt", protocol: "TCP", description: { ko: "대체 HTTP 포트", en: "HTTP alternate" } },
  { port: 8443, service: "HTTPS-Alt", protocol: "TCP", description: { ko: "대체 HTTPS 포트", en: "HTTPS alternate" } },
  { port: 8888, service: "HTTP-Alt-2", protocol: "TCP", description: { ko: "대체 HTTP 포트 2", en: "HTTP alternate 2" } },
  { port: 9090, service: "Prometheus", protocol: "TCP", description: { ko: "Prometheus 모니터링", en: "Prometheus monitoring" } },
  { port: 9092, service: "Kafka", protocol: "TCP", description: { ko: "Apache Kafka 브로커", en: "Apache Kafka broker" } },
  { port: 9200, service: "Elasticsearch", protocol: "TCP", description: { ko: "Elasticsearch REST API", en: "Elasticsearch REST API" } },
  { port: 11211, service: "Memcached", protocol: "TCP/UDP", description: { ko: "Memcached 캐시 서버", en: "Memcached cache server" } },
  { port: 15672, service: "RabbitMQ Mgmt", protocol: "TCP", description: { ko: "RabbitMQ 관리 콘솔", en: "RabbitMQ Management Console" } },
  { port: 27017, service: "MongoDB", protocol: "TCP", description: { ko: "MongoDB 데이터베이스", en: "MongoDB Database" } },
  { port: 50000, service: "Jenkins", protocol: "TCP", description: { ko: "Jenkins 에이전트 통신", en: "Jenkins agent communication" } },
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

const thStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  textAlign: "left",
  borderBottom: "2px solid var(--border, #d1d5db)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.8125rem",
  color: "var(--text-primary, #111)",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
  verticalAlign: "top",
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        style={{
          background: "var(--warning-bg, #fef3c7)",
          color: "var(--text-primary, #111)",
          borderRadius: "2px",
          padding: "0 1px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function PortDictionary() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? PORT_DATABASE.filter((entry) => {
        const portStr = String(entry.port);
        const service = entry.service.toLowerCase();
        const protocol = entry.protocol.toLowerCase();
        const descKo = entry.description.ko.toLowerCase();
        const descEn = entry.description.en.toLowerCase();
        return (
          portStr.includes(query) ||
          service.includes(query) ||
          protocol.includes(query) ||
          descKo.includes(query) ||
          descEn.includes(query)
        );
      })
    : PORT_DATABASE;

  const copyResults = () => {
    const lines = filtered.map(
      (entry) =>
        `${entry.port}\t${entry.service}\t${entry.protocol}\t${t(entry.description)}`
    );
    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>
          {t({ ko: "포트 번호 또는 서비스 이름 검색", en: "Search by port number or service name" })}
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t({ ko: "예: 443, https, ssh", en: "e.g. 443, https, ssh" })}
          style={inputStyle}
        />
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.375rem",
          }}
        >
          {t({
            ko: "포트 번호, 서비스명, 프로토콜, 설명으로 검색할 수 있습니다",
            en: "Search by port number, service name, protocol, or description",
          })}
        </p>
      </div>

      {/* Results Header */}
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
          {t({ ko: "검색 결과", en: "Results" })}
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 400,
              color: "var(--text-secondary, #6b7280)",
              marginLeft: "0.5rem",
            }}
          >
            ({filtered.length}{t({ ko: "개", en: " items" })})
          </span>
        </h2>
        <button
          onClick={copyResults}
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
          {copied
            ? t({ ko: "복사됨!", en: "Copied!" })
            : t({ ko: "결과 복사", en: "Copy Results" })}
        </button>
      </div>

      {/* Results Table */}
      {filtered.length > 0 ? (
        <div
          style={{
            background: "var(--result-bg, #f0fdf4)",
            borderRadius: "8px",
            padding: "0.5rem",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>{t({ ko: "포트", en: "Port" })}</th>
                <th style={thStyle}>{t({ ko: "서비스", en: "Service" })}</th>
                <th style={thStyle}>{t({ ko: "프로토콜", en: "Protocol" })}</th>
                <th style={thStyle}>{t({ ko: "설명", en: "Description" })}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={`${entry.port}-${entry.service}`}>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 600 }}>
                    {highlightMatch(String(entry.port), search)}
                  </td>
                  <td style={tdStyle}>
                    {highlightMatch(entry.service, search)}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {highlightMatch(entry.protocol, search)}
                  </td>
                  <td style={tdStyle}>
                    {highlightMatch(t(entry.description), search)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            background: "var(--info-bg, #eff6ff)",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-secondary, #6b7280)",
            fontSize: "0.875rem",
          }}
        >
          {t({
            ko: "검색 결과가 없습니다. 다른 키워드로 검색해 보세요.",
            en: "No results found. Try a different search term.",
          })}
        </div>
      )}
    </div>
  );
}
