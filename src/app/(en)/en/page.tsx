import type { Metadata } from "next";
import { HomeContent } from "@/components/layout/HomeContent";
import { generateHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = generateHomeMetadata("en");

export default function EnHomePage() {
  return <HomeContent />;
}
