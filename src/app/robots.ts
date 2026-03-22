import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "Google-Extended",
          "anthropic-ai",
          "ClaudeBot",
          "Bytespider",
          "PetalBot",
          "Omgilibot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
