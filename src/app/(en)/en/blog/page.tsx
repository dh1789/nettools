import type { Metadata } from "next";
import { BlogListRoute } from "@/components/layout/BlogListRoute";
import { generateBlogListMetadata } from "@/lib/seo";

export const metadata: Metadata = generateBlogListMetadata("en");

export default function EnBlogPage() {
  return <BlogListRoute />;
}
