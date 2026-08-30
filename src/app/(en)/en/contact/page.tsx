import type { Metadata } from "next";
import { generateLegalMetadata } from "@/lib/seo";
import ContactPage from "@/app/(ko)/contact/page";

export const metadata: Metadata = generateLegalMetadata("contact", "en");

export default ContactPage;
