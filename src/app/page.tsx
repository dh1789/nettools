import { HomeContent } from "@/components/layout/HomeContent";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

export const metadata: Metadata = {
  title: "NetTools — 무료 네트워크 & 보안 온라인 도구 모음",
  description:
    "서브넷 계산기, DNS 조회, IP 주소 조회, SSL 인증서 확인, Base64, JSON 포매터, chmod 계산기 등 45개 이상의 무료 온라인 도구. 네트워크 엔지니어와 개발자를 위한 실용적인 도구 모음.",
  keywords:
    "서브넷 계산기, DNS 조회, IP 조회, SSL 인증서, Base64, JSON 포매터, chmod, 해시 생성기, 비밀번호 생성기, 무료 도구, 네트워크 도구",
  openGraph: {
    title: "NetTools — 무료 네트워크 & 보안 온라인 도구",
    description:
      "서브넷 계산기, DNS 조회, SSL 인증서 확인 등 45개 이상의 무료 네트워크 & 보안 도구. 19년 경력의 보안 개발자가 만든 실용적인 도구 모음.",
    type: "website",
    url: `${SITE_URL}/`,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

export default function RootPage() {
  return <HomeContent />;
}
