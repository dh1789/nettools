/**
 * OG 이미지 카테고리 설정 및 seo.ts 카테고리별 OG 이미지 경로 테스트
 */
import {
  CATEGORY_OG_CONFIG,
  getCategoryOgImagePath,
} from "../og-image";

describe("CATEGORY_OG_CONFIG", () => {
  const requiredCategories = [
    "network",
    "security",
    "linux",
    "developer",
    "general",
  ] as const;

  test("5개 카테고리 모두 설정이 존재해야 한다", () => {
    for (const cat of requiredCategories) {
      expect(CATEGORY_OG_CONFIG[cat]).toBeDefined();
    }
  });

  test("각 카테고리에 label, icon, bgColor, accentColor가 있어야 한다", () => {
    for (const cat of requiredCategories) {
      const cfg = CATEGORY_OG_CONFIG[cat];
      expect(cfg.label).toBeTruthy();
      expect(cfg.icon).toBeTruthy();
      expect(cfg.bgColor).toBeTruthy();
      expect(cfg.accentColor).toBeTruthy();
    }
  });
});

describe("getCategoryOgImagePath", () => {
  test("카테고리 ID로 올바른 OG 이미지 경로를 반환해야 한다", () => {
    expect(getCategoryOgImagePath("network")).toBe("/og/network.png");
    expect(getCategoryOgImagePath("security")).toBe("/og/security.png");
    expect(getCategoryOgImagePath("linux")).toBe("/og/linux.png");
    expect(getCategoryOgImagePath("developer")).toBe("/og/developer.png");
    expect(getCategoryOgImagePath("general")).toBe("/og/general.png");
  });

  test("알 수 없는 카테고리는 기본 OG 이미지를 반환해야 한다", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getCategoryOgImagePath("unknown" as any)).toBe("/og-image.png");
  });
});
