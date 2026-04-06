"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { getToolBySlug } from "@/data/tools";
import { AdSlot } from "./AdSlot";
import type { TocItem } from "@/lib/blog";

interface BlogLayoutProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  category: string;
  toc: TocItem[];
  relatedTools?: string[];
  children: ReactNode;
}

function TocSection({ toc, locale }: { toc: TocItem[]; locale: "ko" | "en" }) {
  const [open, setOpen] = useState(true);
  const heading = locale === "ko" ? T.blogTableOfContents.ko : T.blogTableOfContents.en;

  if (toc.length === 0) return null;

  return (
    <nav
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-expanded={open}
        aria-label={heading}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
          }}
        >
          {heading}
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary, #6b7280)",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0.75rem 0 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
          }}
        >
          {toc.map((item, i) => (
            <li
              key={i}
              style={{
                paddingLeft: item.level === 3 ? "1rem" : "0",
              }}
            >
              <a
                href={`#${item.id}`}
                style={{
                  fontSize: item.level === 3 ? "0.8125rem" : "0.875rem",
                  color: "var(--text-secondary, #6b7280)",
                  textDecoration: "none",
                  lineHeight: 1.6,
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

function RelatedToolsSection({
  slugs,
  locale,
}: {
  slugs: string[];
  locale: "ko" | "en";
}) {
  const heading = locale === "ko" ? T.blogRelatedTools.ko : T.blogRelatedTools.en;
  const tools = slugs
    .map((s) => {
      const tool = getToolBySlug(s);
      return tool ? { slug: tool.slug, title: tool.title[locale] } : null;
    })
    .filter(Boolean) as Array<{ slug: string; title: string }>;

  if (tools.length === 0) return null;

  return (
    <section
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginTop: "1.5rem",
      }}
    >
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginBottom: "0.75rem",
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/net/${tool.slug}`}
            style={{
              display: "inline-block",
              padding: "0.5rem 0.875rem",
              fontSize: "0.875rem",
              color: "var(--info-text, #1d4ed8)",
              background: "var(--info-bg, #eff6ff)",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            {tool.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BlogLayout({
  title,
  description,
  publishedAt,
  updatedAt,
  readingTime,
  category,
  toc,
  relatedTools,
  children,
}: BlogLayoutProps) {
  const { locale, t: tr, tf } = useLocale();

  const dateStr = new Date(publishedAt).toLocaleDateString(
    locale === "ko" ? "ko-KR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1rem" }}>
      <AdSlot position="top" />

      {/* 뒤로가기 + 브레드크럼 */}
      <nav style={{ marginBottom: "1rem" }}>
        <Link
          href="/blog"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary, #6b7280)",
            textDecoration: "none",
          }}
        >
          ← {tr(T.blogBackToList)}
        </Link>
      </nav>

      {/* 헤더 */}
      <header style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0.25rem 0.625rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--info-text, #1d4ed8)",
              background: "var(--info-bg, #eff6ff)",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-tertiary, #9ca3af)",
            }}
          >
            {dateStr}
          </span>
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-tertiary, #9ca3af)",
            }}
          >
            · {tf(T.blogReadingTime, { minutes: readingTime })}
          </span>
          {updatedAt && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary, #9ca3af)",
                fontStyle: "italic",
              }}
            >
              ({locale === "ko" ? "수정" : "Updated"}: {new Date(updatedAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")})
            </span>
          )}
        </div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
            marginBottom: "0.5rem",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #666)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </header>

      {/* 목차 */}
      <TocSection toc={toc} locale={locale} />

      {/* MDX 본문 */}
      <section
        className="blog-content"
        style={{
          background: "var(--surface, #fff)",
          border: "1px solid var(--border, #e5e5e5)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          lineHeight: 1.8,
          fontSize: "1rem",
          color: "var(--text-primary, #111)",
        }}
      >
        {children}
      </section>

      {/* 관련 도구 */}
      {relatedTools && relatedTools.length > 0 && (
        <RelatedToolsSection slugs={relatedTools} locale={locale} />
      )}

      <AdSlot position="bottom" />
    </article>
  );
}
