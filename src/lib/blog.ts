/**
 * Blog MDX Processing Pipeline
 * ─────────────────────────────
 * MDX 파일 읽기/파싱, frontmatter 추출, 읽기 시간 계산, 목차 생성
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Locale } from "./i18n";

// --- 타입 정의 ---

export interface BlogFrontmatter {
  title: string;
  description: string;
  category: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  relatedTools?: string[];
  author?: string;
}

export interface BlogPost {
  slug: string;
  locale: Locale;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
  toc: TocItem[];
}

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

const CONTENT_DIR = path.resolve(process.cwd(), "src/content/blog");
const REQUIRED_FIELDS: (keyof BlogFrontmatter)[] = [
  "title",
  "description",
  "category",
  "keywords",
  "publishedAt",
];

// --- 순수 함수 ---

/**
 * MDX 원본에서 YAML frontmatter와 본문을 분리하여 파싱한다.
 */
export function parseFrontmatter(raw: string): {
  frontmatter: BlogFrontmatter;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Frontmatter not found: 파일이 --- 로 시작해야 합니다");
  }

  const parsed = yaml.load(match[1]) as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (parsed[field] === undefined || parsed[field] === null) {
      throw new Error(`필수 frontmatter 필드 누락: ${field}`);
    }
  }

  const frontmatter: BlogFrontmatter = {
    title: String(parsed.title),
    description: String(parsed.description),
    category: String(parsed.category),
    keywords: Array.isArray(parsed.keywords)
      ? parsed.keywords.map(String)
      : [],
    publishedAt: String(parsed.publishedAt),
    ...(parsed.updatedAt && { updatedAt: String(parsed.updatedAt) }),
    ...(parsed.relatedTools &&
      Array.isArray(parsed.relatedTools) && {
        relatedTools: parsed.relatedTools.map(String),
      }),
    ...(parsed.author && { author: String(parsed.author) }),
  };

  return { frontmatter, content: match[2].trim() };
}

/**
 * 텍스트 기반 읽기 시간 계산 (분 단위, 최소 1분).
 * 코드 블록은 제외한다.
 */
export function calculateReadingTime(content: string): number {
  // 코드 블록 제거
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");

  // 영문 단어 수
  const englishWords = withoutCode.match(/[a-zA-Z]+/g) || [];

  // 한글 문자 수 (한글은 분당 약 500자)
  const koreanChars = (withoutCode.match(/[가-힣]/g) || []).length;

  const englishMinutes = englishWords.length / 200;
  const koreanMinutes = koreanChars / 500;
  const totalMinutes = englishMinutes + koreanMinutes;

  return Math.max(1, Math.round(totalMinutes));
}

/**
 * MDX 본문에서 h2, h3 헤딩을 추출하여 목차를 생성한다.
 * 코드 블록 내 헤딩은 무시한다.
 */
export function extractTableOfContents(content: string): TocItem[] {
  // 코드 블록 제거
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];

  let match;
  while ((match = headingRegex.exec(withoutCode)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    toc.push({ level, text, id: generateHeadingId(text) });
  }

  return toc;
}

/**
 * 헤딩 텍스트를 URL-safe ID로 변환한다.
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// --- 파일 시스템 함수 ---

/**
 * src/content/blog/ 디렉토리에서 모든 고유 슬러그를 반환한다.
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR);
  const slugs = new Set<string>();

  for (const file of files) {
    const match = file.match(/^(.+)\.(ko|en)\.mdx$/);
    if (match) slugs.add(match[1]);
  }

  return Array.from(slugs);
}

/**
 * 지정 로케일의 모든 블로그 포스트를 최신순으로 반환한다.
 */
export function getAllPosts(locale: Locale): BlogPost[] {
  const slugs = getAllSlugs();
  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    const post = getPostBySlug(slug, locale);
    if (post) posts.push(post);
  }

  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime(),
  );

  return posts;
}

/**
 * 특정 슬러그와 로케일의 블로그 포스트를 반환한다.
 * 해당 파일이 없으면 null.
 */
export function getPostBySlug(
  slug: string,
  locale: Locale,
): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, content } = parseFrontmatter(raw);

  return {
    slug,
    locale,
    frontmatter,
    content,
    readingTime: calculateReadingTime(content),
    toc: extractTableOfContents(content),
  };
}
