"use client";

import { useLocale } from "@/lib/LocaleProvider";
import { LOCALES } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div style={{ display: "flex", gap: "0.25rem", fontSize: "0.8125rem" }}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          style={{
            padding: "0.25rem 0.5rem",
            border: "1px solid var(--border, #d1d5db)",
            borderRadius: "4px",
            background: locale === l.code ? "#3b82f6" : "transparent",
            color: locale === l.code ? "#fff" : "var(--text-secondary, #6b7280)",
            cursor: "pointer",
            fontWeight: locale === l.code ? 600 : 400,
            fontSize: "0.75rem",
            transition: "all 0.15s",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
