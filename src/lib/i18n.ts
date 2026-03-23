/**
 * i18n System
 * ───────────
 * 브라우저 언어 감지 + localStorage 저장 + Context 기반 다국어 지원
 */

export type Locale = "ko" | "en";

export interface Translatable {
  ko: string;
  en: string;
}

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "nettools-locale";

export function detectBrowserLocale(): Locale {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return DEFAULT_LOCALE;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
    const lang = navigator.language || "";
    if (lang.startsWith("ko")) return "ko";
  } catch {
    // SSR or restricted context
  }
  return DEFAULT_LOCALE;
}

export function t(translatable: Translatable, locale: Locale): string {
  return translatable[locale] || translatable[DEFAULT_LOCALE];
}

// ─── 번역 사전 ───

export const T = {
  // 공통
  siteTitle: {
    ko: "NetTools — 네트워크 & 보안 도구 모음",
    en: "NetTools — Free Network & Security Tools",
  },
  siteDescription: {
    ko: "네트워크 엔지니어와 보안 전문가를 위한 무료 온라인 도구",
    en: "Free online tools for network engineers and security professionals",
  },
  heroSubtitle: {
    ko: "네트워크 엔지니어와 보안 전문가를 위한 무료 온라인 도구.\n가입 없이. 추적 없이. 오직 도구만.",
    en: "Free online tools for network engineers and security professionals.\nNo signup. No tracking. Just tools.",
  },
  toolsAvailable: {
    ko: "{count}개 도구 사용 가능",
    en: "{count} tools available",
  },
  navTools: { ko: "도구", en: "Tools" },
  navAbout: { ko: "소개", en: "About" },
  navHome: { ko: "홈", en: "Home" },
  menu: { ko: "메뉴", en: "Menu" },
  footerBuiltBy: {
    ko: "NetTools — 19년차 네트워크 보안 개발자가 만들었습니다.",
    en: "NetTools — Built by a network security developer with 19 years of experience.",
  },
  footerPrivacy: {
    ko: "모든 도구는 브라우저에서 실행됩니다. 서버로 전송되는 데이터가 없습니다.",
    en: "All tools run entirely in your browser. No data is sent to any server.",
  },
  results: { ko: "결과", en: "Results" },
  copied: { ko: "복사됨!", en: "Copied!" },
  copyAll: { ko: "전체 복사", en: "Copy All" },
  copy: { ko: "복사", en: "Copy" },

  // SubnetCalculator
  ipAddress: { ko: "IP 주소", en: "IP Address" },
  subnetMask: { ko: "서브넷 마스크", en: "Subnet Mask" },
  cidrPrefix: { ko: "CIDR 프리픽스 길이 (/{cidr})", en: "CIDR Prefix Length (/{cidr})" },
  networkAddress: { ko: "네트워크 주소", en: "Network Address" },
  broadcastAddress: { ko: "브로드캐스트 주소", en: "Broadcast Address" },
  firstUsableHost: { ko: "첫 번째 사용 가능 호스트", en: "First Usable Host" },
  lastUsableHost: { ko: "마지막 사용 가능 호스트", en: "Last Usable Host" },
  wildcardMask: { ko: "와일드카드 마스크", en: "Wildcard Mask" },
  totalHosts: { ko: "전체 호스트", en: "Total Hosts" },
  usableHosts: { ko: "사용 가능 호스트", en: "Usable Hosts" },
  ipClass: { ko: "IP 클래스", en: "IP Class" },
  addressType: { ko: "주소 유형", en: "Address Type" },
  privateRfc: { ko: "사설 (RFC 1918)", en: "Private (RFC 1918)" },
  public: { ko: "공인", en: "Public" },
  binaryRepresentation: { ko: "2진수 표현", en: "Binary Representation" },
  invalidIp: {
    ko: "유효하지 않은 IP 주소입니다. 올바른 IPv4 주소를 입력해주세요. (예: 192.168.1.100)",
    en: "Invalid IP address. Please enter a valid IPv4 address (e.g., 192.168.1.100)",
  },
  ipNeedsFourOctets: {
    ko: "IP 주소는 점(.)으로 구분된 4개의 옥텟이 필요합니다.",
    en: "IP address requires 4 octets separated by dots.",
  },
  ipOctetRange: {
    ko: "각 옥텟은 0~255 범위의 숫자여야 합니다. (옥텟 {n}: \"{val}\")",
    en: "Each octet must be a number between 0 and 255. (octet {n}: \"{val}\")",
  },
  invalidMaskMsg: {
    ko: "유효하지 않은 서브넷 마스크입니다. 연속된 1비트 후 0비트 형태여야 합니다. (예: 255.255.255.0)",
    en: "Invalid subnet mask. Must be contiguous 1-bits followed by 0-bits. (e.g., 255.255.255.0)",
  },

  // MacOuiLookup
  macAddress: { ko: "MAC 주소", en: "MAC Address" },
  lookup: { ko: "조회", en: "Lookup" },
  lookingUp: { ko: "조회중...", en: "Looking up..." },
  supportedFormats: {
    ko: "지원 형식: AA:BB:CC:DD:EE:FF, AA-BB-CC-DD-EE-FF, AABB.CCDD.EEFF, AABBCCDDEEFF",
    en: "Formats: AA:BB:CC:DD:EE:FF, AA-BB-CC-DD-EE-FF, AABB.CCDD.EEFF, AABBCCDDEEFF",
  },
  lookupResult: { ko: "조회 결과", en: "Lookup Result" },
  manufacturerVendor: { ko: "제조사", en: "Manufacturer / Vendor" },
  ouiPrefix: { ko: "OUI (프리픽스)", en: "OUI (Prefix)" },
  ouiType: { ko: "OUI 타입", en: "OUI Type" },
  invalidMac: {
    ko: "유효한 MAC 주소를 입력해주세요. (예: AA:BB:CC:DD:EE:FF)",
    en: "Please enter a valid MAC address. (e.g., AA:BB:CC:DD:EE:FF)",
  },
  ouiNotFound: {
    ko: "OUI {oui} 에 대한 제조사 정보를 찾을 수 없습니다.",
    en: "No manufacturer found for OUI {oui}.",
  },
  ouiDbLoading: {
    ko: "OUI 데이터베이스를 로딩 중입니다. 잠시 후 다시 시도해주세요.",
    en: "OUI database is loading. Please try again shortly.",
  },
  ouiDbLoadingShort: { ko: "로딩중...", en: "Loading..." },
  ouiDescription: {
    ko: "MAC 주소의 앞 3바이트(24비트)는 IEEE가 각 제조사에 할당한 고유 식별자입니다. 이를 통해 네트워크 장치의 제조사를 식별할 수 있습니다.",
    en: "The first 3 bytes (24 bits) of a MAC address are the Organizationally Unique Identifier assigned by IEEE to each manufacturer, used to identify the device vendor.",
  },
  ouiDbCount: {
    ko: "내장 DB: {count}개 OUI",
    en: "Built-in DB: {count} OUIs",
  },
  ouiDescription2: {
    ko: "IEEE에서 배포하는 MA-L(24비트), MA-M(28비트), MA-S(36비트) 3종 데이터를 모두 지원합니다.",
    en: "Supports all three IEEE registries: MA-L (24-bit), MA-M (28-bit), and MA-S (36-bit).",
  },
  // CidrToRange
  cidrNotation: { ko: "CIDR 표기법", en: "CIDR Notation" },
  convert: { ko: "변환", en: "Convert" },
  cidrFormatHint: {
    ko: "형식: IP주소/프리픽스 (예: 192.168.1.0/24, 10.0.0.0/8)",
    en: "Format: IP/prefix (e.g., 192.168.1.0/24, 10.0.0.0/8)",
  },
  cidrInvalidFormat: {
    ko: "유효하지 않은 CIDR 표기법입니다. (예: 192.168.1.0/24)",
    en: "Invalid CIDR notation. (e.g., 192.168.1.0/24)",
  },
  cidrIpRange: { ko: "IP 범위", en: "IP Range" },
  cidrTotalCount: {
    ko: "총 {count}개 IP 주소",
    en: "{count} IP addresses total",
  },
  cidrFirstIp: { ko: "시작 IP", en: "First IP" },
  cidrLastIp: { ko: "끝 IP", en: "Last IP" },
  cidrTotalIps: { ko: "전체 IP 수", en: "Total IPs" },
} as const satisfies Record<string, Translatable>;

/** 템플릿 문자열 치환 */
export function tf(
  translatable: Translatable,
  locale: Locale,
  vars: Record<string, string | number>,
): string {
  let str = t(translatable, locale);
  for (const [key, val] of Object.entries(vars)) {
    str = str.replace(`{${key}}`, String(val));
  }
  return str;
}
