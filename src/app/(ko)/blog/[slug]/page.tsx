import type { Metadata } from "next";
import {
  BlogPostRoute,
  blogRouteMetadata,
  blogStaticParams,
} from "@/components/layout/BlogPostRoute";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogStaticParams("ko");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return blogRouteMetadata(slug, "ko");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostRoute slug={slug} locale="ko" />;
}
