import type { Metadata } from "next";
import { type Tool, type Category, type FAQ, type ToolCategory, getCategoryById } from "@/data/tools";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { BlogPost } from "./blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";
const SITE_NAME = "NetTools";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const CATEGORY_SUBCATEGORY_MAP: Record<ToolCategory, string> = {
  network: "NetworkApplication",
  security: "SecurityApplication",
  linux: "SystemAdministration",
  developer: "DeveloperApplication",
  general: "UtilityApplication",
};

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
    "@type": ["WebApplication", "SoftwareApplication"],
    "@id": `${canonicalUrl}#webapp`,
    name: title,
    description,
    url: canonicalUrl,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: CATEGORY_SUBCATEGORY_MAP[tool.category],
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    screenshot: DEFAULT_OG_IMAGE,
    inLanguage: ["ko", "en"],
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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

  if (tool.usageExamples && tool.usageExamples.length > 0) {
    for (const example of tool.usageExamples) {
      const howTo = {
        "@type": "HowTo" as const,
        "@id": `${canonicalUrl}#howto-${tool.usageExamples.indexOf(example)}`,
        name: t(example.title, locale),
        description: t(example.scenario, locale),
        step: example.steps.map((step, i) => ({
          "@type": "HowToStep" as const,
          position: i + 1,
          text: t(step, locale),
        })),
      };
      graph.push(howTo);
    }
  } else if (tool.howTo && tool.howTo.steps.length > 0) {
    const howToName = locale === "ko"
      ? `${title} 사용법`
      : `How to use ${title}`;
    const howTo = {
      "@type": "HowTo" as const,
      "@id": `${canonicalUrl}#howto`,
      name: howToName,
      step: tool.howTo.steps.map((step, i) => ({
        "@type": "HowToStep" as const,
        position: i + 1,
        text: t(step, locale),
      })),
    };
    graph.push(howTo);
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
 * Generate metadata for a blog post
 */
export function generateBlogMetadata(
  post: BlogPost,
  locale: Locale,
): Metadata {
  const { title, description, keywords, publishedAt } = post.frontmatter;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: post.frontmatter.author || SITE_NAME }],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      publishedTime: publishedAt,
      ...(post.frontmatter.updatedAt && {
        modifiedTime: post.frontmatter.updatedAt,
      }),
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
 * Generate JSON-LD structured data for a blog post (BlogPosting schema)
 */
export function generateBlogJsonLd(post: BlogPost, locale: Locale): string {
  const { title, description, publishedAt, updatedAt, keywords } =
    post.frontmatter;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: title,
    description,
    url: canonicalUrl,
    inLanguage: locale,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    keywords: keywords.join(", "),
    author: {
      "@type": "Organization",
      name: post.frontmatter.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
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
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ko" ? "블로그" : "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [blogPosting, breadcrumb],
  });
}

/**
 * Generate sitemap entries for blog posts
 */
export function generateBlogSitemapEntries(
  posts: BlogPost[],
): { url: string; lastmod?: string; priority: number }[] {
  return posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.frontmatter.updatedAt || post.frontmatter.publishedAt,
    priority: 0.7,
  }));
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
