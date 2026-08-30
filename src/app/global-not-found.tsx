import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

// 전역 404 — 루트 레이아웃이 (ko)/(en) 그룹으로 나뉘어 어느 레이아웃에도 속하지 않으므로
// 문서 전체(<html>/<body>)를 스스로 렌더한다. 로케일을 알 수 없어 ko 껍데기 + 양쪽 링크.
export const metadata: Metadata = {
  title: { absolute: "404 — 페이지를 찾을 수 없습니다 | NetTools" },
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <SiteShell locale="ko">
      <main
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "var(--text-tertiary, #9ca3af)",
            letterSpacing: "-0.02em",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary, #111)",
            margin: "0.5rem 0 0.75rem",
          }}
        >
          페이지를 찾을 수 없습니다
        </h1>
        <p style={{ color: "var(--text-secondary, #6b7280)", lineHeight: 1.7 }}>
          주소가 바뀌었거나 삭제된 페이지입니다. 이전 블로그 주소(<code>/ko/…</code>, <code>/en/…</code> 글)는
          더 이상 제공되지 않습니다.
        </p>
        <p
          lang="en"
          style={{ color: "var(--text-secondary, #6b7280)", lineHeight: 1.7, marginTop: "0.5rem" }}
        >
          This page could not be found.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            marginTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "0.625rem 1.25rem",
              background: "#3b82f6",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            도구 목록으로
          </Link>
          <Link
            href="/en/"
            lang="en"
            style={{
              padding: "0.625rem 1.25rem",
              border: "1px solid var(--border, #e5e7eb)",
              color: "var(--text-primary, #111)",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            English home
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
