"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/LocaleProvider";
import { T } from "@/lib/i18n";
import { CATEGORIES, getToolsByCategory } from "@/data/tools";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (path: string) => {
    const normalized = pathname.replace(/\/$/, "");
    const target = path.replace(/\/$/, "");
    return normalized === target;
  };

  return (
    <nav style={{ padding: "1rem 0" }}>
      {/* Home */}
      <Link
        href="/"
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          fontWeight: isActive("/") ? 700 : 400,
          color: isActive("/") ? "#3b82f6" : "var(--text-primary)",
          background: isActive("/") ? "var(--info-bg, #eff6ff)" : "transparent",
          borderRadius: "6px",
          textDecoration: "none",
          margin: "0 0.5rem 0.25rem",
          transition: "background 0.15s",
        }}
      >
        {t(T.navHome)}
      </Link>

      <div
        style={{
          height: "1px",
          background: "var(--border-light, #f3f4f6)",
          margin: "0.5rem 1rem",
        }}
      />

      {/* Categories */}
      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id);
        if (tools.length === 0) return null;
        const isCollapsed = collapsed[category.id] ?? false;

        return (
          <div key={category.id} style={{ marginBottom: "0.25rem" }}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                width: "100%",
                padding: "0.5rem 1rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-tertiary, #9ca3af)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "0.625rem",
                  transition: "transform 0.15s",
                  transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                ▼
              </span>
              <span>{category.icon}</span>
              <span>{category.title[locale]}</span>
            </button>

            {/* Tool links */}
            {!isCollapsed && (
              <div>
                {tools.map((tool) => {
                  const toolPath = `/tools/net/${tool.slug}`;
                  const active = isActive(toolPath);
                  return (
                    <Link
                      key={tool.slug}
                      href={toolPath}
                      onClick={onNavigate}
                      style={{
                        display: "block",
                        padding: "0.375rem 1rem 0.375rem 2.25rem",
                        fontSize: "0.8125rem",
                        color: active ? "#3b82f6" : "var(--text-secondary, #6b7280)",
                        fontWeight: active ? 600 : 400,
                        background: active ? "var(--info-bg, #eff6ff)" : "transparent",
                        borderRadius: "6px",
                        textDecoration: "none",
                        margin: "0 0.5rem",
                        transition: "background 0.15s, color 0.15s",
                        borderLeft: active ? "2px solid #3b82f6" : "2px solid transparent",
                      }}
                    >
                      {tool.title[locale]}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
