import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getToolsByCategory } from "@/data/tools";
import type { ToolCategory } from "@/data/tools";
import type { Locale } from "@/lib/i18n";
import { generateCategoryMetadata, generateCategoryJsonLd } from "@/lib/seo";
import { CategoryPageContent } from "./CategoryPageContent";

/** 카테고리 라우트 빌더 — `(ko)/category/[id]` 와 `(en)/en/category/[id]` 공유 */
export function categoryStaticParams() {
  return CATEGORIES.map((cat) => ({ id: cat.id }));
}

export function categoryRouteMetadata(id: string, locale: Locale): Metadata {
  const category = CATEGORIES.find((c) => c.id === id);
  return category ? generateCategoryMetadata(category, locale) : {};
}

export function CategoryRoute({ id, locale }: { id: string; locale: Locale }) {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) notFound();

  const tools = getToolsByCategory(category.id as ToolCategory);
  const jsonLd = generateCategoryJsonLd(category, locale, tools.length);

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
