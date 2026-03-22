"use client";

import { TOOLS, CATEGORIES, getToolsByCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

export function HomeContent() {
  const { locale, tf } = useLocale();

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "var(--text-primary, #111)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          NetTools
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary, #6b7280)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {tf(T.heroSubtitle, {})}
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.5rem",
          }}
        >
          {tf(T.toolsAvailable, { count: TOOLS.length })}
        </p>
      </section>

      {/* Categories + Tools */}
      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id);
        if (tools.length === 0) return null;

        return (
          <section key={category.id} style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{category.icon}</span>
              {category.title[locale]}
            </h2>

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
          </section>
        );
      })}
    </main>
  );
}
