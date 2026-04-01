"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { AdSlot } from "./AdSlot";
import type { FAQ, HowTo, RelatedConcept } from "@/data/tools";
import { getToolBySlug } from "@/data/tools";

interface ToolLayoutProps {
  title: string;
  description: string;
  longDescription?: string;
  faqs?: FAQ[];
  howTo?: HowTo;
  relatedConcepts?: RelatedConcept[];
  relatedTools?: string[];
  locale?: "ko" | "en";
  children: ReactNode;
}

function FaqSection({ faqs, locale }: { faqs: FAQ[]; locale: "ko" | "en" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const heading = locale === "ko" ? "자주 묻는 질문" : "Frequently Asked Questions";

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginBottom: "1rem",
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 1rem",
                  background: isOpen
                    ? "var(--info-bg, #eff6ff)"
                    : "var(--surface, #fff)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "0.5rem",
                }}
                aria-expanded={isOpen}
              >
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--text-primary, #111)",
                    lineHeight: 1.5,
                  }}
                >
                  {faq.question[locale]}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: "1rem",
                    color: "var(--text-secondary, #6b7280)",
                    transition: "transform 0.2s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    borderTop: "1px solid var(--border, #e5e7eb)",
                    background: "var(--background, #f9fafb)",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary, #6b7280)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer[locale]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowToSection({ howTo, locale }: { howTo: HowTo; locale: "ko" | "en" }) {
  const heading = locale === "ko" ? "사용 방법" : "How to Use";
  return (
    <section style={{ marginTop: "1rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginBottom: "1rem",
        }}
      >
        {heading}
      </h2>
      <ol
        style={{
          paddingLeft: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
        }}
      >
        {howTo.steps.map((step, i) => (
          <li
            key={i}
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary, #6b7280)",
              lineHeight: 1.7,
            }}
          >
            {step[locale]}
          </li>
        ))}
      </ol>
    </section>
  );
}

function RelatedConceptsSection({
  concepts,
  locale,
}: {
  concepts: RelatedConcept[];
  locale: "ko" | "en";
}) {
  const heading = locale === "ko" ? "관련 개념" : "Related Concepts";
  return (
    <section style={{ marginTop: "1rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginBottom: "1rem",
        }}
      >
        {heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {concepts.map((concept, i) => (
          <div key={i}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary, #111)",
                marginBottom: "0.25rem",
              }}
            >
              {concept.title[locale]}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary, #6b7280)",
                lineHeight: 1.7,
              }}
            >
              {concept.description[locale]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedToolsSection({
  slugs,
  locale,
}: {
  slugs: string[];
  locale: "ko" | "en";
}) {
  const heading = locale === "ko" ? "관련 도구" : "Related Tools";
  const tools = slugs
    .map((s) => {
      const t = getToolBySlug(s);
      return t ? { slug: t.slug, title: t.title[locale], category: t.category } : null;
    })
    .filter(Boolean) as Array<{ slug: string; title: string; category: string }>;

  if (tools.length === 0) return null;

  return (
    <section style={{ marginTop: "1rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginBottom: "1rem",
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/net/${t.slug}`}
            style={{
              display: "inline-block",
              padding: "0.5rem 0.875rem",
              fontSize: "0.875rem",
              color: "var(--info-text, #1d4ed8)",
              background: "var(--info-bg, #eff6ff)",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            {t.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ToolLayout({
  title,
  description,
  longDescription,
  faqs,
  howTo,
  relatedConcepts,
  relatedTools,
  locale = "ko",
  children,
}: ToolLayoutProps) {
  return (
    <article style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1rem" }}>
      {/* 상단 광고 */}
      <AdSlot position="top" />

      {/* 도구 헤더 */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary, #666)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </header>

      {/* 도구 본체 */}
      <section
        style={{
          background: "var(--surface, #fff)",
          border: "1px solid var(--border, #e5e5e5)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {children}
      </section>

      {/* 상세 설명 */}
      {longDescription && (
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e5e5e5)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--text-primary, #111)",
              marginBottom: "0.75rem",
            }}
          >
            {locale === "ko" ? "도구 소개" : "About This Tool"}
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary, #6b7280)",
              lineHeight: 1.75,
            }}
          >
            {longDescription}
          </p>
        </section>
      )}

      {/* 사용 방법 */}
      {howTo && howTo.steps.length > 0 && (
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e5e5e5)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <HowToSection howTo={howTo} locale={locale} />
        </section>
      )}

      {/* FAQ 섹션 */}
      {faqs && faqs.length > 0 && (
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e5e5e5)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <FaqSection faqs={faqs} locale={locale} />
        </section>
      )}

      {/* 관련 개념 */}
      {relatedConcepts && relatedConcepts.length > 0 && (
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e5e5e5)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <RelatedConceptsSection concepts={relatedConcepts} locale={locale} />
        </section>
      )}

      {/* 관련 도구 */}
      {relatedTools && relatedTools.length > 0 && (
        <section
          style={{
            background: "var(--surface, #fff)",
            border: "1px solid var(--border, #e5e5e5)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <RelatedToolsSection slugs={relatedTools} locale={locale} />
        </section>
      )}

      {/* 하단 광고 */}
      <AdSlot position="bottom" />
    </article>
  );
}
