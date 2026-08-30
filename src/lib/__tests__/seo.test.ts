import {
  generateToolMetadata,
  generateToolJsonLd,
  generateBlogMetadata,
  generateBlogJsonLd,
  generateCategoryMetadata,
  localeAlternates,
  localizeSitemapEntries,
} from "../seo";
import type { Tool } from "@/data/tools";
import { CATEGORIES } from "@/data/tools";
import type { BlogPost } from "../blog";

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

const mockToolWithHowTo: Tool = {
  ...mockTool,
  slug: "howto-tool",
  howTo: {
    steps: [
      { ko: "IP 주소를 입력합니다.", en: "Enter an IP address." },
      { ko: "결과를 확인합니다.", en: "Review the results." },
      { ko: "설정에 반영합니다.", en: "Apply to your configuration." },
    ],
  },
};

const KO_URL = "https://beomanro.com/tools/net/test-tool/";
const EN_URL = "https://beomanro.com/en/tools/net/test-tool/";

describe("generateToolMetadata", () => {
  // 2026-08-30 반전: 이전엔 /en/ 경로가 없어 hreflang 을 금지했다. /en/ 정적 라우트가
  // 생겼으므로 ko/en/x-default 3종 hreflang 이 반드시 있어야 한다.
  test("ko: canonical 은 무프리픽스, hreflang ko/en/x-default 포함", () => {
    const metadata = generateToolMetadata(mockTool, "ko");
    expect(metadata.alternates?.canonical).toBe(KO_URL);
    expect(metadata.alternates?.languages).toEqual({
      ko: KO_URL,
      en: EN_URL,
      "x-default": KO_URL,
    });
  });

  test("en: canonical 은 /en/ 자기 자신, hreflang 은 ko 와 동일 집합", () => {
    const metadata = generateToolMetadata(mockTool, "en");
    expect(metadata.alternates?.canonical).toBe(EN_URL);
    expect(metadata.alternates?.languages).toEqual({
      ko: KO_URL,
      en: EN_URL,
      "x-default": KO_URL,
    });
    expect(metadata.openGraph).toMatchObject({ url: EN_URL, locale: "en_US" });
  });

  test("title 접미사가 로케일을 따른다 (en 페이지에 한국어 접미사 금지 — TR-7)", () => {
    expect(String(generateToolMetadata(mockTool, "ko").title)).toContain("무료 온라인 도구");
    const enTitle = String(generateToolMetadata(mockTool, "en").title);
    expect(enTitle).not.toMatch(/[가-힣]/);
    expect(enTitle).toContain("Test Tool");
  });
});

describe("generateToolJsonLd — 로케일 URL", () => {
  test("en: WebApplication.url 과 BreadcrumbList 가 /en/ URL, inLanguage 는 단일 로케일", () => {
    const graph = JSON.parse(generateToolJsonLd(mockTool, "en"))["@graph"];
    const app = graph.find((n: { "@type": string | string[] }) =>
      Array.isArray(n["@type"]) && n["@type"].includes("WebApplication"),
    );
    expect(app.url).toBe(EN_URL);
    expect(app.inLanguage).toBe("en");
    const crumbs = graph.find((n: { "@type": string }) => n["@type"] === "BreadcrumbList");
    const items = crumbs.itemListElement.map((i: { item: string }) => i.item);
    expect(items[0]).toBe("https://beomanro.com/en/");
    expect(items[items.length - 1]).toBe(EN_URL);
  });

  test("ko: 기존 무프리픽스 URL 유지", () => {
    const graph = JSON.parse(generateToolJsonLd(mockTool, "ko"))["@graph"];
    const app = graph.find((n: { "@type": string | string[] }) =>
      Array.isArray(n["@type"]) && n["@type"].includes("WebApplication"),
    );
    expect(app.url).toBe(KO_URL);
    expect(app.inLanguage).toBe("ko");
  });
});

const mockPost: BlogPost = {
  slug: "test-guide",
  locale: "en",
  frontmatter: {
    title: "Test Guide",
    description: "Test description",
    category: "network",
    keywords: ["a", "b", "c"],
    publishedAt: "2026-08-01",
    relatedTools: ["test-tool"],
    author: "beomanro",
  },
  content: "## A\n\ntext",
  readingTime: 3,
  toc: [],
};

describe("generateBlogMetadata / JsonLd — 로케일 URL", () => {
  test("en 가이드: canonical /en/blog/, hreflang 3종", () => {
    const m = generateBlogMetadata(mockPost, "en");
    expect(m.alternates?.canonical).toBe("https://beomanro.com/en/blog/test-guide/");
    expect(m.alternates?.languages).toEqual({
      ko: "https://beomanro.com/blog/test-guide/",
      en: "https://beomanro.com/en/blog/test-guide/",
      "x-default": "https://beomanro.com/blog/test-guide/",
    });
  });

  test("en 가이드 JSON-LD: url·mainEntityOfPage 가 /en/, 브레드크럼 'Blog'", () => {
    const graph = JSON.parse(generateBlogJsonLd(mockPost, "en"))["@graph"];
    const posting = graph.find((n: { "@type": string }) => n["@type"] === "BlogPosting");
    expect(posting.url).toBe("https://beomanro.com/en/blog/test-guide/");
    expect(posting.mainEntityOfPage["@id"]).toBe("https://beomanro.com/en/blog/test-guide/");
    const crumbs = graph.find((n: { "@type": string }) => n["@type"] === "BreadcrumbList");
    expect(crumbs.itemListElement[1]).toMatchObject({
      name: "Blog",
      item: "https://beomanro.com/en/blog/",
    });
  });
});

describe("generateCategoryMetadata — 로케일 URL", () => {
  test("en 카테고리: canonical /en/category/, title 에 한국어 없음", () => {
    const m = generateCategoryMetadata(CATEGORIES[0], "en");
    expect(m.alternates?.canonical).toBe("https://beomanro.com/en/category/network/");
    expect(m.alternates?.languages?.en).toBe("https://beomanro.com/en/category/network/");
    expect(String(m.title)).not.toMatch(/[가-힣]/);
  });
});

describe("localeAlternates", () => {
  test("ko 경로를 받아 canonical(로케일별)과 hreflang 3종을 만든다", () => {
    expect(localeAlternates("/about/", "ko")).toEqual({
      canonical: "https://beomanro.com/about/",
      languages: {
        ko: "https://beomanro.com/about/",
        en: "https://beomanro.com/en/about/",
        "x-default": "https://beomanro.com/about/",
      },
    });
    expect(localeAlternates("/", "en").canonical).toBe("https://beomanro.com/en/");
  });
});

describe("localizeSitemapEntries — ko 엔트리마다 en 트윈 + hreflang", () => {
  test("1 ko 엔트리 → ko/en 2 엔트리, 둘 다 alternates.languages 보유", () => {
    const out = localizeSitemapEntries([
      { url: "https://beomanro.com/blog/x/", lastmod: "2026-08-01", priority: 0.7 },
    ]);
    expect(out).toHaveLength(2);
    expect(out.map((e) => e.url)).toEqual([
      "https://beomanro.com/blog/x/",
      "https://beomanro.com/en/blog/x/",
    ]);
    for (const e of out) {
      expect(e.alternates?.languages).toEqual({
        ko: "https://beomanro.com/blog/x/",
        en: "https://beomanro.com/en/blog/x/",
        "x-default": "https://beomanro.com/blog/x/",
      });
      expect(e.priority).toBe(0.7);
      expect(e.lastModified).toEqual(new Date("2026-08-01"));
    }
  });

  test("홈 / 은 /en/ 로", () => {
    const out = localizeSitemapEntries([{ url: "https://beomanro.com/", priority: 1.0 }]);
    expect(out[1].url).toBe("https://beomanro.com/en/");
  });

  test("이미 /en/ 인 입력은 중복 생성하지 않는다", () => {
    const out = localizeSitemapEntries([{ url: "https://beomanro.com/en/blog/x/", priority: 0.7 }]);
    expect(out).toHaveLength(1);
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

describe("generateToolJsonLd - SoftwareApplication 스키마 보강", () => {
  test("@type이 SoftwareApplication을 포함해야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const app = jsonLd["@graph"].find(
      (item: { "@id": string }) => item["@id"]?.includes("#webapp")
    );
    expect(app["@type"]).toContain("SoftwareApplication");
  });

  test("applicationSubCategory가 카테고리 기반으로 설정되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const app = jsonLd["@graph"].find(
      (item: { "@id": string }) => item["@id"]?.includes("#webapp")
    );
    expect(app.applicationSubCategory).toBeDefined();
    expect(typeof app.applicationSubCategory).toBe("string");
  });

  test("screenshot 속성이 카테고리별 OG 이미지 URL로 설정되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const app = jsonLd["@graph"].find(
      (item: { "@id": string }) => item["@id"]?.includes("#webapp")
    );
    expect(app.screenshot).toBeDefined();
    expect(app.screenshot).toContain("/og/developer.png");
  });

  test("offers에 availability가 포함되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const app = jsonLd["@graph"].find(
      (item: { "@id": string }) => item["@id"]?.includes("#webapp")
    );
    expect(app.offers.availability).toBe("https://schema.org/InStock");
    expect(app.offers.price).toBe("0");
    expect(app.offers.priceCurrency).toBe("USD");
  });
});

describe("generateToolJsonLd - howTo 필드에서 HowTo 스키마 생성", () => {
  test("howTo 데이터가 있으면 HowTo 스키마가 @graph에 포함되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithHowTo, "ko"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howToItems.length).toBe(1);
  });

  test("howTo HowTo 스키마에 도구 이름 기반 name과 step이 포함되어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithHowTo, "ko"));
    const howTo = jsonLd["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howTo.name).toContain("테스트 도구");
    expect(howTo.step).toBeDefined();
    expect(howTo.step.length).toBe(3);
    expect(howTo.step[0]["@type"]).toBe("HowToStep");
    expect(howTo.step[0].position).toBe(1);
    expect(howTo.step[0].text).toBe("IP 주소를 입력합니다.");
  });

  test("영어 locale 시 howTo에서 영어 텍스트로 HowTo 생성", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockToolWithHowTo, "en"));
    const howTo = jsonLd["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howTo.name).toContain("Test Tool");
    expect(howTo.step[0].text).toBe("Enter an IP address.");
  });

  test("howTo와 usageExamples 모두 없으면 HowTo 스키마가 없어야 한다", () => {
    const jsonLd = JSON.parse(generateToolJsonLd(mockTool, "ko"));
    const howToItems = jsonLd["@graph"].filter(
      (item: { "@type": string }) => item["@type"] === "HowTo"
    );
    expect(howToItems.length).toBe(0);
  });
});
