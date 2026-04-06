import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { BlogListContent } from "@/components/layout/BlogListContent";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

export const metadata: Metadata = {
  title: "블로그 — 네트워크·보안·개발 기술 블로그 | NetTools",
  description:
    "네트워크, 보안, 개발 관련 기술 블로그. 실무에서 바로 쓰는 팁과 심층 가이드를 제공합니다.",
  openGraph: {
    title: "블로그 | NetTools",
    description: "네트워크, 보안, 개발 관련 기술 블로그",
    url: `${SITE_URL}/blog`,
    siteName: "NetTools",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
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
