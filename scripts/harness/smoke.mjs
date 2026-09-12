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

  // 네트워크를 타므로 기본값에서 빼둔다 — `--live` 로 켠다
  if (flags.has("--live")) checks.push(await checkLiveTrackers());

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

/**
 * 라이브 HTML 에 트래커가 섞여 있는지 본다.
 *
 * 빌드 산출물(`out/`)만 grep 하면 구조적으로 못 잡는다 — Cloudflare 는 Web Analytics
 * 비컨을 엣지에서 브라우저 요청에만 주입하므로 저장소에도 out/ 에도 흔적이 없다.
 * 실제로 `static.cloudflareinsights.com/beacon.min.js` 가 라이브에 돌고 있는데
 * privacy 페이지는 "분석·추적 스크립트도 싣지 않습니다" 라고 적혀 있었다(2026-09-12 발견).
 * 그래서 브라우저 UA 로 라이브를 직접 받아 확인한다.
 */
const TRACKER_PATTERNS = [
  ["cloudflareinsights", "Cloudflare Web Analytics"],
  ["adsbygoogle", "AdSense"],
  ["googlesyndication", "Google Ads"],
  ["ca-pub-", "AdSense 퍼블리셔 ID"],
  ["googletagmanager", "Google Tag Manager"],
  ["google-analytics", "Google Analytics"],
  ["gtag/js", "gtag"],
  ["hotjar", "Hotjar"],
  ["clarity.ms", "Microsoft Clarity"],
  ["plausible.io", "Plausible"],
];

async function checkLiveTrackers() {
  const url = process.env.NETTOOLS_LIVE_URL || "https://beomanro.com/";
  const ua =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
  let html;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      return { name: "live-trackers", status: "warn", detail: `${url} → HTTP ${res.status} (확인 불가)` };
    }
    html = await res.text();
  } catch (e) {
    return { name: "live-trackers", status: "warn", detail: `${url} 요청 실패: ${e.message}` };
  }

  const found = TRACKER_PATTERNS.filter(([p]) => html.includes(p)).map(([, label]) => label);
  if (found.length === 0) {
    return { name: "live-trackers", status: "ok", detail: `${url} 트래커 0건` };
  }
  return {
    name: "live-trackers",
    status: "fail",
    detail: `${url} 에 트래커 ${found.length}건: ${found.join(", ")} — docs/ARCHITECTURE.md §9 위반. privacy 페이지 서술과도 어긋난다`,
  };
}
