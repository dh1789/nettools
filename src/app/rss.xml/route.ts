import { getAllPosts, generateRssXml } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

export const dynamic = "force-static";

export function GET() {
  const xml = generateRssXml(getAllPosts("ko"), SITE_URL);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
