/**
 * SBOM Parser
 * ───────────
 * CycloneDX / SPDX JSON 을 공통 컴포넌트 표로 정규화한다.
 *
 * 전부 브라우저에서 실행된다. 이 모듈은 네트워크를 쓰지 않으며,
 * 입력 문자열은 호출자 밖으로 나가지 않는다(docs/ARCHITECTURE.md §9).
 */

export type SbomFormat = "cyclonedx" | "spdx";

/** 지원 스펙 버전 — UI 에 그대로 표시한다 */
export const SUPPORTED = {
  cyclonedx: ["1.2", "1.3", "1.4", "1.5", "1.6"],
  spdx: ["SPDX-2.2", "SPDX-2.3"],
} as const;

export interface SbomComponent {
  name: string;
  version: string | null;
  purl: string | null;
  license: string | null;
  supplier: string | null;
  type: string | null;
}

export interface SbomStats {
  total: number;
  licenseUnknown: number;
  versionUnknown: number;
  purlUnknown: number;
  licenses: { name: string; count: number }[];
  types: { name: string; count: number }[];
}

export interface SbomParseOk {
  ok: true;
  format: SbomFormat;
  specVersion: string;
  documentName: string | null;
  components: SbomComponent[];
  stats: SbomStats;
  /** 이름이 없어 건너뛴 항목 수 */
  skipped: number;
}

export type SbomErrorReason =
  | "empty"
  | "invalid-json"
  | "unknown-format"
  | "unsupported-version"
  | "no-components";

export interface SbomParseError {
  ok: false;
  reason: SbomErrorReason;
  message: { ko: string; en: string };
  detail?: string;
}

export type SbomParseResult = SbomParseOk | SbomParseError;

type Json = Record<string, unknown>;

// ─── 공통 유틸 ───

/** SPDX 의 "값 없음" 표기 + 빈 문자열을 null 로 정규화한다 */
function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s === "NOASSERTION" || s === "NONE") return null;
  return s;
}

function err(
  reason: SbomErrorReason,
  ko: string,
  en: string,
  detail?: string,
): SbomParseError {
  return { ok: false, reason, message: { ko, en }, ...(detail ? { detail } : {}) };
}

function tally(values: (string | null)[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of values) {
    if (v === null) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function buildStats(components: SbomComponent[]): SbomStats {
  return {
    total: components.length,
    licenseUnknown: components.filter((c) => c.license === null).length,
    versionUnknown: components.filter((c) => c.version === null).length,
    purlUnknown: components.filter((c) => c.purl === null).length,
    licenses: tally(components.map((c) => c.license)),
    types: tally(components.map((c) => c.type)),
  };
}

// ─── CycloneDX ───

/**
 * licenses 배열은 세 형태가 섞여 온다:
 *   [{ license: { id: "MIT" } }] · [{ license: { name: "..." } }] · [{ expression: "A OR B" }]
 * 여러 개면 " AND " 로 합친다(표시용이므로 SPDX 표현식 규격을 엄밀히 따르지는 않는다).
 */
function cdxLicense(raw: unknown): string | null {
  if (!Array.isArray(raw)) return null;
  const parts: string[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Json;
    const expr = clean(e.expression);
    if (expr) {
      parts.push(expr);
      continue;
    }
    const lic = e.license;
    if (lic && typeof lic === "object") {
      const l = lic as Json;
      const v = clean(l.id) ?? clean(l.name);
      if (v) parts.push(v);
    }
  }
  return parts.length ? parts.join(" AND ") : null;
}

function cdxSupplier(c: Json): string | null {
  const sup = c.supplier;
  if (sup && typeof sup === "object") {
    const v = clean((sup as Json).name);
    if (v) return v;
  }
  const man = c.manufacturer;
  if (man && typeof man === "object") {
    const v = clean((man as Json).name);
    if (v) return v;
  }
  return clean(c.publisher);
}

/** components[] 는 중첩될 수 있어 깊이 우선으로 평탄화한다 */
function cdxFlatten(
  raw: unknown,
  out: SbomComponent[],
  skipped: { n: number },
): void {
  if (!Array.isArray(raw)) return;
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const c = item as Json;
    const name = clean(c.name);
    if (name) {
      out.push({
        name,
        version: clean(c.version),
        purl: clean(c.purl),
        license: cdxLicense(c.licenses),
        supplier: cdxSupplier(c),
        type: clean(c.type),
      });
    } else {
      skipped.n += 1;
    }
    cdxFlatten(c.components, out, skipped);
  }
}

function parseCycloneDx(doc: Json): SbomParseResult {
  const specVersion = clean(doc.specVersion) ?? "(미기재)";
  if (!(SUPPORTED.cyclonedx as readonly string[]).includes(specVersion)) {
    const list = SUPPORTED.cyclonedx.join(", ");
    return err(
      "unsupported-version",
      `CycloneDX ${specVersion} 은(는) 지원하지 않습니다. 지원 버전: ${list}`,
      `CycloneDX ${specVersion} is not supported. Supported: ${list}`,
    );
  }

  const components: SbomComponent[] = [];
  const skipped = { n: 0 };
  cdxFlatten(doc.components, components, skipped);

  if (components.length === 0) {
    return err(
      "no-components",
      "컴포넌트가 하나도 없습니다. components 배열이 비어 있는지 확인하세요.",
      "No components found. Check whether the components array is empty.",
    );
  }

  const meta = doc.metadata as Json | undefined;
  const metaComponent = meta?.component as Json | undefined;

  return {
    ok: true,
    format: "cyclonedx",
    specVersion,
    documentName: clean(metaComponent?.name),
    components,
    stats: buildStats(components),
    skipped: skipped.n,
  };
}

// ─── SPDX ───

const SPDX_PURPOSE_TO_TYPE: Record<string, string> = {
  APPLICATION: "application",
  FRAMEWORK: "framework",
  LIBRARY: "library",
  CONTAINER: "container",
  OPERATING_SYSTEM: "operating-system",
  DEVICE: "device",
  FIRMWARE: "firmware",
  SOURCE: "source",
  ARCHIVE: "archive",
  FILE: "file",
  INSTALL: "install",
  OTHER: "other",
};

function spdxPurl(raw: unknown): string | null {
  if (!Array.isArray(raw)) return null;
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Json;
    if (clean(e.referenceType) === "purl") {
      const v = clean(e.referenceLocator);
      if (v) return v;
    }
  }
  return null;
}

/** "Organization: Canonical Ltd." · "Person: Jane" 접두사를 떼어낸다 */
function spdxSupplier(raw: unknown): string | null {
  const v = clean(raw);
  if (!v) return null;
  const m = v.match(/^(?:Organization|Person|Tool)\s*:\s*(.+)$/i);
  return m ? m[1].trim() : v;
}

function parseSpdx(doc: Json): SbomParseResult {
  const specVersion = clean(doc.spdxVersion) ?? "(미기재)";
  if (!(SUPPORTED.spdx as readonly string[]).includes(specVersion)) {
    const list = SUPPORTED.spdx.join(", ");
    const extra = specVersion.startsWith("SPDX-3")
      ? " SPDX 3.x 는 문서 구조가 달라 별도 지원이 필요합니다."
      : "";
    const extraEn = specVersion.startsWith("SPDX-3")
      ? " SPDX 3.x uses a different document structure and needs separate support."
      : "";
    return err(
      "unsupported-version",
      `${specVersion} 은(는) 지원하지 않습니다. 지원 버전: ${list}.${extra}`,
      `${specVersion} is not supported. Supported: ${list}.${extraEn}`,
    );
  }

  const packages = doc.packages;
  const components: SbomComponent[] = [];
  let skipped = 0;

  if (Array.isArray(packages)) {
    for (const item of packages) {
      if (!item || typeof item !== "object") continue;
      const p = item as Json;
      const name = clean(p.name);
      if (!name) {
        skipped += 1;
        continue;
      }
      const purpose = clean(p.primaryPackagePurpose);
      components.push({
        name,
        version: clean(p.versionInfo),
        purl: spdxPurl(p.externalRefs),
        license: clean(p.licenseConcluded) ?? clean(p.licenseDeclared),
        supplier: spdxSupplier(p.supplier) ?? spdxSupplier(p.originator),
        type: purpose ? (SPDX_PURPOSE_TO_TYPE[purpose] ?? purpose.toLowerCase()) : null,
      });
    }
  }

  if (components.length === 0) {
    return err(
      "no-components",
      "패키지가 하나도 없습니다. packages 배열이 비어 있는지 확인하세요.",
      "No packages found. Check whether the packages array is empty.",
    );
  }

  return {
    ok: true,
    format: "spdx",
    specVersion,
    documentName: clean(doc.name),
    components,
    stats: buildStats(components),
    skipped,
  };
}

// ─── 진입점 ───

/**
 * SBOM JSON 문자열을 파싱한다. 실패는 항상 이유가 붙은 객체로 돌려주며,
 * 조용히 빈 결과를 내지 않는다.
 */
export function parseSbom(text: string): SbomParseResult {
  if (!text || !text.trim()) {
    return err(
      "empty",
      "내용이 비어 있습니다. SBOM 파일을 올리거나 JSON 을 붙여넣으세요.",
      "Input is empty. Drop an SBOM file or paste its JSON.",
    );
  }

  let doc: unknown;
  try {
    doc = JSON.parse(text);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return err(
      "invalid-json",
      "JSON 을 읽을 수 없습니다. 파일이 잘렸거나 형식이 깨졌는지 확인하세요.",
      "Could not parse JSON. The file may be truncated or malformed.",
      detail,
    );
  }

  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    return err(
      "unknown-format",
      "SBOM 형식을 알 수 없습니다. 최상위가 JSON 객체여야 합니다.",
      "Unrecognized SBOM format. The top level must be a JSON object.",
    );
  }

  const obj = doc as Json;
  if (clean(obj.bomFormat) === "CycloneDX" || obj.specVersion !== undefined) {
    return parseCycloneDx(obj);
  }
  if (obj.spdxVersion !== undefined) {
    return parseSpdx(obj);
  }

  return err(
    "unknown-format",
    "CycloneDX(bomFormat) 도 SPDX(spdxVersion) 도 아닙니다. SBOM 파일이 맞는지 확인하세요.",
    "Neither CycloneDX (bomFormat) nor SPDX (spdxVersion). Check that this is an SBOM file.",
  );
}

// ─── CSV ───

const CSV_COLUMNS: (keyof SbomComponent)[] = [
  "name",
  "version",
  "purl",
  "license",
  "supplier",
  "type",
];

function csvCell(v: string | null): string {
  if (v === null) return "";
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** 컴포넌트 표를 CSV 로 직렬화한다. 생성은 브라우저에서, 서버 경유 없음. */
export function toCsv(components: SbomComponent[]): string {
  const rows = [CSV_COLUMNS.join(",")];
  for (const c of components) {
    rows.push(CSV_COLUMNS.map((k) => csvCell(c[k])).join(","));
  }
  return rows.join("\n") + "\n";
}
