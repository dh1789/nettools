"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { AdSlot } from "./AdSlot";
import type { BlogFrontmatter } from "@/lib/blog";

interface PostSummary {
  slug: string;
  ko: { frontmatter: BlogFrontmatter; readingTime: number } | null;
  en: { frontmatter: BlogFrontmatter; readingTime: number } | null;
}

interface BlogListContentProps {
  posts: PostSummary[];
}

export function BlogListContent({ posts }: BlogListContentProps) {
  const { locale, t: tr, tf } = useLocale();

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1rem" }}>
      <AdSlot position="top" />

      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
            marginBottom: "0.5rem",
          }}
        >
          {tr(T.blogTitle)}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #666)",
            lineHeight: 1.6,
          }}
        >
          {tr(T.blogDescription)}
        </p>
      </header>

      {posts.length === 0 ? (
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #6b7280)",
            textAlign: "center",
            padding: "3rem 0",
          }}
        >
          {tr(T.blogNoPosts)}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {posts.map((post) => {
            const data = locale === "ko"
              ? (post.ko || post.en)!
              : (post.en || post.ko)!;

            const dateStr = new Date(
              data.frontmatter.publishedAt,
            ).toLocaleDateString(
              locale === "ko" ? "ko-KR" : "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            );

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  background: "var(--surface, #fff)",
                  border: "1px solid var(--border, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.125rem 0.5rem",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "var(--info-text, #1d4ed8)",
                      background: "var(--info-bg, #eff6ff)",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {data.frontmatter.category}
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
                    · {tf(T.blogReadingTime, { minutes: data.readingTime })}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--text-primary, #111)",
                    marginBottom: "0.375rem",
                    lineHeight: 1.4,
                  }}
                >
                  {data.frontmatter.title}
                </h2>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary, #6b7280)",
                    lineHeight: 1.6,
                  }}
                >
                  {data.frontmatter.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <AdSlot position="bottom" />
    </div>
  );
}
