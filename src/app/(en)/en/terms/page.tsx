import type { Metadata } from "next";
import { generateLegalMetadata } from "@/lib/seo";
import TermsPage from "@/app/(ko)/terms/page";

export const metadata: Metadata = generateLegalMetadata("terms", "en");

export default TermsPage;
