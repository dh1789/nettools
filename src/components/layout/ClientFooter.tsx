"use client";

import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { CATEGORIES } from "@/data/tools";
import Link from "next/link";

export function ClientFooter() {
  const { t, locale } = useLocale();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem 1rem",
        marginTop: "3rem",
        textAlign: "center",
        fontSize: "0.8125rem",
        color: "var(--text-tertiary)",
      }}
    >
      <p>{t(T.footerBuiltBy)}</p>
      <p style={{ marginTop: "0.25rem" }}>{t(T.footerPrivacy)}</p>
      <nav
        aria-label={t({ ko: "카테고리", en: "Categories" })}
        style={{ marginTop: "0.75rem", fontSize: "0.75rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25rem 1rem" }}
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}/`}
            style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
          >
            {category.icon} {category.title[locale]}
          </Link>
        ))}
      </nav>
      <p style={{ marginTop: "0.75rem", fontSize: "0.75rem" }}>
        <Link href="/blog/" style={{ color: "var(--text-tertiary)", textDecoration: "none", marginRight: "1rem" }}>
          {t(T.blogTitle)}
        </Link>
        <a href="/about" style={{ color: "var(--text-tertiary)", textDecoration: "none", marginRight: "1rem" }}>
          {t(T.navAbout)}
        </a>
        <a href="/contact" style={{ color: "var(--text-tertiary)", textDecoration: "none", marginRight: "1rem" }}>
          {t(T.navContact)}
        </a>
        <a href="/privacy" style={{ color: "var(--text-tertiary)", textDecoration: "none", marginRight: "1rem" }}>
          {t(T.footerLinkPrivacy)}
        </a>
        <a href="/terms" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>
          {t(T.footerLinkTerms)}
        </a>
      </p>
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "0.6875rem",
          fontFamily: "monospace",
          color: "var(--text-tertiary)",
          opacity: 0.6,
        }}
      >
        {process.env.NEXT_PUBLIC_GIT_HASH} · {process.env.NEXT_PUBLIC_BUILD_TIME}
      </p>
    </footer>
  );
}
