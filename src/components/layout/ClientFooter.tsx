"use client";

import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";

export function ClientFooter() {
  const { t } = useLocale();

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
    </footer>
  );
}
