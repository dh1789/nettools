import { notFound } from "next/navigation";
import { getToolBySlug, getAllSlugs } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 정적 빌드 시 모든 도구 페이지 사전 생성
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// SEO 메타데이터 자동 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool, "en");
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  const Component = TOOL_COMPONENTS[tool.component];
  if (!Component) notFound();

  const jsonLd = generateToolJsonLd(tool, "en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ToolLayout title={tool.title.en} description={tool.description.en}>
        <Component />
      </ToolLayout>
    </>
  );
}
