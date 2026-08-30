import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { generateRootMetadata } from "@/lib/seo";

// 한국어 루트 레이아웃 — 무프리픽스 경로(`/`, `/blog/`, `/tools/net/...`).
// 영어는 `app/(en)/layout.tsx` 가 `/en/...` 을 담당한다(루트 레이아웃 2개, TR-10).
export const metadata: Metadata = generateRootMetadata("ko");

export default function KoRootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="ko">{children}</SiteShell>;
}
