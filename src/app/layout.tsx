import type { Metadata } from "next";
import { LocaleProvider } from "@/lib/LocaleProvider";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | NetTools",
    default: "NetTools — Free Network & Security Tools",
  },
  description:
    "Free online tools for network engineers and security professionals.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tools.example.com",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --text-primary: #111827;
                --text-secondary: #6b7280;
                --text-tertiary: #9ca3af;
                --surface: #ffffff;
                --background: #f9fafb;
                --border: #e5e7eb;
                --border-light: #f3f4f6;
                --input-bg: #f9fafb;
                --result-bg: #f0fdf4;
                --info-bg: #eff6ff;
                --success-bg: #f0fdf4;
                --warn-bg: #fffbeb;
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --text-primary: #f9fafb;
                  --text-secondary: #9ca3af;
                  --text-tertiary: #6b7280;
                  --surface: #1f2937;
                  --background: #111827;
                  --border: #374151;
                  --border-light: #1f2937;
                  --input-bg: #1f2937;
                  --result-bg: #064e3b20;
                  --info-bg: #1e3a5f30;
                  --success-bg: #064e3b20;
                  --warn-bg: #78350f20;
                }
              }
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                  Roboto, "Helvetica Neue", Arial, sans-serif;
                background: var(--background);
                color: var(--text-primary);
                line-height: 1.6;
                -webkit-font-smoothing: antialiased;
              }
              a { color: inherit; }
              input[type="text"], input[type="number"] {
                color: var(--text-primary);
                background: var(--input-bg);
                border-color: var(--border);
              }
              input[type="text"]:focus, input[type="number"]:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
              }
              @keyframes slideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `,
          }}
        />
      </head>
      <body>
        <LocaleProvider>
          <ClientHeader />
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <ClientFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
