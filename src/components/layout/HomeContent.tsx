"use client";

import { TOOLS, CATEGORIES, getToolsByCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import Link from "next/link";

const GUIDES: { slug: string; title: { ko: string; en: string } }[] = [
  { slug: "subnet-calculation-guide", title: { ko: "서브넷 계산 완전 가이드", en: "Subnet Calculation Guide" } },
  { slug: "dns-records-guide", title: { ko: "DNS 레코드 완벽 정리", en: "DNS Records Explained" } },
  { slug: "ssl-certificate-check-guide", title: { ko: "SSL 인증서 확인 가이드", en: "SSL Certificate Check Guide" } },
  { slug: "jwt-decode-verify", title: { ko: "JWT 디코딩·검증 가이드", en: "JWT Decode & Verify" } },
  { slug: "chmod-permissions-guide", title: { ko: "리눅스 chmod 권한 정리", en: "Linux chmod Permissions" } },
  { slug: "base64-encoding-guide", title: { ko: "Base64 인코딩 이해하기", en: "Base64 Encoding Explained" } },
  { slug: "cron-expression-guide", title: { ko: "크론 표현식 가이드", en: "Cron Expression Guide" } },
  { slug: "regex-testing-guide", title: { ko: "정규식 테스트 가이드", en: "Regex Testing Guide" } },
];

export function HomeContent() {
  const { locale, tf } = useLocale();

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "var(--text-primary, #111)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          NetTools
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary, #6b7280)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {tf(T.heroSubtitle, {})}
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.5rem",
          }}
        >
          {tf(T.toolsAvailable, { count: TOOLS.length })}
        </p>
      </section>

      {/* Categories + Tools */}
      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id);
        if (tools.length === 0) return null;

        return (
          <section key={category.id} style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{category.icon}</span>
              {category.title[locale]}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {tools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  slug={tool.slug}
                  title={tool.title[locale]}
                  description={tool.description[locale]}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* 가이드 — 색인된 홈에서 가이드로 1-hop 내부링크 (발견 신호 강화) */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
            marginBottom: "0.25rem",
          }}
        >
          {locale === "ko" ? "📖 네트워크·보안 가이드" : "📖 Network & Security Guides"}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary, #6b7280)",
            marginBottom: "1rem",
          }}
        >
          {locale === "ko"
            ? "도구와 함께 보면 좋은 실무 가이드입니다."
            : "Practical guides to pair with the tools."}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/blog/${g.slug}/`}
              style={{
                display: "block",
                padding: "0.875rem 1rem",
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: "10px",
                color: "var(--text-primary, #111)",
                textDecoration: "none",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            >
              {g.title[locale]}
            </Link>
          ))}
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
          <Link
            href="/blog/"
            style={{ color: "var(--info-text, #1d4ed8)", textDecoration: "none" }}
          >
            {locale === "ko" ? "모든 가이드 보기 →" : "View all guides →"}
          </Link>
        </p>
      </section>
    </main>
  );
}
