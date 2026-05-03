// defects — KNOWN_DEFECTS.md 파싱. 미해결 결함 목록.
import fs from "node:fs";
import path from "node:path";
import { color, header, jsonOut, info } from "./_util.mjs";

export async function run({ flags, root }) {
  const p = path.join(root, "docs/KNOWN_DEFECTS.md");
  if (!fs.existsSync(p)) {
    info("docs/KNOWN_DEFECTS.md 없음 — 결함 카탈로그 미작성");
    return 0;
  }
  const src = fs.readFileSync(p, "utf8");
  const blocks = parseBlocks(src);
  const showAll = flags.has("--all");
  const stats = flags.has("--stats");

  const filtered = showAll ? blocks : blocks.filter((b) => !b.resolved);

  if (flags.has("--json")) {
    jsonOut({
      total: blocks.length,
      open_count: blocks.filter((b) => !b.resolved).length,
      resolved_count: blocks.filter((b) => b.resolved).length,
      by_severity: groupBySeverity(blocks.filter((b) => !b.resolved)),
      defects: filtered,
    });
    return 0;
  }

  if (stats) {
    const open = blocks.filter((b) => !b.resolved);
    header("📋 결함 통계");
    const grp = groupBySeverity(open);
    for (const [sev, n] of Object.entries(grp)) {
      process.stdout.write(`  ${sev.padEnd(10)} ${n}건\n`);
    }
    process.stdout.write(`\n  미해결 합계   ${open.length}건 / 전체 ${blocks.length}건\n`);
    return 0;
  }

  header(`📋 결함 카탈로그 ${showAll ? "(전체)" : "(미해결만)"}`);
  if (filtered.length === 0) {
    info("표시할 결함 없음");
    return 0;
  }
  for (const b of filtered) {
    const mark = b.resolved ? `${color.green}✅${color.reset}` : `${color.red}🔴${color.reset}`;
    const sev = b.severity ? `[${b.severity}]` : "";
    process.stdout.write(`${mark} ${b.id} ${sev} ${b.title}\n`);
  }
  return 0;
}

function parseBlocks(src) {
  const matches = [...src.matchAll(/^###\s+([A-Z]+-\d+)\.\s+(.+?)$/gm)];
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const next = matches[i + 1];
    const start = m.index;
    const end = next ? next.index : src.length;
    const body = src.slice(start, end);
    const id = m[1];
    const title = m[2].replace(/✅\s*해결됨/, "").trim();
    const resolved = /✅\s*해결됨/.test(body);
    const sevMatch = body.match(/\*\*(?:심각도|severity|Severity)\*\*[:\s]+([A-Z]+)/i);
    blocks.push({ id, title, resolved, severity: sevMatch?.[1] ?? null });
  }
  return blocks;
}

function groupBySeverity(arr) {
  const g = {};
  for (const b of arr) {
    const k = b.severity ?? "UNSPECIFIED";
    g[k] = (g[k] ?? 0) + 1;
  }
  return g;
}
