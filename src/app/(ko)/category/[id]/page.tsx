import type { Metadata } from "next";
import {
  CategoryRoute,
  categoryRouteMetadata,
  categoryStaticParams,
} from "@/components/layout/CategoryRoute";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categoryStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return categoryRouteMetadata(id, "ko");
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryRoute id={id} locale="ko" />;
}
