import { notFound } from "next/navigation";
import { getToolBySlug, getAllSlugs } from "@/data/tools";
import { ToolPageContent } from "@/components/layout/ToolPageContent";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
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
  return generateToolMetadata(tool, "en");
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  const jsonLd = generateToolJsonLd(tool, "en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ToolPageContent tool={tool} />
    </>
  );
}
