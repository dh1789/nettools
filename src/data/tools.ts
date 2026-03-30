/**
 * Tool Registry
 * ─────────────
 * 새 도구 추가 방법:
 * 1. src/components/tools/ 에 React 컴포넌트 생성
 * 2. 아래 TOOLS 배열에 항목 추가
 * 3. src/components/tools/index.ts 에 export 추가
 * 4. git push → 자동 빌드/배포
 *
 * 또는: npm run new-tool 스크립트 사용 (자동 생성)
 */

export interface Tool {
  slug: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  category: ToolCategory;
  keywords: string[];
  /** Component name in src/components/tools/index.ts */
  component: string;
  /** For structured data (schema.org) */
  datePublished?: string;
  dateModified?: string;
}

export type ToolCategory =
  | "network"
  | "security"
  | "linux"
  | "developer"
  | "general";

export interface Category {
  id: ToolCategory;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "network",
    title: { ko: "네트워크", en: "Network" },
    description: {
      ko: "IP, 서브넷, MAC 주소 등 네트워크 관련 도구",
      en: "IP, subnet, MAC address and other network tools",
    },
    icon: "🌐",
  },
  {
    id: "security",
    title: { ko: "보안", en: "Security" },
    description: {
      ko: "SSL, 암호화, 비밀번호 등 보안 관련 도구",
      en: "SSL, encryption, password and other security tools",
    },
    icon: "🔒",
  },
  {
    id: "linux",
    title: { ko: "리눅스", en: "Linux" },
    description: {
      ko: "Cron, chmod, systemd 등 리눅스 관련 도구",
      en: "Cron, chmod, systemd and other Linux tools",
    },
    icon: "🐧",
  },
  {
    id: "developer",
    title: { ko: "개발자", en: "Developer" },
    description: {
      ko: "JSON, Base64, 정규식 등 개발자 유틸리티",
      en: "JSON, Base64, regex and other developer utilities",
    },
    icon: "💻",
  },
  {
    id: "general",
    title: { ko: "일반", en: "General" },
    description: {
      ko: "QR코드, 비밀번호 생성기 등 범용 도구",
      en: "QR code, password generator and other general tools",
    },
    icon: "🔧",
  },
];

export const TOOLS: Tool[] = [
  {
    slug: "subnet-calculator",
    title: {
      ko: "서브넷 계산기",
      en: "Subnet Calculator",
    },
    description: {
      ko: "IP 주소와 서브넷 마스크로 네트워크 주소, 브로드캐스트, 호스트 범위를 계산합니다.",
      en: "Calculate network address, broadcast, and host range from IP address and subnet mask.",
    },
    category: "network",
    keywords: [
      "subnet",
      "cidr",
      "ip",
      "network",
      "mask",
      "서브넷",
      "아이피",
    ],
    component: "SubnetCalculator",
    datePublished: "2026-03-22",
  },
  {
    slug: "mac-oui-lookup",
    title: {
      ko: "MAC 주소 OUI 조회기",
      en: "MAC Address OUI Lookup",
    },
    description: {
      ko: "MAC 주소의 OUI(Organizationally Unique Identifier)를 조회하여 제조사 정보를 확인합니다.",
      en: "Look up the manufacturer from a MAC address using OUI database.",
    },
    category: "network",
    keywords: ["mac", "oui", "vendor", "manufacturer", "ieee", "맥주소"],
    component: "MacOuiLookup",
    datePublished: "2026-03-22",
  },
  {
    slug: "cidr-to-range",
    title: {
      ko: "CIDR → IP 범위 변환기",
      en: "CIDR to IP Range Converter",
    },
    description: {
      ko: "CIDR 표기법을 시작/끝 IP 주소 범위로 변환합니다.",
      en: "Convert CIDR notation to start/end IP address range.",
    },
    category: "network",
    keywords: ["cidr", "ip range", "convert", "notation"],
    component: "CidrToRange",
    datePublished: "2026-03-22",
  },
  {
    slug: "ip-lookup",
    title: {
      ko: "IP 주소 조회기",
      en: "IP Address Lookup",
    },
    description: {
      ko: "IP 주소의 공인/사설 여부를 확인하고, 공인 IP의 등록 정보(국가, ISP, 조직 등)를 조회합니다.",
      en: "Check if an IP is public or private, and look up registration info (country, ISP, org) for public IPs.",
    },
    category: "network",
    keywords: ["ip", "lookup", "whois", "geolocation", "public", "private", "아이피", "조회", "공인", "사설"],
    component: "IpLookup",
    datePublished: "2026-03-29",
  },
  {
    slug: "dns-lookup",
    title: {
      ko: "DNS 조회기",
      en: "DNS Lookup",
    },
    description: {
      ko: "도메인의 A, AAAA, MX, NS, TXT, CNAME, SOA 등 DNS 레코드를 조회합니다. (Cloudflare DoH API 활용)",
      en: "Look up DNS records (A, AAAA, MX, NS, TXT, CNAME, SOA) for any domain using Cloudflare DoH API.",
    },
    category: "network",
    keywords: ["dns", "domain", "lookup", "a record", "mx", "ns", "txt", "cname", "soa", "도메인", "조회"],
    component: "DnsLookup",
    datePublished: "2026-03-30",
  },
  {
    slug: "port-dictionary",
    title: {
      ko: "포트 번호 사전",
      en: "Port Number Dictionary",
    },
    description: {
      ko: "잘 알려진 포트 번호(0~65535)를 검색합니다. 서비스명, 프로토콜, 용도를 확인할 수 있습니다.",
      en: "Search well-known port numbers (0-65535). Find service names, protocols, and descriptions.",
    },
    category: "network",
    keywords: ["port", "tcp", "udp", "service", "well-known", "포트", "번호", "서비스"],
    component: "PortDictionary",
    datePublished: "2026-03-30",
  },
  {
    slug: "password-generator",
    title: {
      ko: "비밀번호 생성기",
      en: "Password Generator",
    },
    description: {
      ko: "안전한 비밀번호를 생성합니다. 길이, 문자 종류를 설정하고 강도를 확인할 수 있습니다.",
      en: "Generate secure passwords with customizable length, character types, and strength indicator.",
    },
    category: "security",
    keywords: ["password", "generator", "random", "secure", "strength", "비밀번호", "생성", "보안"],
    component: "PasswordGenerator",
    datePublished: "2026-03-30",
  },
  {
    slug: "base64",
    title: {
      ko: "Base64 인코더/디코더",
      en: "Base64 Encoder/Decoder",
    },
    description: {
      ko: "텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩합니다. UTF-8을 지원합니다.",
      en: "Encode text to Base64 or decode Base64 to text. Supports UTF-8 characters.",
    },
    category: "developer",
    keywords: ["base64", "encode", "decode", "convert", "인코딩", "디코딩", "변환"],
    component: "Base64Tool",
    datePublished: "2026-03-30",
  },
  {
    slug: "json-formatter",
    title: {
      ko: "JSON 포매터",
      en: "JSON Formatter",
    },
    description: {
      ko: "JSON을 정리(Pretty Print), 축소(Minify), 검증(Validate)합니다.",
      en: "Format (pretty print), minify, and validate JSON data.",
    },
    category: "developer",
    keywords: ["json", "format", "prettify", "minify", "validate", "정리", "축소", "검증"],
    component: "JsonFormatter",
    datePublished: "2026-03-30",
  },
  {
    slug: "cron-parser",
    title: {
      ko: "Cron 표현식 해석기",
      en: "Cron Expression Parser",
    },
    description: {
      ko: "Cron 표현식을 사람이 읽을 수 있는 설명으로 변환합니다.",
      en: "Convert cron expressions to human-readable descriptions.",
    },
    category: "linux",
    keywords: ["cron", "crontab", "schedule", "expression", "parser", "크론", "스케줄"],
    component: "CronParser",
    datePublished: "2026-03-30",
  },
  {
    slug: "chmod-calculator",
    title: {
      ko: "chmod 계산기",
      en: "chmod Calculator",
    },
    description: {
      ko: "Unix 파일 권한을 숫자(8진수)와 기호(rwx) 형식으로 상호 변환합니다.",
      en: "Convert between numeric (octal) and symbolic (rwx) Unix file permissions.",
    },
    category: "linux",
    keywords: ["chmod", "permission", "rwx", "octal", "unix", "linux", "권한", "파일"],
    component: "ChmodCalculator",
    datePublished: "2026-03-30",
  },
  {
    slug: "ssl-checker",
    title: {
      ko: "SSL 인증서 확인",
      en: "SSL Certificate Checker",
    },
    description: {
      ko: "도메인의 SSL 인증서 만료일과 발급자 정보를 확인합니다.",
      en: "Check SSL certificate expiration date and issuer information for any domain.",
    },
    category: "security",
    keywords: ["ssl", "tls", "certificate", "https", "expiry", "인증서", "만료", "보안"],
    component: "SslChecker",
    datePublished: "2026-03-30",
  },
];

// Helper functions
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategoryById(id: ToolCategory): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getAllSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}
