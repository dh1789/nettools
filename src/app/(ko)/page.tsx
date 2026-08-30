import type { Metadata } from "next";
import { HomeContent } from "@/components/layout/HomeContent";
import { generateHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = generateHomeMetadata("ko");

export default function RootPage() {
  return <HomeContent />;
}
