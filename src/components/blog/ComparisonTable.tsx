"use client";

import React from "react";

export interface ComparisonFeature {
  name: string;
  ours: boolean | string;
  theirs: boolean | string;
}

interface ComparisonTableProps {
  ourName: string;
  theirName: string;
  features: ComparisonFeature[];
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span>{value}</span>;
  }
  if (value) {
    return <span style={{ color: "var(--success-text, #16a34a)", fontWeight: 700 }}>✓</span>;
  }
  return <span style={{ color: "var(--error-text, #dc2626)", fontWeight: 700 }}>✗</span>;
}

export function ComparisonTable({
  ourName,
  theirName,
  features,
}: ComparisonTableProps) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.938rem",
          lineHeight: 1.6,
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "2px solid var(--border, #e5e7eb)",
              background: "var(--input-bg, #f9fafb)",
            }}
          >
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: 600,
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              기능
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                color: "var(--info-text, #1d4ed8)",
              }}
            >
              {ourName}
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "0.75rem 1rem",
                fontWeight: 600,
                color: "var(--text-secondary, #6b7280)",
              }}
            >
              {theirName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr
              key={feature.name}
              style={{ borderBottom: "1px solid var(--border, #e5e7eb)" }}
            >
              <td
                style={{
                  padding: "0.625rem 1rem",
                  color: "var(--text-primary, #111)",
                }}
              >
                {feature.name}
              </td>
              <td style={{ textAlign: "center", padding: "0.625rem 1rem" }}>
                <CellValue value={feature.ours} />
              </td>
              <td style={{ textAlign: "center", padding: "0.625rem 1rem" }}>
                <CellValue value={feature.theirs} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
