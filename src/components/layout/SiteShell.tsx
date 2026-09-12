import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/LocaleProvider";
import { ClientHeader } from "./ClientHeader";
import { ClientFooter } from "./ClientFooter";
import { SidebarLayout } from "./SidebarLayout";

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

/**
 * 두 루트 레이아웃(`app/(ko)/layout.tsx`, `app/(en)/layout.tsx`)이 공유하는 문서 껍데기.
 * `<html lang>` 과 LocaleProvider 초기 로케일을 라우트 그룹이 결정한다 — 정적 HTML 의
 * 언어와 메타데이터·본문 언어가 항상 일치해야 한다(TR-7).
 */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* 루트 레이아웃 전용 컴포넌트 — App Router 루트 레이아웃의 <head> 는 정상 (규칙은 pages/ 관습 기준) */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Google Search Console 인증 — NEXT_PUBLIC_GSC_VERIFICATION 환경변수로 설정 */}
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
        {/* Naver Search Advisor 소유확인 */}
        <meta
          name="naver-site-verification"
          content="a65d425fb21c66df74e8c041c77d36dfb54248a7"
        />
        {/* 광고·트래킹 스크립트는 싣지 않는다 — "추적 없이" 포지셔닝이 이 사이트의 자산이고,
            파일을 다루는 도구(SBOM 뷰어 등)의 프라이버시 약속과 양립할 수 없다(2026-09-12 결정). */}
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
        <LocaleProvider initialLocale={locale}>
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
