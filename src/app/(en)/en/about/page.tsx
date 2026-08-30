import type { Metadata } from "next";
import { generateLegalMetadata } from "@/lib/seo";
import AboutPage from "@/app/(ko)/about/page";

// 본문(LegalDoc)은 ko/en 을 모두 품고 라우트 로케일로 표시 — 메타만 en 으로 교체
export const metadata: Metadata = generateLegalMetadata("about", "en");

export default AboutPage;
