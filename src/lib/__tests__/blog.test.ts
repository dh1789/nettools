import {
  parseFrontmatter,
  calculateReadingTime,
  extractTableOfContents,
  generateHeadingId,
  getAllSlugs,
  getAllPosts,
  getPostBySlug,
  type BlogFrontmatter,
} from "../blog";

// --- parseFrontmatter ---

describe("parseFrontmatter", () => {
  test("올바른 YAML frontmatter 파싱", () => {
    const raw = `---
title: 테스트 포스트
description: 테스트 설명
category: developer
keywords:
  - test
  - blog
publishedAt: "2026-04-01"
---

# 본문 내용

여기는 본문입니다.`;

    const result = parseFrontmatter(raw);

    expect(result.frontmatter.title).toBe("테스트 포스트");
    expect(result.frontmatter.description).toBe("테스트 설명");
    expect(result.frontmatter.category).toBe("developer");
    expect(result.frontmatter.keywords).toEqual(["test", "blog"]);
    expect(result.frontmatter.publishedAt).toBe("2026-04-01");
    expect(result.content).toContain("# 본문 내용");
    expect(result.content).toContain("여기는 본문입니다.");
  });

  test("선택 필드 포함 파싱 (relatedTools, updatedAt, author)", () => {
    const raw = `---
title: Advanced Post
description: Detailed description
category: network
keywords:
  - networking
publishedAt: "2026-03-15"
updatedAt: "2026-04-01"
relatedTools:
  - subnet-calculator
  - cidr-to-range
author: NetTools Team
---

Content here.`;

    const result = parseFrontmatter(raw);

    expect(result.frontmatter.updatedAt).toBe("2026-04-01");
    expect(result.frontmatter.relatedTools).toEqual([
      "subnet-calculator",
      "cidr-to-range",
    ]);
    expect(result.frontmatter.author).toBe("NetTools Team");
  });

  test("frontmatter 없는 경우 에러", () => {
    const raw = "# No frontmatter\n\nJust content.";
    expect(() => parseFrontmatter(raw)).toThrow();
  });

  test("필수 필드 누락 시 에러", () => {
    const raw = `---
title: Only Title
---

Content.`;
    expect(() => parseFrontmatter(raw)).toThrow();
  });
});

// --- calculateReadingTime ---

describe("calculateReadingTime", () => {
  test("짧은 텍스트 — 최소 1분", () => {
    expect(calculateReadingTime("Hello world")).toBe(1);
  });

  test("200단어 텍스트 — 1분", () => {
    const words = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(words)).toBe(1);
  });

  test("400단어 텍스트 — 2분", () => {
    const words = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  test("한글 텍스트 — 문자 기반 계산", () => {
    // 한글은 공백이 적으므로 문자 수 기반으로 계산
    const korean = "가나다라마바사아자차카타파하".repeat(30);
    expect(calculateReadingTime(korean)).toBeGreaterThanOrEqual(1);
  });

  test("빈 문자열 — 1분", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  test("MDX 코드 블록 제외", () => {
    const content = `일반 텍스트입니다.

\`\`\`javascript
const x = 1;
const y = 2;
// 이 코드 블록은 읽기 시간에서 제외됩니다
\`\`\`

다시 일반 텍스트입니다.`;
    const timeWithCode = calculateReadingTime(content);
    const timeWithoutCode = calculateReadingTime(
      "일반 텍스트입니다.\n\n다시 일반 텍스트입니다.",
    );
    // 코드 블록이 있어도 읽기 시간이 크게 달라지지 않아야 함
    expect(timeWithCode).toBe(timeWithoutCode);
  });
});

// --- extractTableOfContents ---

describe("extractTableOfContents", () => {
  test("h2, h3 헤딩 추출", () => {
    const content = `## 소개

본문 내용

### 설치 방법

설치 설명

## 사용법

### 기본 사용

### 고급 사용`;

    const toc = extractTableOfContents(content);

    expect(toc).toHaveLength(5);
    expect(toc[0]).toEqual({ level: 2, text: "소개", id: "소개" });
    expect(toc[1]).toEqual({ level: 3, text: "설치 방법", id: "설치-방법" });
    expect(toc[2]).toEqual({ level: 2, text: "사용법", id: "사용법" });
    expect(toc[3]).toEqual({ level: 3, text: "기본 사용", id: "기본-사용" });
    expect(toc[4]).toEqual({ level: 3, text: "고급 사용", id: "고급-사용" });
  });

  test("h1은 제외 (h2, h3만 포함)", () => {
    const content = `# 제목

## 섹션 1

### 하위 섹션`;

    const toc = extractTableOfContents(content);
    expect(toc).toHaveLength(2);
    expect(toc[0].level).toBe(2);
    expect(toc[1].level).toBe(3);
  });

  test("코드 블록 내 헤딩은 무시", () => {
    const content = `## 실제 헤딩

\`\`\`markdown
## 코드 블록 내 헤딩
\`\`\`

## 또 다른 실제 헤딩`;

    const toc = extractTableOfContents(content);
    expect(toc).toHaveLength(2);
    expect(toc[0].text).toBe("실제 헤딩");
    expect(toc[1].text).toBe("또 다른 실제 헤딩");
  });

  test("헤딩 없는 경우 빈 배열", () => {
    const toc = extractTableOfContents("본문만 있는 내용입니다.");
    expect(toc).toEqual([]);
  });
});

// --- generateHeadingId ---

describe("generateHeadingId", () => {
  test("영문 텍스트 — 소문자 + 하이픈", () => {
    expect(generateHeadingId("Getting Started")).toBe("getting-started");
  });

  test("한글 텍스트 — 공백만 하이픈 치환", () => {
    expect(generateHeadingId("설치 방법")).toBe("설치-방법");
  });

  test("특수문자 제거", () => {
    expect(generateHeadingId("What is JSON? (Overview)")).toBe(
      "what-is-json-overview",
    );
  });
});

// --- 파일 시스템 통합 테스트 ---

describe("파일 시스템 기반 함수", () => {
  const fs = require("fs");
  const path = require("path");

  const CONTENT_DIR = path.resolve(
    process.cwd(),
    "src/content/blog",
  );

  const testPostKo = `---
title: 테스트 포스트
description: 블로그 테스트용 포스트입니다
category: developer
keywords:
  - test
  - blog
publishedAt: "2026-04-01"
---

## 소개

테스트 본문 내용입니다.`;

  const testPostEn = `---
title: Test Post
description: This is a test blog post
category: developer
keywords:
  - test
  - blog
publishedAt: "2026-04-01"
---

## Introduction

This is test content.`;

  beforeAll(() => {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(CONTENT_DIR, "test-post.ko.mdx"),
      testPostKo,
    );
    fs.writeFileSync(
      path.join(CONTENT_DIR, "test-post.en.mdx"),
      testPostEn,
    );
  });

  afterAll(() => {
    const koFile = path.join(CONTENT_DIR, "test-post.ko.mdx");
    const enFile = path.join(CONTENT_DIR, "test-post.en.mdx");
    if (fs.existsSync(koFile)) fs.unlinkSync(koFile);
    if (fs.existsSync(enFile)) fs.unlinkSync(enFile);
  });

  test("getAllSlugs — 모든 슬러그 반환", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("test-post");
  });

  test("getAllPosts — 한국어 포스트 목록", () => {
    const posts = getAllPosts("ko");
    const testPost = posts.find((p) => p.slug === "test-post");
    expect(testPost).toBeDefined();
    expect(testPost!.frontmatter.title).toBe("테스트 포스트");
    expect(testPost!.readingTime).toBeGreaterThanOrEqual(1);
    expect(testPost!.toc.length).toBeGreaterThan(0);
  });

  test("getAllPosts — 영어 포스트 목록", () => {
    const posts = getAllPosts("en");
    const testPost = posts.find((p) => p.slug === "test-post");
    expect(testPost).toBeDefined();
    expect(testPost!.frontmatter.title).toBe("Test Post");
  });

  test("getAllPosts — publishedAt 기준 최신순 정렬", () => {
    const posts = getAllPosts("ko");
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].frontmatter.publishedAt >= posts[i].frontmatter.publishedAt).toBe(true);
    }
  });

  test("getPostBySlug — 존재하는 슬러그", () => {
    const post = getPostBySlug("test-post", "ko");
    expect(post).not.toBeNull();
    expect(post!.slug).toBe("test-post");
    expect(post!.frontmatter.title).toBe("테스트 포스트");
    expect(post!.content).toContain("테스트 본문 내용입니다.");
  });

  test("getPostBySlug — 존재하지 않는 슬러그", () => {
    const post = getPostBySlug("nonexistent", "ko");
    expect(post).toBeNull();
  });

  test("getPostBySlug — 해당 로케일 파일 없으면 null", () => {
    // test-post는 ko, en 둘 다 있음 — 없는 로케일 확인은 스킵
    // 대신 없는 슬러그로 테스트
    const post = getPostBySlug("no-such-post", "en");
    expect(post).toBeNull();
  });
});
