// lint — Next.js/React 컨벤션 위반 정적 분석. 정보용 (exit 0).
// pre-commit 은 baseline 비교로 신규 위반만 차단.
import fs from "node:fs";
import path from "node:path";
import { color, header, jsonOut, ok } from "./_util.mjs";

const RULES = {
  "use-client-missing": {
    severity: "error",
    description: "interactive 훅(useState/useEffect/onClick 등) 사용 컴포넌트에 'use client' 누락",
  },
  "ssr-unsafe-jsx": {
    severity: "warning",
    description: "JSX 안에서 Date.now()/Math.random()/crypto.randomUUID() 직접 호출 (hydration mismatch 위험)",
  },
  "console-log-in-component": {
    severity: "warning",
    description: "프로덕션 컴포넌트 본문 (문자열/주석 외) 에 console.log 잔존",
  },
  "tool-component-no-default-export-style": {
    severity: "warning",
    description: "도구 컴포넌트가 named export 가 아니거나 파일명-컴포넌트명 미일치",
  },
};

export async function run({ flags, root }) {
  const violations = [];
  scanToolComponents(root, violations);
  scanAllComponents(root, violations);

  if (flags.has("--json")) {
    jsonOut({
      total: violations.length,
      error_count: violations.filter((v) => v.severity === "error").length,
      warning_count: violations.filter((v) => v.severity === "warning").length,
      violations,
    });
    return 0;
  }

  header("🧹 컨벤션 lint");
  if (violations.length === 0) {
    ok("위반 없음");
    return 0;
  }

  for (const v of violations) {
    const sym = v.severity === "error" ? `${color.red}❌${color.reset}` : `${color.yellow}⚠️${color.reset}`;
    process.stdout.write(`${sym} ${v.rule}: ${v.file}:${v.line}\n   ${color.gray}${v.snippet}${color.reset}\n`);
  }

  const errCount = violations.filter((v) => v.severity === "error").length;
  const warnCount = violations.length - errCount;
  process.stdout.write(`\n요약: ${color.red}${errCount} ERROR${color.reset}, ${color.yellow}${warnCount} WARNING${color.reset}\n`);
  return 0;
}

function add(violations, rule, file, line, snippet) {
  violations.push({ rule, severity: RULES[rule].severity, file, line, snippet: snippet.trim().slice(0, 200) });
}

function scanToolComponents(root, violations) {
  const dir = path.join(root, "src/components/tools");
  if (!fs.existsSync(dir)) return;

  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".tsx") || f === "ToolLoadingSkeleton.tsx" || f === "index.ts") continue;
    const full = path.join(dir, f);
    const rel = path.relative(root, full);
    const src = fs.readFileSync(full, "utf8");
    const lines = src.split("\n");
    const codeMask = computeCodeMask(src);

    const hasUseClient = lines.slice(0, 5).some((l) => /^["']use client["']/.test(l.trim()));
    const usesHooks = /\b(useState|useEffect|useRef|useReducer|useMemo|useCallback)\s*\(/.test(src);
    const usesEvents = /\bon(Click|Change|Submit|Input|KeyDown|KeyUp|MouseDown|MouseUp|Focus|Blur)\s*=/.test(src);
    if (!hasUseClient && (usesHooks || usesEvents)) {
      const lineNum = findFirstLine(lines, /\b(useState|useEffect|on(Click|Change|Submit))\b/);
      add(violations, "use-client-missing", rel, lineNum, lines[lineNum - 1] ?? "");
    }

    const compName = f.replace(/\.tsx$/, "");
    const namedExportRe = new RegExp(`export\\s+(function|const)\\s+${compName}\\b`);
    if (!namedExportRe.test(src)) {
      add(violations, "tool-component-no-default-export-style", rel, 1, `named export ${compName} 미발견`);
    }

    // JSX 안에서 비결정 함수 직접 호출 — return ( ... <jsx ... {Math.random()} ... /> ... )
    // 휴리스틱: JSX 식 `{ ... }` 안에 Date.now/Math.random/crypto.randomUUID 가 있으면 위반.
    const jsxExprRe = /\{[^{}\n]*\b(Date\.now|Math\.random|crypto\.randomUUID)\s*\([^{}\n]*\}/;
    lines.forEach((l, i) => {
      if (!codeMask[i]) return;
      if (jsxExprRe.test(l) && /<[A-Za-z]/.test(l)) {
        add(violations, "ssr-unsafe-jsx", rel, i + 1, l);
      }
      if (/^\s*console\.log\(/.test(l)) {
        add(violations, "console-log-in-component", rel, i + 1, l);
      }
    });
  }
}

// 라인이 코드(true)인지 문자열 리터럴/블록 주석(false) 안인지 판별.
// 백틱 템플릿 리터럴, 주석 안의 console.log/Math.random 같은 false positive 제거용.
function computeCodeMask(src) {
  const lines = src.split("\n");
  const mask = new Array(lines.length).fill(true);
  let inBacktick = false;
  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (inBacktick || inBlockComment) mask[i] = false;
    let j = 0;
    while (j < l.length) {
      const ch = l[j];
      const nx = l[j + 1];
      if (ch === "\\" && nx !== undefined) { j += 2; continue; }
      if (!inBacktick && !inBlockComment) {
        if (ch === "/" && nx === "/") break; // 라인 주석 — 끝까지 무시
        if (ch === "/" && nx === "*") { inBlockComment = true; mask[i] = false; j += 2; continue; }
        if (ch === "`") {
          let n = 1;
          while (l[j + n] === "`") n++;
          if (n === 1) { inBacktick = true; mask[i] = false; }
          j += n;
          continue;
        }
      } else if (inBlockComment) {
        if (ch === "*" && nx === "/") { inBlockComment = false; j += 2; continue; }
      } else if (inBacktick) {
        if (ch === "`") {
          let n = 1;
          while (l[j + n] === "`") n++;
          if (n === 1) { inBacktick = false; }
          j += n;
          continue;
        }
        // markdown fenced ``` 마커는 외부 템플릿의 일부 → 외부 백틱 유지
      }
      j++;
    }
  }
  return mask;
}

function scanAllComponents(root, violations) {
  walk(path.join(root, "src/components"), (file) => {
    if (!file.endsWith(".tsx")) return;
    if (file.includes("/tools/")) return;
    const rel = path.relative(root, file);
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split("\n");

    const hasUseClient = lines.slice(0, 5).some((l) => /^["']use client["']/.test(l.trim()));
    const usesHooks = /\b(useState|useEffect|useRef|useReducer)\s*\(/.test(src);
    if (!hasUseClient && usesHooks) {
      const lineNum = findFirstLine(lines, /\b(useState|useEffect|useRef|useReducer)\b/);
      add(violations, "use-client-missing", rel, lineNum, lines[lineNum - 1] ?? "");
    }
  });
}

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, fn);
    else fn(p);
  }
}

function findFirstLine(lines, re) {
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 1;
}
