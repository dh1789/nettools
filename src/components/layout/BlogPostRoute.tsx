import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo";
import { getMdxComponents } from "@/lib/mdx-components";
import { BlogPostContent } from "./BlogPostContent";

/**
 * 가이드 상세 라우트 빌더 — 로케일별 MDX 한 편만 컴파일해 내려보낸다.
 * (이전엔 ko/en 둘 다 컴파일해 한 HTML 에 담고 클라이언트가 골랐다 — 194KB, en 검색 비가시)
 */
export function blogStaticParams(locale: Locale) {
  return getAllSlugs()
    .filter((slug) => getPostBySlug(slug, locale) !== null)
    .map((slug) => ({ slug }));
}

export function blogRouteMetadata(slug: string, locale: Locale): Metadata {
  const post = getPostBySlug(slug, locale);
  return post ? generateBlogMetadata(post, locale) : {};
}

export async function BlogPostRoute({ slug, locale }: { slug: string; locale: Locale }) {
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  // remark-gfm 없이는 마크다운 표가 파이프 문자 그대로 출력된다(2026-09-12 실측: 기존
  // 가이드 전부 표가 깨진 채 라이브에 나가 있었다 — TR-13).
  const compiled = await compileMDX({
    source: post.content,
    components: getMdxComponents(locale),
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  const jsonLd = generateBlogJsonLd(post, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <BlogPostContent
        meta={{
          frontmatter: post.frontmatter,
          readingTime: post.readingTime,
          toc: post.toc,
        }}
        content={compiled.content}
      />
    </>
  );
}
