import type { Metadata } from "next";
import { type Tool, type Category, getCategoryById } from "@/data/tools";
import type { Locale } from "./i18n";
import { t } from "./i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.example.com";

/**
 * Generate metadata for a tool page
 */
export function generateToolMetadata(tool: Tool, locale: Locale): Metadata {
  const title = t(tool.title, locale);
  const description = t(tool.description, locale);
  const category = getCategoryById(tool.category);
  const categoryName = category ? t(category.title, locale) : "";

  return {
    title: `${title} | NetTools`,
    description,
    keywords: tool.keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      siteName: "NetTools",
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    alternates: {
      canonical: `${SITE_URL}/tools/${tool.slug}`,
      languages: {
        ko: `${SITE_URL}/ko/tools/${tool.slug}`,
        en: `${SITE_URL}/en/tools/${tool.slug}`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for a tool
 * (Helps with Google rich results)
 */
export function generateToolJsonLd(tool: Tool, locale: Locale): string {
  const title = t(tool.title, locale);
  const description = t(tool.description, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(tool.datePublished && { datePublished: tool.datePublished }),
    ...(tool.dateModified && { dateModified: tool.dateModified }),
  };

  return JSON.stringify(jsonLd);
}

/**
 * Generate metadata for a category page
 */
export function generateCategoryMetadata(
  category: Category,
  locale: Locale,
): Metadata {
  const title = t(category.title, locale);
  const description = t(category.description, locale);

  return {
    title: `${title} | NetTools`,
    description,
    openGraph: {
      title: `${title} - NetTools`,
      description,
      url: `${SITE_URL}/category/${category.id}`,
      siteName: "NetTools",
    },
  };
}

/**
 * Generate sitemap entries for all tools
 */
export function generateSitemapEntries(
  tools: Tool[],
): { url: string; lastmod?: string; priority: number }[] {
  const entries = [
    { url: SITE_URL, priority: 1.0 },
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastmod: tool.dateModified || tool.datePublished,
      priority: 0.8,
    })),
  ];
  return entries;
}
