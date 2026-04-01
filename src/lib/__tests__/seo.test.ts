import { generateToolMetadata } from "../seo";
import type { Tool } from "@/data/tools";

const mockTool: Tool = {
  slug: "test-tool",
  title: { ko: "테스트 도구", en: "Test Tool" },
  description: { ko: "테스트 설명", en: "Test description" },
  longDescription: { ko: "상세 설명", en: "Long description" },
  category: "developer",
  keywords: ["test"],
  component: "TestComponent",
  datePublished: "2026-01-01",
  faqs: [],
};

describe("generateToolMetadata", () => {
  test("alternates에 languages(hrefLang) 속성이 포함되지 않아야 한다", () => {
    const metadata = generateToolMetadata(mockTool, "ko");

    expect(metadata.alternates).toBeDefined();
    expect(metadata.alternates?.canonical).toBe(
      "https://beomanro.com/tools/net/test-tool"
    );
    // 존재하지 않는 /ko/, /en/ 경로로의 hrefLang 링크가 없어야 함
    expect(metadata.alternates).not.toHaveProperty("languages");
  });

  test("canonical URL이 올바르게 생성되어야 한다", () => {
    const metadata = generateToolMetadata(mockTool, "ko");
    expect(metadata.alternates?.canonical).toBe(
      "https://beomanro.com/tools/net/test-tool"
    );
  });
});
