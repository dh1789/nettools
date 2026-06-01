/**
 * @jest-environment jsdom
 */
import { detectBrowserLocale, DEFAULT_LOCALE, t, STORAGE_KEY } from "../i18n";

function setNavigatorLanguage(lang: string) {
  Object.defineProperty(window.navigator, "language", {
    value: lang,
    configurable: true,
  });
}

describe("DEFAULT_LOCALE", () => {
  test("한국어가 기본 locale이어야 한다 (SSG 한국어 렌더 → 메타 일치)", () => {
    expect(DEFAULT_LOCALE).toBe("ko");
  });
});

describe("detectBrowserLocale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("localStorage 저장값이 우선한다", () => {
    localStorage.setItem(STORAGE_KEY, "en");
    setNavigatorLanguage("ko-KR");
    expect(detectBrowserLocale()).toBe("en");
  });

  test("한국어 브라우저 → ko", () => {
    setNavigatorLanguage("ko-KR");
    expect(detectBrowserLocale()).toBe("ko");
  });

  test("영어 브라우저 → en (영어 사용자 보호)", () => {
    setNavigatorLanguage("en-US");
    expect(detectBrowserLocale()).toBe("en");
  });

  test("기타 언어 브라우저 → DEFAULT_LOCALE(ko)", () => {
    setNavigatorLanguage("fr-FR");
    expect(detectBrowserLocale()).toBe("ko");
  });
});

describe("t() fallback", () => {
  test("locale 값 없으면 DEFAULT_LOCALE(ko)로 fallback", () => {
    expect(t({ ko: "한국어", en: "" }, "en")).toBe("한국어");
  });
});
