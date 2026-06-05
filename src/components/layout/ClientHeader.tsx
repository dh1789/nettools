"use client";

import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function ClientHeader() {
  const { t } = useLocale();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1rem",
      }}
    >
      <nav
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "1.125rem",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          NetTools
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.875rem" }}>
          <Link
            href="/"
            style={{ textDecoration: "none", color: "var(--text-secondary)" }}
          >
            {t(T.navTools)}
          </Link>
          <Link
            href="/blog/"
            style={{ textDecoration: "none", color: "var(--text-secondary)" }}
          >
            {t(T.blogTitle)}
          </Link>
          <a
            href="/about"
            style={{ textDecoration: "none", color: "var(--text-secondary)" }}
          >
            {t(T.navAbout)}
          </a>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
