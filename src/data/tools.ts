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
