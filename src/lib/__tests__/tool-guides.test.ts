import { getGuidesForTool, toGuideLinks } from "../blog";
import { getAllSlugs as getAllToolSlugs } from "@/data/tools";

// 도구 페이지 → 관련 가이드 역참조 (가이드 frontmatter.relatedTools 기준)
// 배경: 2026-08-29 실측에서 도구 페이지→가이드 링크가 0건이라 가이드가 도구에서 고아였다.

describe("getGuidesForTool — 도구 slug 로 가이드 역참조", () => {
  test("relatedTools 에 해당 slug 를 가진 가이드만 반환한다", () => {
    const guides = getGuidesForTool("subnet-calculator", "ko");
    expect(guides.length).toBeGreaterThanOrEqual(1);
    for (const g of guides) {
      expect(g.frontmatter.relatedTools).toContain("subnet-calculator");
      expect(g.locale).toBe("ko");
    }
  });

  test("가이드가 없는 slug 는 빈 배열", () => {
    expect(getGuidesForTool("no-such-tool", "ko")).toEqual([]);
  });

  test("ko/en 이 같은 슬러그 집합을 반환한다 (MDX 쌍 불변)", () => {
    const ko = getGuidesForTool("subnet-calculator", "ko").map((g) => g.slug).sort();
    const en = getGuidesForTool("subnet-calculator", "en").map((g) => g.slug).sort();
    expect(en).toEqual(ko);
  });

  test("발행일 내림차순을 유지한다", () => {
    const dates = getGuidesForTool("subnet-calculator", "ko").map((g) =>
      new Date(g.frontmatter.publishedAt).getTime(),
    );
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  test("전체 도구 중 가이드 보유 비율이 60% 이상이다 (교차링크 커버리지 하한)", () => {
    const slugs = getAllToolSlugs();
    const covered = slugs.filter((s) => getGuidesForTool(s, "ko").length > 0);
    expect(covered.length / slugs.length).toBeGreaterThanOrEqual(0.6);
  });
});

describe("toGuideLinks — 클라이언트 컴포넌트 전달용 직렬화", () => {
  test("slug/title/description/readingTime 만 담는다 (본문·toc 제외)", () => {
    const links = toGuideLinks(getGuidesForTool("subnet-calculator", "ko"));
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) {
      expect(Object.keys(l).sort()).toEqual(["description", "readingTime", "slug", "title"]);
      expect(l.title).toBeTruthy();
      expect(l.readingTime).toBeGreaterThanOrEqual(1);
    }
  });

  test("빈 입력은 빈 배열", () => {
    expect(toGuideLinks([])).toEqual([]);
  });
});
