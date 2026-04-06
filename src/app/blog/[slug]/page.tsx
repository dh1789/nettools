import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { BlogPostContent } from "@/components/layout/BlogPostContent";
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo";
import { mdxComponents } from "@/lib/mdx-components";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "ko") || getPostBySlug(slug, "en");
  if (!post) return {};
  return generateBlogMetadata(post, "ko");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const koPost = getPostBySlug(slug, "ko");
  const enPost = getPostBySlug(slug, "en");

  if (!koPost && !enPost) notFound();

  const koCompiled = koPost
    ? await compileMDX({
        source: koPost.content,
        components: mdxComponents,
      })
    : null;

  const enCompiled = enPost
    ? await compileMDX({
        source: enPost.content,
        components: mdxComponents,
      })
    : null;

  const primaryPost = koPost || enPost!;
  const jsonLd = generateBlogJsonLd(primaryPost, "ko");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <BlogPostContent
        koMeta={
          koPost
            ? {
                frontmatter: koPost.frontmatter,
                readingTime: koPost.readingTime,
                toc: koPost.toc,
              }
            : null
        }
        enMeta={
          enPost
            ? {
                frontmatter: enPost.frontmatter,
                readingTime: enPost.readingTime,
                toc: enPost.toc,
              }
            : null
        }
        koContent={koCompiled?.content ?? null}
        enContent={enCompiled?.content ?? null}
      />
    </>
  );
}
