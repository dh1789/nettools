"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/LocaleProvider";

type L<T = string> = { ko: T; en: T };

export type DocSection = { title: L; body: L<ReactNode> };

interface LegalDocProps {
  title: L;
  updated?: L;
  lead?: L<ReactNode>;
  sections: DocSection[];
  footer?: L<ReactNode>;
}

export function LegalDoc({ title, updated, lead, sections, footer }: LegalDocProps) {
  const { locale } = useLocale();

  return (
    <article
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "2rem 1rem 4rem",
      }}
    >
      <header style={{ marginBottom: lead ? "2.5rem" : "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: lead ? "0.75rem" : "0.5rem",
          }}
        >
          {title[locale]}
        </h1>
        {updated && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
            {updated[locale]}
          </p>
        )}
        {lead && (
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            {lead[locale]}
          </p>
        )}
      </header>

      <div
        style={{
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          fontSize: "0.9375rem",
        }}
      >
        {sections.map((s, i) => (
          <section key={i} style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {s.title[locale]}
            </h2>
            {s.body[locale]}
          </section>
        ))}
        {footer && footer[locale]}
      </div>
    </article>
  );
}
