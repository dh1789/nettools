// drift — 에이전트 메모리(.md) ↔ 현실 불일치 감지.
// nettools 환경 특화 패턴: 도구 개수, 포트, 빌드 산출물 경로.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { color, header, jsonOut, ok, fail, info } from "./_util.mjs";

const CHECKS = [
  {
    pattern: /(\d+)\s*개\s*도구/g,
    label: "도구 개수",
    verify: ({ root }) => {
      const src = readSafe(path.join(root, "src/data/tools.ts"));
      return (src.match(/slug:\s*"[a-z0-9-]+"/g) || []).length;
    },
  },
  {
    pattern: /포트\s*(\d{4,5})/g,
    label: "dev 포트",
    verify: ({ root }) => {
      const pkg = JSON.parse(readSafe(path.join(root, "package.json")) || "{}");
      const dev = pkg.scripts?.dev ?? "";
      const m = dev.match(/-p\s*(\d+)/);
      return m ? Number(m[1]) : null;
    },
  },
];

export async function run({ flags, root }) {
  const memDir = path.join(os.homedir(), ".claude/projects/-Users-idongho-proj-nettools/memory");
  const files = fs.existsSync(memDir)
    ? fs.readdirSync(memDir).filter((f) => f.endsWith(".md") && f !== "MEMORY.md").map((f) => path.join(memDir, f))
    : [];

  const results = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    for (const c of CHECKS) {
      const re = new RegExp(c.pattern.source, c.pattern.flags);
      let m;
      while ((m = re.exec(src)) !== null) {
        const claimed = Number(m[1]);
        const actual = c.verify({ root });
        if (actual === null) continue;
        results.push({
          file: path.basename(f),
          label: c.label,
          claimed,
          actual,
          match: claimed === actual,
        });
      }
    }
  }

  if (flags.has("--json")) {
    jsonOut({
      total: results.length,
      drift_count: results.filter((r) => !r.match).length,
      results,
    });
    return 0;
  }

  header("🌊 메모리 ↔ 현실 drift");
  if (files.length === 0) {
    info("메모리 디렉토리 없음 — 검사 스킵");
    return 0;
  }
  if (results.length === 0) {
    info("추출 가능한 주장 없음");
    return 0;
  }
  for (const r of results) {
    const fmt = `${r.file} [${r.label}] 주장 ${r.claimed} vs 실제 ${r.actual}`;
    if (r.match) ok(fmt);
    else fail(`${fmt} (drift)`);
  }
  const drift = results.filter((r) => !r.match).length;
  if (drift > 0) process.stdout.write(`\n${color.yellow}drift ${drift}건${color.reset} — 메모리 파일 갱신 필요\n`);
  return 0;
}

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}
