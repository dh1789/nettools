"use client";

import { CATEGORIES, getToolsByCategory } from "@/data/tools";
import type { ToolCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { useLocale } from "@/lib/LocaleProvider";

interface CategoryPageContentProps {
  categoryId: ToolCategory;
}

export function CategoryPageContent({ categoryId }: CategoryPageContentProps) {
  const { locale } = useLocale();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  const tools = getToolsByCategory(categoryId);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>{category.icon}</span>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary, #111)",
            }}
          >
            {category.title[locale]}
          </h1>
        </div>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #6b7280)",
            lineHeight: 1.6,
          }}
        >
          {category.description[locale]}
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.5rem",
          }}
        >
          {locale === "ko" ? `${tools.length}개 도구` : `${tools.length} tools`}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            title={tool.title[locale]}
            description={tool.description[locale]}
          />
        ))}
      </div>
    </main>
  );
}
