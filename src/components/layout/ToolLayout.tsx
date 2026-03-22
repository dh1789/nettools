"use client";

import { type ReactNode } from "react";
import { AdSlot } from "./AdSlot";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
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

      {/* 하단 광고 */}
      <AdSlot position="bottom" />
    </article>
  );
}
