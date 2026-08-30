"use client";

import { type ReactNode } from "react";
import { BlogLayout } from "./BlogLayout";
import type { BlogFrontmatter, TocItem } from "@/lib/blog";

export interface PostMeta {
  frontmatter: BlogFrontmatter;
  readingTime: number;
  toc: TocItem[];
}

interface BlogPostContentProps {
  meta: PostMeta;
  content: ReactNode;
}

/**
 * 라우트가 로케일을 결정하므로 한 로케일의 글만 받는다.
 * (이전엔 ko/en 본문을 둘 다 내려보내 클라이언트에서 골랐다 — HTML 2배, en 은 검색엔진 비가시)
 */
export function BlogPostContent({ meta, content }: BlogPostContentProps) {
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
