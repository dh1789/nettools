"use client";

import { type ReactNode } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { BlogLayout } from "./BlogLayout";
import type { BlogFrontmatter, TocItem } from "@/lib/blog";

interface PostMeta {
  frontmatter: BlogFrontmatter;
  readingTime: number;
  toc: TocItem[];
}

interface BlogPostContentProps {
  koMeta: PostMeta | null;
  enMeta: PostMeta | null;
  koContent: ReactNode;
  enContent: ReactNode;
}

export function BlogPostContent({
  koMeta,
  enMeta,
  koContent,
  enContent,
}: BlogPostContentProps) {
  const { locale } = useLocale();

  const meta = locale === "ko"
    ? (koMeta || enMeta)!
    : (enMeta || koMeta)!;

  const content = locale === "ko"
    ? (koContent || enContent)
    : (enContent || koContent);

  return (
    <BlogLayout
      title={meta.frontmatter.title}
      description={meta.frontmatter.description}
      publishedAt={meta.frontmatter.publishedAt}
      updatedAt={meta.frontmatter.updatedAt}
      author={meta.frontmatter.author}
      readingTime={meta.readingTime}
      category={meta.frontmatter.category}
      toc={meta.toc}
      relatedTools={meta.frontmatter.relatedTools}
    >
      {content}
    </BlogLayout>
  );
}
