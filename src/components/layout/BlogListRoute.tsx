import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { BlogListContent } from "./BlogListContent";

/**
 * 가이드 목록 라우트 빌더 — ko/en 요약(frontmatter 만)을 함께 넘기고
 * BlogListContent 가 라우트 로케일에 맞는 쪽을 표시한다.
 */
export function BlogListRoute() {
  const slugs = getAllSlugs();

  const posts = slugs.map((slug) => {
    const ko = getPostBySlug(slug, "ko");
    const en = getPostBySlug(slug, "en");
    return {
      slug,
      ko: ko
        ? { frontmatter: ko.frontmatter, readingTime: ko.readingTime }
        : null,
      en: en
        ? { frontmatter: en.frontmatter, readingTime: en.readingTime }
        : null,
    };
  });

  // 최신순 정렬 (ko 우선, 없으면 en)
  posts.sort((a, b) => {
    const dateA = (a.ko || a.en)!.frontmatter.publishedAt;
    const dateB = (b.ko || b.en)!.frontmatter.publishedAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return <BlogListContent posts={posts} />;
}
