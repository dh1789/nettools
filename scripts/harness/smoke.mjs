// smoke — 5초 헬스 체크. 빠른 정상성 확인. 항상 exit 0 (정보용).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { color, header, jsonOut, ok, fail, warn } from "./_util.mjs";

export async function run({ flags, root }) {
  const checks = [];

  checks.push(checkNodeModules(root));
  checks.push(checkTypeScript(root));
  checks.push(checkJestConfig(root));
  checks.push(checkOuiData(root));
  checks.push(checkPublicDir(root));
  checks.push(checkDevServer());

  if (flags.has("--json")) {
    jsonOut({
      checks: checks.map(({ name, status, detail }) => ({ name, status, detail })),
    });
    return 0;
  }

  header("🚦 smoke (5초 헬스 체크)");
  for (const c of checks) {
    if (c.status === "ok") ok(`${c.name}: ${c.detail}`);
    else if (c.status === "warn") warn(`${c.name}: ${c.detail}`);
    else fail(`${c.name}: ${c.detail}`);
  }
  return 0;
}

function checkNodeModules(root) {
  const exists = fs.existsSync(path.join(root, "node_modules"));
  return { name: "node_modules", status: exists ? "ok" : "fail", detail: exists ? "설치됨" : "npm install 필요" };
}

function checkTypeScript(root) {
  const tsbuild = path.join(root, "tsconfig.json");
  if (!fs.existsSync(tsbuild)) return { name: "tsconfig", status: "fail", detail: "tsconfig.json 없음" };
  try {
    execSync("npx --no-install tsc --noEmit", { cwd: root, stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
    return { name: "type-check", status: "ok", detail: "tsc --noEmit 통과" };
  } catch (e) {
    const out = (e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? "");
    const errCount = (out.match(/error TS/g) || []).length;
    return { name: "type-check", status: "fail", detail: `타입 에러 ${errCount}건` };
  }
}

function checkJestConfig(root) {
  const exists = fs.existsSync(path.join(root, "jest.config.js"));
  return { name: "jest-config", status: exists ? "ok" : "warn", detail: exists ? "jest.config.js 존재" : "Jest 미설정" };
}

function checkOuiData(root) {
  const candidates = ["public/oui-db.json", "public/oui.json"];
  for (const rel of candidates) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) {
      const sz = fs.statSync(p).size;
      return {
        name: "oui-data",
        status: sz > 100_000 ? "ok" : "warn",
        detail: `${rel} ${(sz / 1024).toFixed(1)}KB${sz <= 100_000 ? " (의심스럽게 작음)" : ""}`,
      };
    }
  }
  return { name: "oui-data", status: "warn", detail: "public/oui-db.json 없음 — npm run fetch-oui 필요할 수 있음" };
}

function checkPublicDir(root) {
  const exists = fs.existsSync(path.join(root, "public"));
  return { name: "public-dir", status: exists ? "ok" : "fail", detail: exists ? "public/ 존재" : "public/ 없음" };
}

function checkDevServer() {
  // 50000 포트 listen 여부 (옵션)
  try {
    const r = execSync("lsof -nP -iTCP:50000 -sTCP:LISTEN 2>/dev/null", { encoding: "utf8", timeout: 1500 });
    if (r.trim()) return { name: "dev-server", status: "ok", detail: "포트 50000 listen 중" };
  } catch {
    /* 미실행 */
  }
  return { name: "dev-server", status: "warn", detail: "dev 서버 미실행 (npm run dev 으로 시작 가능)" };
}
