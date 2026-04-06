"use client";

export function ToolLoadingSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <div
        style={{
          height: "40px",
          background: "var(--skeleton-bg, #e5e7eb)",
          borderRadius: "8px",
          width: "60%",
        }}
      />
      <div
        style={{
          height: "120px",
          background: "var(--skeleton-bg, #e5e7eb)",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          height: "40px",
          background: "var(--skeleton-bg, #e5e7eb)",
          borderRadius: "8px",
          width: "40%",
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
