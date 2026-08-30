/**
 * @jest-environment jsdom
 */
import {
  detectBrowserLocale,
  DEFAULT_LOCALE,
  t,
  STORAGE_KEY,
  localePath,
  stripLocalePrefix,
  localeFromPath,
} from "../i18n";

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

// /en/ 정적 라우트 도입(2026-08-30): URL 이 언어의 단일 진실. ko 는 무프리픽스, en 은 /en 프리픽스.
describe("localePath — 로케일 프리픍스 + trailing slash 정규화(TR-3)", () => {
  test("ko 는 프리픽스 없음", () => {
    expect(localePath("/", "ko")).toBe("/");
    expect(localePath("/blog/", "ko")).toBe("/blog/");
    expect(localePath("/tools/net/base64/", "ko")).toBe("/tools/net/base64/");
  });

  test("en 은 /en 프리픽스", () => {
    expect(localePath("/", "en")).toBe("/en/");
    expect(localePath("/blog/", "en")).toBe("/en/blog/");
    expect(localePath("/tools/net/base64/", "en")).toBe("/en/tools/net/base64/");
  });

  test("이미 /en 프리픽스가 있으면 중복하지 않는다", () => {
    expect(localePath("/en/blog/", "en")).toBe("/en/blog/");
    expect(localePath("/en/", "en")).toBe("/en/");
  });

  test("trailing slash 가 없으면 붙인다 (해시·쿼리는 보존)", () => {
    expect(localePath("/about", "ko")).toBe("/about/");
    expect(localePath("/about", "en")).toBe("/en/about/");
    expect(localePath("/blog#toc", "ko")).toBe("/blog/#toc");
    expect(localePath("/blog?x=1", "en")).toBe("/en/blog/?x=1");
  });

  test("외부 URL·해시 전용 링크는 건드리지 않는다", () => {
    expect(localePath("https://example.com/a", "en")).toBe("https://example.com/a");
    expect(localePath("#section", "en")).toBe("#section");
    expect(localePath("mailto:a@b.c", "en")).toBe("mailto:a@b.c");
  });
});

describe("stripLocalePrefix / localeFromPath", () => {
  test("/en 프리픽스를 벗긴다", () => {
    expect(stripLocalePrefix("/en/blog/x/")).toBe("/blog/x/");
    expect(stripLocalePrefix("/en/")).toBe("/");
    expect(stripLocalePrefix("/en")).toBe("/");
  });

  test("프리픽스 없는 경로는 그대로", () => {
    expect(stripLocalePrefix("/blog/x/")).toBe("/blog/x/");
    expect(stripLocalePrefix("/english/")).toBe("/english/");
  });

  test("경로에서 로케일을 읽는다", () => {
    expect(localeFromPath("/en/blog/")).toBe("en");
    expect(localeFromPath("/en")).toBe("en");
    expect(localeFromPath("/blog/")).toBe("ko");
    expect(localeFromPath("/english/")).toBe("ko");
  });
});
