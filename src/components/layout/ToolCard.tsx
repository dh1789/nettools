"use client";

import Link from "next/link";

interface ToolCardProps {
  slug: string;
  title: string;
  description: string;
}

export default function ToolCard({ slug, title, description }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${slug}`}
      style={{
        display: "block",
        padding: "1.25rem",
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e5e5e5)",
        borderRadius: "12px",
        textDecoration: "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 8px rgba(59,130,246,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border, #e5e5e5)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary, #111)",
          marginBottom: "0.375rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-secondary, #6b7280)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {description}
      </p>
    </Link>
  );
}
