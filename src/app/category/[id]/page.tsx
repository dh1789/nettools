import { notFound } from "next/navigation";
import { CATEGORIES, getToolsByCategory } from "@/data/tools";
import type { ToolCategory } from "@/data/tools";
import { generateCategoryMetadata, generateCategoryJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/layout/CategoryPageContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ id: cat.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) return {};
  return generateCategoryMetadata(category, "ko");
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) notFound();

  const tools = getToolsByCategory(category.id as ToolCategory);
  const jsonLd = generateCategoryJsonLd(category, "ko", tools.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <CategoryPageContent categoryId={category.id} />
    </>
  );
}
