import { HomeContent } from "@/components/layout/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetTools — Free Network & Security Tools",
  description:
    "Free online tools for network engineers and security professionals. Subnet calculator, MAC OUI lookup, CIDR converter, and more.",
  openGraph: {
    title: "NetTools — Free Network & Security Tools",
    description: "Practical tools built by a 19-year security developer.",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
