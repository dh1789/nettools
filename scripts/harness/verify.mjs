// verify — 불변 조건 검증. 실패 시 exit 1 (pre-commit 게이트).
import fs from "node:fs";
import path from "node:path";
import { ok, fail, header, jsonOut, color } from "./_util.mjs";

export async function run({ flags, root }) {
  const cfgPath = path.join(root, "config/harness/invariants.json");
  if (!fs.existsSync(cfgPath)) {
    process.stderr.write("config/harness/invariants.json 없음\n");
    return 2;
  }

  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const results = [];

  for (const inv of cfg.invariants) {
    const r = await runOne(inv, root);
    results.push({ id: inv.id, category: inv.category, ...r, message_on_fail: inv.message_on_fail });
  }

  if (flags.has("--json")) {
    jsonOut({
      passed: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      total: results.length,
      results,
    });
    return results.some((r) => !r.ok) ? 1 : 0;
  }

  header("🔒 불변 조건 검증");
  for (const r of results) {
    if (r.ok) ok(`${r.id}: ${r.detail}`);
    else fail(`${r.id}: ${r.detail || r.message_on_fail}`);
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  process.stdout.write(`\n${color.bold}결과:${color.reset} ${passed}/${results.length} 통과`);
  if (failed > 0) process.stdout.write(`, ${color.red}${failed}건 실패${color.reset}`);
  process.stdout.write("\n");

  return failed > 0 ? 1 : 0;
}

async function runOne(inv, root) {
  switch (inv.type) {
    case "file_exists": {
      const p = path.join(root, inv.path);
      const exists = fs.existsSync(p);
      return { ok: exists, detail: exists ? `${inv.path} 존재` : `${inv.path} 없음` };
    }
    case "file_contains": {
      const p = path.join(root, inv.path);
      if (!fs.existsSync(p)) return { ok: false, detail: `${inv.path} 없음` };
      const src = fs.readFileSync(p, "utf8");
      const re = new RegExp(inv.pattern);
      const m = re.test(src);
      return { ok: m, detail: m ? `${inv.path} 패턴 매칭 OK` : `${inv.path} 에서 패턴 미발견: /${inv.pattern}/` };
    }
    case "file_size_min": {
      const p = path.join(root, inv.path);
      if (!fs.existsSync(p)) return { ok: false, detail: `${inv.path} 없음` };
      const sz = fs.statSync(p).size;
      const okSize = sz >= inv.min_bytes;
      return { ok: okSize, detail: `${inv.path} ${sz}B ${okSize ? "≥" : "<"} ${inv.min_bytes}B` };
    }
    case "custom": {
      const modPath = path.join(root, "scripts/harness", inv.module);
      if (!fs.existsSync(modPath)) return { ok: false, detail: `custom 모듈 없음: ${inv.module}` };
      const mod = await import(modPath);
      try {
        const r = await mod.check({ root });
        return r;
      } catch (e) {
        return { ok: false, detail: `custom 실행 오류: ${e.message}` };
      }
    }
    default:
      return { ok: false, detail: `알 수 없는 type: ${inv.type}` };
  }
}
