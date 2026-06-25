import { TOOLS, CATEGORIES } from "@/data/tools";
import { generateSitemapEntries, generateBlogSitemapEntries } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = generateSitemapEntries(TOOLS);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date("2026-06-24"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.id}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPosts = getAllPosts("ko");
  const blogEntries = generateBlogSitemapEntries(blogPosts);

  const blogListPage: MetadataRoute.Sitemap = blogPosts.length > 0
    ? [{
        url: `${SITE_URL}/blog/`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }]
    : [];

  return [
    ...staticPages,
    ...categoryPages,
    ...entries.map((entry) => ({
      url: entry.url,
      lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
      changeFrequency: "monthly" as const,
      priority: entry.priority,
    })),
    ...blogListPage,
    ...blogEntries.map((entry) => ({
      url: entry.url,
      lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
      changeFrequency: "monthly" as const,
      priority: entry.priority,
    })),
  ];
}
