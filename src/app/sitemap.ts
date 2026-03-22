import { TOOLS } from "@/data/tools";
import { generateSitemapEntries } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = generateSitemapEntries(TOOLS);

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
    changeFrequency: "monthly" as const,
    priority: entry.priority,
  }));
}
