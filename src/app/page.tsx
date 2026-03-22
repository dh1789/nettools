import Link from "next/link";
import { TOOLS, CATEGORIES, getToolsByCategory } from "@/data/tools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetTools — Free Network & Security Tools",
  description:
    "Free online tools for network engineers and security professionals. Subnet calculator, MAC OUI lookup, CIDR converter, and more.",
  openGraph: {
    title: "NetTools — Free Network & Security Tools",
    description: "Practical tools built by a 19-year security developer.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "var(--text-primary, #111)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          NetTools
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary, #6b7280)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Free online tools for network engineers and security professionals.
          <br />
          No signup. No tracking. Just tools.
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-tertiary, #9ca3af)",
            marginTop: "0.5rem",
          }}
        >
          {TOOLS.length} tools available
        </p>
      </section>

      {/* Categories + Tools */}
      {CATEGORIES.map((category) => {
        const tools = getToolsByCategory(category.id);
        if (tools.length === 0) return null;

        return (
          <section key={category.id} style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary, #111)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{category.icon}</span>
              {category.title.en}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
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
                    {tool.title.en}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary, #6b7280)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {tool.description.en}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
