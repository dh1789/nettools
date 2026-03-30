import type { Metadata } from "next";
import { LocaleProvider } from "@/lib/LocaleProvider";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beomanro.com";

export const metadata: Metadata = {
  title: {
    template: "%s | NetTools",
    default: "NetTools — 무료 네트워크 & 보안 온라인 도구",
  },
  description:
    "네트워크 엔지니어와 개발자를 위한 무료 온라인 도구 모음. 서브넷 계산기, DNS 조회, SSL 인증서 확인, Base64, JSON 포매터 등 18개 이상의 도구를 무료로 사용하세요.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "네트워크 도구",
    "보안 도구",
    "서브넷 계산기",
    "DNS 조회",
    "SSL 인증서",
    "Base64",
    "JSON 포매터",
    "무료 온라인 도구",
    "개발자 도구",
    "network tools",
    "free online tools",
  ].join(", "),
  authors: [{ name: "NetTools" }],
  openGraph: {
    type: "website",
    siteName: "NetTools",
    locale: "ko_KR",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NetTools — 무료 네트워크 & 보안 도구",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense — publisher ID는 에드센스 승인 후 NEXT_PUBLIC_ADSENSE_ID 환경변수로 설정 */}
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --text-primary: #111827;
                --text-secondary: #6b7280;
                --text-tertiary: #9ca3af;
                --surface: #ffffff;
                --background: #f9fafb;
                --border: #e5e7eb;
                --border-light: #f3f4f6;
                --input-bg: #f9fafb;
                --result-bg: #f0fdf4;
                --info-bg: #eff6ff;
                --success-bg: #f0fdf4;
                --warn-bg: #fffbeb;
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --text-primary: #f9fafb;
                  --text-secondary: #9ca3af;
                  --text-tertiary: #6b7280;
                  --surface: #1f2937;
                  --background: #111827;
                  --border: #374151;
                  --border-light: #1f2937;
                  --input-bg: #1f2937;
                  --result-bg: #064e3b20;
                  --info-bg: #1e3a5f30;
                  --success-bg: #064e3b20;
                  --warn-bg: #78350f20;
                }
              }
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                  Roboto, "Helvetica Neue", Arial, sans-serif;
                background: var(--background);
                color: var(--text-primary);
                line-height: 1.6;
                -webkit-font-smoothing: antialiased;
              }
              a { color: inherit; }
              input[type="text"], input[type="number"] {
                color: var(--text-primary);
                background: var(--input-bg);
                border-color: var(--border);
              }
              input[type="text"]:focus, input[type="number"]:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
              }
              @keyframes slideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `,
          }}
        />
      </head>
      <body>
        <LocaleProvider>
          <ClientHeader />
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <ClientFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
