// log — 에이전트 작업 로그 표시. .claude/agent_log/YYYY-MM-DD.jsonl 파싱.
import fs from "node:fs";
import path from "node:path";
import { color, header, jsonOut, info } from "./_util.mjs";

export async function run({ flags, opts, root }) {
  const dir = path.join(root, ".claude/agent_log");
  const recent = Number(opts.recent ?? 10);

  if (!fs.existsSync(dir)) {
    info(".claude/agent_log/ 없음 — 로그 미수집 (.claude/hooks 설정 필요)");
    return 0;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl")).sort().reverse();
  const entries = [];
  for (const f of files) {
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split("\n").filter(Boolean);
    for (const l of lines) {
      try {
        entries.push(JSON.parse(l));
      } catch {
        /* skip malformed */
      }
    }
    if (entries.length >= recent) break;
  }
  const slice = entries.slice(0, recent);

  if (flags.has("--json")) {
    jsonOut({ count: slice.length, entries: slice });
    return 0;
  }

  header(`📜 에이전트 로그 (최근 ${slice.length}건)`);
  if (slice.length === 0) {
    info("기록 없음");
    return 0;
  }
  for (const e of slice) {
    const ts = (e.timestamp || "").slice(0, 19).replace("T", " ");
    const what = e.task_type || e.event || "?";
    const files = e.files_changed?.length ? ` ${color.gray}(${e.files_changed.length} files)${color.reset}` : "";
    process.stdout.write(`  ${color.gray}${ts}${color.reset}  ${what}${files}\n`);
  }
  return 0;
}
