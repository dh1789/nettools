import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAllSlugs } from "@/data/tools";
import type { Locale } from "@/lib/i18n";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { getGuidesForTool, toGuideLinks } from "@/lib/blog";
import { ToolPageContent } from "./ToolPageContent";

/**
 * 도구 페이지 라우트 빌더 — `app/(ko)/tools/net/[slug]` 와 `app/(en)/en/tools/net/[slug]` 가
 * 로케일만 달리해 공유한다. 서버 컴포넌트(fs 로 관련 가이드 계산).
 */
export function toolStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function toolRouteMetadata(slug: string, locale: Locale): Metadata {
  const tool = getToolBySlug(slug);
  return tool ? generateToolMetadata(tool, locale) : {};
}

export function ToolRoute({ slug, locale }: { slug: string; locale: Locale }) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = generateToolJsonLd(tool, locale);
  // 도구→가이드 교차링크 (2026-08-29 실측: 링크 0건이라 가이드 고아)
  const relatedGuides = toGuideLinks(getGuidesForTool(slug, locale));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ToolPageContent tool={tool} relatedGuides={relatedGuides} />
    </>
  );
}
