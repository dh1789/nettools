"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/LocaleProvider";
import { LOCALES, localePath, stripLocalePrefix } from "@/lib/i18n";

/**
 * 언어 전환 = 반대 로케일 URL 로 이동 (ko `/blog/` ↔ en `/en/blog/`).
 * 텍스트만 바꾸던 이전 방식은 정적 HTML(검색엔진)과 화면이 어긋났다(TR-10).
 * 루트 레이아웃이 다르므로 전환 시 풀 페이지 로드가 일어난다 — 의도된 동작.
 */
export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname() || "/";
  const base = stripLocalePrefix(pathname);

  return (
    <div style={{ display: "flex", gap: "0.25rem", fontSize: "0.8125rem" }}>
      {LOCALES.map((l) => {
        const active = locale === l.code;
        return (
          <Link
            key={l.code}
            href={localePath(base, l.code)}
            hrefLang={l.code}
            lang={l.code}
            aria-current={active ? "true" : undefined}
            style={{
              padding: "0.25rem 0.5rem",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: "4px",
              background: active ? "#3b82f6" : "transparent",
              color: active ? "#fff" : "var(--text-secondary, #6b7280)",
              textDecoration: "none",
              fontWeight: active ? 600 : 400,
              fontSize: "0.75rem",
              transition: "all 0.15s",
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
