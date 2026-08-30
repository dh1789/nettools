import type { Metadata, MetadataRoute } from "next";
import { type Tool, type Category, type FAQ, type ToolCategory, getCategoryById } from "@/data/tools";
import type { Locale } from "./i18n";
import { t, localePath, localeFromPath } from "./i18n";
import type { BlogPost } from "./blog";
import { getCategoryOgImagePath } from "./og-image";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";
const SITE_NAME = "NetTools";
// ?v=2: 2026-06-13 한글 tofu 수정본 — X/카카오 등 이미지 URL 단위 캐시 우회용 버전
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png?v=2`;

const CATEGORY_SUBCATEGORY_MAP: Record<ToolCategory, string> = {
  network: "NetworkApplication",
  security: "SecurityApplication",
  linux: "SystemAdministration",
  developer: "DeveloperApplication",
  general: "UtilityApplication",
};

const ROBOTS_INDEX: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

const OG_LOCALE: Record<Locale, string> = { ko: "ko_KR", en: "en_US" };

// ─── 로케일 URL 헬퍼 (2026-08-30: /en/ 정적 라우트 + hreflang) ───

/** ko 기준 경로(무프리픽스, trailing slash) → 로케일별 절대 URL */
export function localeUrl(path: string, locale: Locale): string {
  return `${SITE_URL}${localePath(path, locale)}`;
}

/**
 * canonical(자기 로케일) + hreflang ko/en/x-default.
 * x-default 는 ko(1차 타겟). path 는 ko 기준 경로.
 */
export function localeAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const ko = localeUrl(path, "ko");
  const en = localeUrl(path, "en");
  return {
    canonical: locale === "en" ? en : ko,
    languages: { ko, en, "x-default": ko },
  };
}

/**
 * Generate metadata for a tool page
 */
export function generateToolMetadata(tool: Tool, locale: Locale): Metadata {
  const title = t(tool.title, locale);
  const description = t(tool.description, locale);
  const alternates = localeAlternates(`/tools/net/${tool.slug}/`, locale);
  const canonicalUrl = alternates.canonical as string;
  const ogImage = `${SITE_URL}${getCategoryOgImagePath(tool.category)}`;
  // 루트 레이아웃 title.template("%s | NetTools") 이 접미사를 붙이므로 여기선 붙이지 않는다
  // (이전엔 양쪽에서 붙여 "| NetTools | NetTools" 로 중복 — 2026-08-30 수정)
  const pageTitle =
    locale === "ko"
      ? `${title} — 무료 온라인 도구`
      : `${title} — Free Online Tool`;

  return {
    title: pageTitle,
    description,
    keywords: tool.keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE[locale],
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    alternates,
    robots: ROBOTS_INDEX,
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
  const canonicalUrl = localeUrl(`/tools/net/${tool.slug}/`, locale);

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
    screenshot: `${SITE_URL}${getCategoryOgImagePath(tool.category)}`,
    inLanguage: locale,
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
        item: localeUrl("/", locale),
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: localeUrl(`/category/${tool.category}/`, locale),
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
  const alternates = localeAlternates(`/category/${category.id}/`, locale);
  const canonicalUrl = alternates.canonical as string;
  const ogImage = `${SITE_URL}${getCategoryOgImagePath(category.id)}`;
  const pageTitle = locale === "ko" ? `${title} 도구 모음` : `${title} Tools`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: `${pageTitle} — ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE[locale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    alternates,
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
  const url = localeUrl(`/category/${category.id}/`, locale);

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: locale === "ko" ? `${title} 도구 모음` : `${title} Tools`,
        description,
        url,
        inLanguage: locale,
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
            item: localeUrl("/", locale),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: url,
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
  const alternates = localeAlternates(`/blog/${post.slug}/`, locale);
  const canonicalUrl = alternates.canonical as string;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: post.frontmatter.author || SITE_NAME }],
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: OG_LOCALE[locale],
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
    alternates,
    robots: ROBOTS_INDEX,
  };
}

/**
 * Generate JSON-LD structured data for a blog post (BlogPosting schema)
 */
export function generateBlogJsonLd(post: BlogPost, locale: Locale): string {
  const { title, description, publishedAt, updatedAt, keywords } =
    post.frontmatter;
  const canonicalUrl = localeUrl(`/blog/${post.slug}/`, locale);

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
      "@type": "Person",
      name: post.frontmatter.author || SITE_NAME,
      url: localeUrl("/about/", locale),
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
        item: localeUrl("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ko" ? "블로그" : "Blog",
        item: localeUrl("/blog/", locale),
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

// ─── 정적 페이지 메타 (홈·블로그 목록·법적 문서·루트 레이아웃) ───

const HOME_META: Record<Locale, { title: string; description: string; keywords: string; ogTitle: string; ogDescription: string }> = {
  ko: {
    title: "NetTools — 무료 네트워크 & 보안 온라인 도구 모음",
    description:
      "서브넷 계산기, DNS 조회, IP 주소 조회, SSL 인증서 확인, Base64, JSON 포매터, chmod 계산기 등 45개 이상의 무료 온라인 도구. 네트워크 엔지니어와 개발자를 위한 실용적인 도구 모음.",
    keywords:
      "서브넷 계산기, DNS 조회, IP 조회, SSL 인증서, Base64, JSON 포매터, chmod, 해시 생성기, 비밀번호 생성기, 무료 도구, 네트워크 도구",
    ogTitle: "NetTools — 무료 네트워크 & 보안 온라인 도구",
    ogDescription:
      "서브넷 계산기, DNS 조회, SSL 인증서 확인 등 45개 이상의 무료 네트워크 & 보안 도구. 19년 경력의 보안 개발자가 만든 실용적인 도구 모음.",
  },
  en: {
    title: "NetTools — Free Online Network & Security Tools",
    description:
      "Subnet calculator, DNS lookup, IP lookup, SSL certificate checker, Base64, JSON formatter, chmod calculator and 45+ free online tools for network engineers and developers.",
    keywords:
      "subnet calculator, DNS lookup, IP lookup, SSL certificate, Base64, JSON formatter, chmod, hash generator, password generator, free tools, network tools",
    ogTitle: "NetTools — Free Network & Security Tools",
    ogDescription:
      "45+ free network and security tools — subnet calculator, DNS lookup, SSL checker and more. Built by a security developer with 19 years of experience.",
  },
};

/** 홈(`/`, `/en/`) 메타 */
export function generateHomeMetadata(locale: Locale): Metadata {
  const m = HOME_META[locale];
  const alternates = localeAlternates("/", locale);
  return {
    // 브랜드 전체 제목 — 템플릿 미적용 (/en/ 홈은 레이아웃 자식 세그먼트라 템플릿이 붙으므로 absolute)
    title: { absolute: m.title },
    description: m.description,
    keywords: m.keywords,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
      url: alternates.canonical as string,
      locale: OG_LOCALE[locale],
    },
    alternates,
  };
}

const BLOG_LIST_META: Record<Locale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  ko: {
    title: "블로그 — 네트워크·보안·개발 기술 블로그",
    description:
      "네트워크, 보안, 개발 관련 기술 블로그. 실무에서 바로 쓰는 팁과 심층 가이드를 제공합니다.",
    ogTitle: "블로그 | NetTools",
    ogDescription: "네트워크, 보안, 개발 관련 기술 블로그",
  },
  en: {
    title: "Blog — Networking, Security & Development Guides",
    description:
      "Practical guides on networking, security, and development — subnetting, DNS, JWT, MTU, CSP and more, written for day-to-day engineering work.",
    ogTitle: "Blog | NetTools",
    ogDescription: "Networking, security, and development guides",
  },
};

/** 블로그 목록(`/blog/`, `/en/blog/`) 메타 */
export function generateBlogListMetadata(locale: Locale): Metadata {
  const m = BLOG_LIST_META[locale];
  const alternates = localeAlternates("/blog/", locale);
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: alternates.canonical as string,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE[locale],
    },
    alternates,
  };
}

export type LegalPage = "about" | "contact" | "privacy" | "terms";

const LEGAL_META: Record<LegalPage, Record<Locale, { title: string; description: string; ogTitle: string; ogDescription: string }>> = {
  about: {
    ko: {
      title: "소개",
      description:
        "NetTools는 19년 경력의 네트워크 보안 전문가가 만든 무료 온라인 네트워크 도구 모음입니다. 가입 없이, 추적 없이 사용할 수 있습니다.",
      ogTitle: "NetTools 소개",
      ogDescription: "19년 경력의 네트워크 보안 전문가가 만든 무료 도구 모음. 가입 없이, 추적 없이.",
    },
    en: {
      title: "About",
      description:
        "NetTools is a free collection of online network tools built by a network security professional with 19 years of experience. No signup, no tracking.",
      ogTitle: "About NetTools",
      ogDescription: "Free tools built by a network security professional with 19 years of experience. No signup, no tracking.",
    },
  },
  contact: {
    ko: {
      title: "문의",
      description:
        "NetTools 문의 안내. 버그 신고, 도구 제안, 개인정보 문의, 제휴·광고 문의 연락처를 안내합니다.",
      ogTitle: "문의 | NetTools",
      ogDescription: "NetTools에 버그 신고, 도구 제안, 제휴 문의를 보내실 수 있습니다.",
    },
    en: {
      title: "Contact",
      description:
        "How to reach NetTools: bug reports, tool requests, privacy questions, and partnership or advertising inquiries.",
      ogTitle: "Contact | NetTools",
      ogDescription: "Send bug reports, tool requests, and partnership inquiries to NetTools.",
    },
  },
  privacy: {
    ko: {
      title: "개인정보처리방침",
      description:
        "NetTools 개인정보처리방침. 사용자 데이터 처리 방식, 쿠키 사용, 광고 서비스에 대한 정보를 안내합니다.",
      ogTitle: "개인정보처리방침 | NetTools",
      ogDescription: "NetTools의 개인정보 처리 방침을 확인하세요.",
    },
    en: {
      title: "Privacy Policy",
      description:
        "NetTools privacy policy: how user data is handled, cookie usage, and third-party advertising services.",
      ogTitle: "Privacy Policy | NetTools",
      ogDescription: "Read the NetTools privacy policy.",
    },
  },
  terms: {
    ko: {
      title: "이용약관",
      description:
        "NetTools 이용약관. 서비스 이용 조건, 금지 행위, 면책 조항 등을 안내합니다.",
      ogTitle: "이용약관 | NetTools",
      ogDescription: "NetTools 서비스 이용약관을 확인하세요.",
    },
    en: {
      title: "Terms of Service",
      description:
        "NetTools terms of service: conditions of use, prohibited conduct, and disclaimers.",
      ogTitle: "Terms of Service | NetTools",
      ogDescription: "Read the NetTools terms of service.",
    },
  },
};

/** 소개·문의·개인정보·약관 메타 */
export function generateLegalMetadata(page: LegalPage, locale: Locale): Metadata {
  const m = LEGAL_META[page][locale];
  const alternates = localeAlternates(`/${page}/`, locale);
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: "website",
      url: alternates.canonical as string,
      locale: OG_LOCALE[locale],
    },
    alternates,
  };
}

const ROOT_META: Record<Locale, { defaultTitle: string; description: string; keywords: string[]; ogAlt: string }> = {
  ko: {
    defaultTitle: "NetTools — 무료 네트워크 & 보안 온라인 도구",
    description:
      "네트워크 엔지니어와 개발자를 위한 무료 온라인 도구 모음. 서브넷 계산기, DNS 조회, SSL 인증서 확인, Base64, JSON 포매터 등 45개 이상의 도구를 무료로 사용하세요.",
    keywords: [
      "네트워크 도구",
      "보안 도구",
      "서브넷 계산기",
      "DNS 조회",
      "SSL 인증서",
      "Base64",
      "JSON 포매터",
      "무료 온라인 도구",
      "개발자 도구",
      "network tools",
      "free online tools",
    ],
    ogAlt: "NetTools — 무료 네트워크 & 개발자 도구",
  },
  en: {
    defaultTitle: "NetTools — Free Network & Security Tools",
    description:
      "Free online tools for network engineers and developers: subnet calculator, DNS lookup, SSL certificate checker, Base64, JSON formatter and 45+ more.",
    keywords: [
      "network tools",
      "security tools",
      "subnet calculator",
      "DNS lookup",
      "SSL certificate",
      "Base64",
      "JSON formatter",
      "free online tools",
      "developer tools",
    ],
    ogAlt: "NetTools — Free Network & Developer Tools",
  },
};

/** 루트 레이아웃 메타 — `(ko)`/`(en)` 두 루트 레이아웃이 각자 호출 */
export function generateRootMetadata(locale: Locale): Metadata {
  const m = ROOT_META[locale];
  return {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: m.defaultTitle,
    },
    description: m.description,
    metadataBase: new URL(SITE_URL),
    keywords: m.keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: m.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_OG_IMAGE],
    },
    robots: ROBOTS_INDEX,
  };
}

// ─── 사이트맵 ───

/**
 * Generate sitemap entries for blog posts
 */
export function generateBlogSitemapEntries(
  posts: BlogPost[],
): { url: string; lastmod?: string; priority: number }[] {
  return posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
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
    { url: `${SITE_URL}/`, priority: 1.0 },
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/net/${tool.slug}/`,
      lastmod: tool.dateModified || tool.datePublished,
      priority: 0.8,
    })),
  ];
  return entries;
}

export interface SitemapSeed {
  url: string;
  lastmod?: string | Date;
  priority: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
}

/**
 * ko 기준 사이트맵 시드 → ko 엔트리 + en 트윈, 양쪽에 hreflang(alternates.languages).
 * 이미 /en/ 인 시드는 트윈을 만들지 않는다.
 */
export function localizeSitemapEntries(seeds: SitemapSeed[]): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const s of seeds) {
    const path = s.url.startsWith(SITE_URL) ? s.url.slice(SITE_URL.length) || "/" : s.url;
    const koPath = localePath(path, "ko");
    const ko = localeUrl(koPath, "ko");
    const en = localeUrl(koPath, "en");
    const languages = { ko, en, "x-default": ko };
    const common = {
      lastModified: s.lastmod ? new Date(s.lastmod) : undefined,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
      alternates: { languages },
    };
    if (localeFromPath(path) === "en") {
      out.push({ url: en, ...common });
      continue;
    }
    out.push({ url: ko, ...common });
    out.push({ url: en, ...common });
  }
  return out;
}
