import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { generateRootMetadata } from "@/lib/seo";

// 영어 루트 레이아웃 — `/en/...` 경로. `<html lang="en">` + 영어 메타 + LocaleProvider("en").
export const metadata: Metadata = generateRootMetadata("en");

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
