/**
 * Minimal i18n
 * ─────────────
 * 브라우저 언어 감지 + URL 기반 언어 전환
 * 무거운 라이브러리 없이 최소한의 구현
 */

export type Locale = "ko" | "en";

export interface Translatable {
  ko: string;
  en: string;
}

/** Default locale */
export const DEFAULT_LOCALE: Locale = "en";

/** Get locale from Accept-Language header or default */
export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  if (acceptLanguage.includes("ko")) return "ko";
  return DEFAULT_LOCALE;
}

/** Pick the right string from a translatable object */
export function t(translatable: Translatable, locale: Locale): string {
  return translatable[locale] || translatable[DEFAULT_LOCALE];
}

/** Common UI strings */
export const UI_STRINGS: Record<string, Translatable> = {
  siteTitle: {
    ko: "NetTools - 네트워크 & 보안 도구 모음",
    en: "NetTools - Network & Security Tools",
  },
  siteDescription: {
    ko: "네트워크 엔지니어와 보안 전문가를 위한 무료 온라인 도구",
    en: "Free online tools for network engineers and security professionals",
  },
  allTools: {
    ko: "전체 도구",
    en: "All Tools",
  },
  categories: {
    ko: "카테고리",
    en: "Categories",
  },
  about: {
    ko: "소개",
    en: "About",
  },
  searchPlaceholder: {
    ko: "도구 검색...",
    en: "Search tools...",
  },
  madeBy: {
    ko: "19년차 보안 개발자가 만든 실전 도구 모음",
    en: "Practical tools built by a 19-year security developer",
  },
  tryIt: {
    ko: "사용해보기",
    en: "Try it",
  },
  copyResult: {
    ko: "결과 복사",
    en: "Copy result",
  },
  copied: {
    ko: "복사됨!",
    en: "Copied!",
  },
};
