import type { Metadata } from "next";
import {
  ToolRoute,
  toolRouteMetadata,
  toolStaticParams,
} from "@/components/layout/ToolRoute";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return toolStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return toolRouteMetadata(slug, "en");
}

export default async function EnToolPage({ params }: PageProps) {
  const { slug } = await params;
  return <ToolRoute slug={slug} locale="en" />;
}
