import { generateToolMetadata, generateToolJsonLd } from "../seo";
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

const mockToolWithExamples: Tool = {
  ...mockTool,
  usageExamples: [
    {
      title: { ko: "API 응답 디버깅", en: "Debugging API Response" },
      scenario: { ko: "API 응답이 깨져 보일 때", en: "When API response looks broken" },
      steps: [
        { ko: "JSON 데이터 붙여넣기", en: "Paste JSON data" },
        { ko: "포맷 버튼 클릭", en: "Click format button" },
      ],
      result: { ko: "정렬된 JSON 확인", en: "View formatted JSON" },
    },
    {
      title: { ko: "설정 파일 검증", en: "Config File Validation" },
      scenario: { ko: "JSON 설정 파일 문법 확인", en: "Checking JSON config syntax" },
      steps: [
        { ko: "설정 파일 내용 입력", en: "Enter config content" },
        { ko: "문법 오류 확인", en: "Check for syntax errors" },
      ],
      result: { ko: "문법 오류 위치 확인", en: "Locate syntax errors" },
    },
  ],
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

describe("generateToolJsonLd - usageExamples HowTo 스키마", () => {
  test("usageExamples가 있으면 HowTo 스키마가 @graph에 포함되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithExamples, "ko"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howToItems.length).toBe(2);
  });

  test("HowTo 스키마에 name, description, step이 포함되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithExamples, "ko"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    const first = howToItems[0];
    expect(first.name).toBe("API 응답 디버깅");
    expect(first.description).toBe("API 응답이 깨져 보일 때");
    expect(first.step).toBeDefined();
    expect(first.step.length).toBe(2);
    expect(first.step[0]["@type"]).toBe("HowToStep");
    expect(first.step[0].text).toBe("JSON 데이터 붙여넣기");
  });

  test("usageExamples가 없으면 HowTo 스키마가 포함되지 않아야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howToItems.length).toBe(0);
  });

  test("영어 locale 시 영어 텍스트로 HowTo 생성", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithExamples, "en"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howToItems[0].name).toBe("Debugging API Response");
    expect(howToItems[0].step[0].text).toBe("Paste JSON data");
  });
});
