/**
 * seo.ts — 카테고리별 OG 이미지 경로가 메타데이터에 반영되는지 테스트
 */
import { generateToolMetadata, generateCategoryMetadata } from "../seo";
import type { Tool, Category } from "@/data/tools";

const SITE_URL = "https://beomanro.com";

const makeTool = (category: "network" | "security" | "linux" | "developer" | "general"): Tool => ({
  slug: `test-${category}`,
  title: { ko: "테스트", en: "Test" },
  description: { ko: "설명", en: "Desc" },
  category,
  keywords: ["test"],
  component: "TestComponent",
});

describe("generateToolMetadata — 카테고리별 OG 이미지", () => {
  const categories = ["network", "security", "linux", "developer", "general"] as const;

  test.each(categories)("%s 카테고리 도구의 OG 이미지가 카테고리별 경로여야 한다", (cat) => {
    const tool = makeTool(cat);
    const meta = generateToolMetadata(tool, "ko");
    const ogImages = meta.openGraph?.images;
    expect(ogImages).toBeDefined();
    const images = ogImages as Array<{ url: string }>;
    expect(images[0].url).toBe(`${SITE_URL}/og/${cat}.png`);
  });

  test.each(categories)("%s 카테고리 도구의 Twitter 이미지도 카테고리별이어야 한다", (cat) => {
    const tool = makeTool(cat);
    const meta = generateToolMetadata(tool, "ko");
    const twitterImages = meta.twitter?.images;
    expect(twitterImages).toBeDefined();
    expect(twitterImages).toContain(`${SITE_URL}/og/${cat}.png`);
  });
});

describe("generateCategoryMetadata — 카테고리별 OG 이미지", () => {
  test("카테고리 페이지의 OG 이미지가 해당 카테고리 경로여야 한다", () => {
    const category: Category = {
      id: "network",
      title: { ko: "네트워크", en: "Network" },
      description: { ko: "설명", en: "Desc" },
      icon: "🌐",
    };
    const meta = generateCategoryMetadata(category, "ko");
    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe(`${SITE_URL}/og/network.png`);
  });
});
