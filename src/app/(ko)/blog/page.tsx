import type { Metadata } from "next";
import { BlogListRoute } from "@/components/layout/BlogListRoute";
import { generateBlogListMetadata } from "@/lib/seo";

export const metadata: Metadata = generateBlogListMetadata("ko");

export default function BlogPage() {
  return <BlogListRoute />;
}
