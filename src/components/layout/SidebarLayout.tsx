"use client";

import { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

const SIDEBAR_WIDTH = 240;
const BREAKPOINT = 768;

export function SidebarLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 페이지 이동 시 모바일 사이드바 닫기
  useEffect(() => {
    setMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          style={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            borderRight: "1px solid var(--border, #e5e7eb)",
            background: "var(--surface, #fff)",
            overflowY: "auto",
            position: "sticky",
            top: 0,
            height: "calc(100vh - 52px)",
          }}
        >
          <Sidebar />
        </aside>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 40,
              transition: "opacity 0.2s",
            }}
          />
          {/* Drawer */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: SIDEBAR_WIDTH,
              background: "var(--surface, #fff)",
              borderRight: "1px solid var(--border, #e5e7eb)",
              zIndex: 50,
              overflowY: "auto",
              boxShadow: "4px 0 16px rgba(0,0,0,0.1)",
              animation: "slideIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border, #e5e7eb)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>NetTools</span>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "var(--text-secondary, #6b7280)",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Mobile hamburger FAB */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menu"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "1.5rem",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            fontSize: "1.25rem",
            cursor: "pointer",
            zIndex: 30,
            boxShadow: "0 2px 12px rgba(59,130,246,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ☰
        </button>
      )}

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
