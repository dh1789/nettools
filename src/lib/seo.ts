import type { Metadata } from "next";
import { type Tool, type Category, type FAQ, getCategoryById } from "@/data/tools";
import type { Locale } from "./i18n";
import { t } from "./i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";
const SITE_NAME = "NetTools";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate metadata for a tool page
 */
export function generateToolMetadata(tool: Tool, locale: Locale): Metadata {
  const title = t(tool.title, locale);
  const description = t(tool.description, locale);
  const canonicalUrl = `${SITE_URL}/tools/net/${tool.slug}`;

  return {
    title: `${title} — 무료 온라인 도구 | ${SITE_NAME}`,
    description,
    keywords: tool.keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for a tool
 * Includes WebApplication + BreadcrumbList + FAQPage schemas
 */
export function generateToolJsonLd(tool: Tool, locale: Locale): string {
  const title = t(tool.title, locale);
  const description = t(tool.description, locale);
  const category = getCategoryById(tool.category);
  const categoryName = category ? t(category.title, locale) : "";
  const canonicalUrl = `${SITE_URL}/tools/net/${tool.slug}`;

  const webApp = {
    "@type": "WebApplication",
    "@id": `${canonicalUrl}#webapp`,
    name: title,
    description,
    url: canonicalUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: ["ko", "en"],
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(tool.datePublished && { datePublished: tool.datePublished }),
    ...(tool.dateModified && { dateModified: tool.dateModified }),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: `${SITE_URL}/category/${tool.category}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  const graph: object[] = [webApp, breadcrumb];

  if (tool.faqs && tool.faqs.length > 0) {
    const faqPage = {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: tool.faqs.map((faq: FAQ) => ({
        "@type": "Question",
        name: t(faq.question, locale),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(faq.answer, locale),
        },
      })),
    };
    graph.push(faqPage);
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
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
  const canonicalUrl = `${SITE_URL}/category/${category.id}`;

  return {
    title: `${title} 도구 모음 | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} 도구 모음 — ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} 도구 모음 | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate JSON-LD for category pages
 */
export function generateCategoryJsonLd(
  category: Category,
  locale: Locale,
  toolCount: number,
): string {
  const title = t(category.title, locale);
  const description = t(category.description, locale);

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${title} 도구 모음`,
        description,
        url: `${SITE_URL}/category/${category.id}`,
        numberOfItems: toolCount,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: `${SITE_URL}/category/${category.id}`,
          },
        ],
      },
    ],
  });
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
      url: `${SITE_URL}/tools/net/${tool.slug}`,
      lastmod: tool.dateModified || tool.datePublished,
      priority: 0.8,
    })),
  ];
  return entries;
}
