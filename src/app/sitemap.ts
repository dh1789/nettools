import { TOOLS, CATEGORIES } from "@/data/tools";
import {
  generateSitemapEntries,
  generateBlogSitemapEntries,
  localizeSitemapEntries,
  type SitemapSeed,
} from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

/**
 * ko 기준 시드를 만들고 localizeSitemapEntries 가 /en/ 트윈 + hreflang 을 붙인다.
 * 모든 URL 은 trailing slash 포함(TR-3). 결과 엔트리 수 = 시드 × 2.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: SitemapSeed[] = [
    { url: `${SITE_URL}/about/`, lastmod: "2026-06-30", changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact/`, lastmod: "2026-06-24", changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy/`, lastmod: "2026-06-28", changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms/`, lastmod: "2026-06-30", changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: SitemapSeed[] = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.id}/`,
    lastmod: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolPages: SitemapSeed[] = generateSitemapEntries(TOOLS).map((e) => ({
    url: e.url,
    lastmod: e.lastmod ?? now,
    changeFrequency: "monthly",
    priority: e.priority,
  }));

  const blogPosts = getAllPosts("ko");
  const blogListPage: SitemapSeed[] = blogPosts.length > 0
    ? [{ url: `${SITE_URL}/blog/`, lastmod: now, changeFrequency: "weekly", priority: 0.7 }]
    : [];
  const blogPages: SitemapSeed[] = generateBlogSitemapEntries(blogPosts).map((e) => ({
    url: e.url,
    lastmod: e.lastmod ?? now,
    changeFrequency: "monthly",
    priority: e.priority,
  }));

  return localizeSitemapEntries([
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...blogListPage,
    ...blogPages,
  ]);
}
