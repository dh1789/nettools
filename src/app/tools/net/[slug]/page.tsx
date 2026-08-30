import { notFound } from "next/navigation";
import { getToolBySlug, getAllSlugs } from "@/data/tools";
import { ToolPageContent } from "@/components/layout/ToolPageContent";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { getGuidesForTool, toGuideLinks } from "@/lib/blog";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool, "ko");
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  const jsonLd = generateToolJsonLd(tool, "ko");
  // 빌드 시 fs 로 계산 — 도구→가이드 교차링크(2026-08-29 실측: 링크 0건이라 가이드 고아)
  const relatedGuides = {
    ko: toGuideLinks(getGuidesForTool(slug, "ko")),
    en: toGuideLinks(getGuidesForTool(slug, "en")),
  };

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
