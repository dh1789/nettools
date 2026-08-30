import type { Metadata } from "next";
import { generateLegalMetadata } from "@/lib/seo";
import PrivacyPage from "@/app/(ko)/privacy/page";

export const metadata: Metadata = generateLegalMetadata("privacy", "en");

export default PrivacyPage;
