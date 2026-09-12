"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import {
  parseSbom,
  toCsv,
  SUPPORTED,
  type SbomComponent,
  type SbomParseOk,
  type SbomParseError,
} from "@/lib/sbom";

const PAGE_SIZE = 100;

type SortKey = keyof SbomComponent;
type SortDir = "asc" | "desc";

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  padding: "0.5rem 0.875rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--surface, #fff)",
  color: "var(--text-primary, #111)",
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  padding: "0.5rem 0.625rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--text-secondary, #6b7280)",
  textAlign: "left",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--border, #e5e7eb)",
  cursor: "pointer",
  userSelect: "none",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 0.625rem",
  fontSize: "0.8125rem",
  color: "var(--text-primary, #111)",
  borderBottom: "1px solid var(--border-light, #f3f4f6)",
  whiteSpace: "nowrap",
};

export function SbomViewer() {
  const { t, locale } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);

  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<SbomParseOk | null>(null);
  const [error, setError] = useState<SbomParseError | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [query, setQuery] = useState("");
  const [licenseFilter, setLicenseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  const UNKNOWN = t({ ko: "미기재", en: "Not stated" });

  const run = useCallback((text: string, name: string | null) => {
    const r = parseSbom(text);
    setFileName(name);
    setQuery("");
    setLicenseFilter("");
    setTypeFilter("");
    setPage(0);
    if (r.ok) {
      setResult(r);
      setError(null);
    } else {
      setResult(null);
      setError(r);
    }
  }, []);

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => run(String(reader.result ?? ""), file.name);
      reader.readAsText(file);
    },
    [run],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  // 검색·필터·정렬은 전체 데이터에 적용하고, 표에는 한 페이지만 그린다
  // (컴포넌트 수만 개짜리 SBOM 에서 DOM 이 죽지 않게 하는 핵심)
  const filtered = useMemo(() => {
    if (!result) return [];
    const q = query.trim().toLowerCase();
    let list = result.components;
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.purl?.toLowerCase().includes(q) ?? false),
      );
    }
    if (licenseFilter) {
      list =
        licenseFilter === "__none__"
          ? list.filter((c) => c.license === null)
          : list.filter((c) => c.license === licenseFilter);
    }
    if (typeFilter) {
      list =
        typeFilter === "__none__"
          ? list.filter((c) => c.type === null)
          : list.filter((c) => c.type === typeFilter);
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return av.localeCompare(bv, undefined, { numeric: true }) * dir;
    });
  }, [result, query, licenseFilter, typeFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (fileName?.replace(/\.json$/i, "") || "sbom") + "-components.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: t({ ko: "이름", en: "Name" }) },
    { key: "version", label: t({ ko: "버전", en: "Version" }) },
    { key: "purl", label: "purl" },
    { key: "license", label: t({ ko: "라이선스", en: "License" }) },
    { key: "supplier", label: t({ ko: "공급자", en: "Supplier" }) },
    { key: "type", label: t({ ko: "타입", en: "Type" }) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 프라이버시 고지 — 이 도구의 핵심 약속 */}
      <p
        style={{
          margin: 0,
          padding: "0.625rem 0.875rem",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          color: "var(--text-secondary, #6b7280)",
          background: "var(--info-bg, #eff6ff)",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: "8px",
        }}
      >
        🔒{" "}
        <strong style={{ color: "var(--text-primary, #111)" }}>
          {t({
            ko: "이 파일은 브라우저 안에서만 처리되며, 서버로 전송되지 않습니다.",
            en: "This file is processed entirely in your browser and is never sent to a server.",
          })}
        </strong>{" "}
        {t({
          ko: "네트워크 요청이 발생하지 않으므로 폐쇄망에서도 그대로 쓸 수 있습니다.",
          en: "No network request is made, so it works the same on an air-gapped network.",
        })}
      </p>

      {/* 드롭 존 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: "1.75rem 1rem",
          border: `2px dashed ${dragging ? "#3b82f6" : "var(--border, #d1d5db)"}`,
          borderRadius: "12px",
          background: dragging ? "var(--info-bg, #eff6ff)" : "var(--input-bg, #f9fafb)",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary, #111)" }}>
          {t({
            ko: "SBOM 파일을 여기에 끌어다 놓거나 클릭해서 선택",
            en: "Drop an SBOM file here, or click to choose one",
          })}
        </p>
        <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "var(--text-tertiary, #9ca3af)" }}>
          CycloneDX {SUPPORTED.cyclonedx.join(" / ")} · {SUPPORTED.spdx.join(" / ")} (JSON)
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
      </div>

      {/* 붙여넣기 */}
      <div>
        <label style={labelStyle}>
          {t({ ko: "또는 JSON 붙여넣기", en: "Or paste JSON" })}
        </label>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='{"bomFormat":"CycloneDX","specVersion":"1.5", ...}'
          style={{
            ...inputStyle,
            width: "100%",
            minHeight: "110px",
            fontFamily: "monospace",
            resize: "vertical",
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button
            onClick={() => run(raw, null)}
            style={{ ...btnStyle, background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" }}
          >
            {t({ ko: "분석", en: "Parse" })}
          </button>
          <button
            onClick={() => {
              setRaw("");
              setResult(null);
              setError(null);
              setFileName(null);
            }}
            style={btnStyle}
          >
            {t({ ko: "지우기", en: "Clear" })}
          </button>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div
          style={{
            padding: "0.875rem 1rem",
            background: "var(--warn-bg, #fffbeb)",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary, #111)" }}>
            ⚠️ {error.message[locale]}
          </p>
          {error.detail && (
            <p
              style={{
                marginTop: "0.375rem",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "var(--text-secondary, #6b7280)",
                wordBreak: "break-all",
              }}
            >
              {error.detail}
            </p>
          )}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <>
          {/* 요약 통계 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              {
                label: t({ ko: "형식", en: "Format" }),
                value: `${result.format === "cyclonedx" ? "CycloneDX" : "SPDX"} ${result.specVersion.replace("SPDX-", "")}`,
              },
              { label: t({ ko: "총 컴포넌트", en: "Components" }), value: String(result.stats.total) },
              {
                label: t({ ko: "라이선스 미기재", en: "License missing" }),
                value: String(result.stats.licenseUnknown),
                warn: result.stats.licenseUnknown > 0,
              },
              {
                label: t({ ko: "버전 미기재", en: "Version missing" }),
                value: String(result.stats.versionUnknown),
                warn: result.stats.versionUnknown > 0,
              },
              {
                label: t({ ko: "purl 미기재", en: "purl missing" }),
                value: String(result.stats.purlUnknown),
                warn: result.stats.purlUnknown > 0,
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "0.75rem 0.875rem",
                  background: s.warn ? "var(--warn-bg, #fffbeb)" : "var(--result-bg, #f0fdf4)",
                  border: "1px solid var(--border, #e5e7eb)",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #6b7280)" }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary, #111)",
                    marginTop: "0.125rem",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {result.documentName && (
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
              {t({ ko: "문서 대상", en: "Document subject" })}:{" "}
              <strong style={{ color: "var(--text-primary, #111)" }}>{result.documentName}</strong>
              {fileName ? ` · ${fileName}` : ""}
              {result.skipped > 0
                ? ` · ${t({ ko: "이름 없어 건너뜀", en: "skipped (no name)" })}: ${result.skipped}`
                : ""}
            </p>
          )}

          {/* 검색 · 필터 · 내보내기 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={t({ ko: "이름 · purl 검색", en: "Search name or purl" })}
              style={{ ...inputStyle, flex: "1 1 200px", minWidth: 0 }}
            />
            <select
              value={licenseFilter}
              onChange={(e) => {
                setLicenseFilter(e.target.value);
                setPage(0);
              }}
              style={{ ...inputStyle, maxWidth: "200px" }}
            >
              <option value="">{t({ ko: "라이선스 전체", en: "All licenses" })}</option>
              {result.stats.licenseUnknown > 0 && (
                <option value="__none__">
                  {UNKNOWN} ({result.stats.licenseUnknown})
                </option>
              )}
              {result.stats.licenses.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.count})
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(0);
              }}
              style={{ ...inputStyle, maxWidth: "180px" }}
            >
              <option value="">{t({ ko: "타입 전체", en: "All types" })}</option>
              {result.stats.types.map((ty) => (
                <option key={ty.name} value={ty.name}>
                  {ty.name} ({ty.count})
                </option>
              ))}
            </select>
            <button onClick={downloadCsv} style={btnStyle}>
              {t({ ko: "CSV 내보내기", en: "Export CSV" })}
            </button>
          </div>

          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
            {t({ ko: "표시", en: "Showing" })} {filtered.length.toLocaleString()} /{" "}
            {result.stats.total.toLocaleString()}
          </p>

          {/* 컴포넌트 표 — 모바일에서는 가로 스크롤 */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      style={thStyle}
                      title={t({ ko: "클릭해서 정렬", en: "Click to sort" })}
                    >
                      {col.label}
                      {sortKey === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr key={`${c.purl ?? c.name}-${i}`}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.name}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace" }}>
                      {c.version ?? <span style={{ color: "var(--text-tertiary, #9ca3af)" }}>{UNKNOWN}</span>}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        maxWidth: "280px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={c.purl ?? ""}
                    >
                      {c.purl ?? <span style={{ color: "var(--text-tertiary, #9ca3af)" }}>{UNKNOWN}</span>}
                    </td>
                    <td style={tdStyle}>
                      {c.license ?? (
                        <span style={{ color: "#b45309", fontWeight: 600 }}>{UNKNOWN}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {c.supplier ?? <span style={{ color: "var(--text-tertiary, #9ca3af)" }}>{UNKNOWN}</span>}
                    </td>
                    <td style={tdStyle}>
                      {c.type ?? <span style={{ color: "var(--text-tertiary, #9ca3af)" }}>{UNKNOWN}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {pageCount > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setPage(Math.max(0, current - 1))}
                disabled={current === 0}
                style={{ ...btnStyle, opacity: current === 0 ? 0.4 : 1 }}
              >
                ← {t({ ko: "이전", en: "Prev" })}
              </button>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
                {current + 1} / {pageCount}
              </span>
              <button
                onClick={() => setPage(Math.min(pageCount - 1, current + 1))}
                disabled={current >= pageCount - 1}
                style={{ ...btnStyle, opacity: current >= pageCount - 1 ? 0.4 : 1 }}
              >
                {t({ ko: "다음", en: "Next" })} →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
