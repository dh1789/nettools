// status — 시스템 상태 종합 리포트. 작업 전/후 비교용. 항상 exit 0.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { color, header, section, jsonOut, bytesHuman } from "./_util.mjs";

export async function run({ flags, root }) {
  const data = collect(root);

  if (flags.has("--json")) {
    jsonOut(data);
    return 0;
  }

  header(`📊 nettools 상태 — ${new Date().toISOString()}`);

  section("📦 코드 / 데이터");
  process.stdout.write(`  도구 등록 수      ${data.tools.count}개\n`);
  process.stdout.write(`  컴포넌트 파일 수   ${data.tools.componentFiles}개 (.tsx)\n`);
  process.stdout.write(`  레지스트리 키 수   ${data.tools.registryKeys}개\n`);
  process.stdout.write(`  OUI 데이터        ${data.tools.ouiSize ? `${bytesHuman(data.tools.ouiSize)} (${data.tools.ouiPath})` : "없음"}\n`);

  section("⚙️ 인프라");
  process.stdout.write(`  Node              ${data.infra.node}\n`);
  process.stdout.write(`  npm               ${data.infra.npm}\n`);
  process.stdout.write(`  Next 버전         ${data.infra.next ?? "?"}\n`);
  process.stdout.write(`  output: export    ${data.infra.staticExport ? "✅" : "❌"}\n`);
  process.stdout.write(`  trailingSlash     ${data.infra.trailingSlash ? "✅" : "❌"}\n`);
  process.stdout.write(`  dev 서버 (50000)  ${data.infra.devServer ? "🟢 listen" : "⚫ 미실행"}\n`);

  section("🚦 git");
  process.stdout.write(`  현재 브랜치        ${data.git.branch}\n`);
  process.stdout.write(`  최근 커밋          ${data.git.headShort} ${data.git.headSubject}\n`);
  process.stdout.write(`  미커밋 변경 파일   ${data.git.dirtyCount}개\n`);
  process.stdout.write(`  미트래킹 파일      ${data.git.untrackedCount}개\n`);

  section("⚠️  경고");
  const warns = [];
  if (data.tools.count !== data.tools.registryKeys) warns.push(`도구 수 불일치: TOOLS ${data.tools.count} ≠ REGISTRY ${data.tools.registryKeys}`);
  if (!data.infra.staticExport) warns.push("output: export 누락 — Cloudflare 빌드 깨짐");
  if (data.git.dirtyCount > 20) warns.push(`미커밋 변경 ${data.git.dirtyCount}개 — 커밋 정리 권장`);
  if (data.defects.openCount > 0) warns.push(`미해결 결함 ${data.defects.openCount}건 (defects 명령으로 확인)`);
  if (warns.length === 0) process.stdout.write(`  ${color.green}경고 없음${color.reset}\n`);
  else for (const w of warns) process.stdout.write(`  ${color.yellow}•${color.reset} ${w}\n`);

  return 0;
}

function collect(root) {
  return {
    timestamp: new Date().toISOString(),
    tools: collectTools(root),
    infra: collectInfra(root),
    git: collectGit(root),
    defects: collectDefects(root),
  };
}

function collectTools(root) {
  const toolsTs = readSafe(path.join(root, "src/data/tools.ts"));
  const indexTs = readSafe(path.join(root, "src/components/tools/index.ts"));
  const compDir = path.join(root, "src/components/tools");
  const componentFiles = fs.existsSync(compDir)
    ? fs.readdirSync(compDir).filter((f) => f.endsWith(".tsx") && f !== "ToolLoadingSkeleton.tsx").length
    : 0;
  const ouiPath = ["public/oui-db.json", "public/oui.json"]
    .map((p) => path.join(root, p))
    .find((p) => fs.existsSync(p));
  return {
    count: (toolsTs.match(/slug:\s*"[a-z0-9-]+"/g) || []).length,
    registryKeys: (indexTs.match(/^\s+[A-Za-z0-9_]+:\s*dynamic\(/gm) || []).length,
    componentFiles,
    ouiSize: ouiPath ? fs.statSync(ouiPath).size : 0,
    ouiPath: ouiPath ? path.relative(root, ouiPath) : null,
  };
}

function collectInfra(root) {
  const pkg = JSON.parse(readSafe(path.join(root, "package.json")) || "{}");
  const nextCfg = readSafe(path.join(root, "next.config.js"));
  let devServer = false;
  try {
    const r = execSync("lsof -nP -iTCP:50000 -sTCP:LISTEN 2>/dev/null", { encoding: "utf8", timeout: 1000 });
    devServer = r.trim().length > 0;
  } catch {
    /* ignore */
  }
  return {
    node: process.version,
    npm: tryCmd("npm --version") || "?",
    next: pkg.dependencies?.next ?? null,
    staticExport: /output:\s*["']export["']/.test(nextCfg),
    trailingSlash: /trailingSlash:\s*true/.test(nextCfg),
    devServer,
  };
}

function collectGit(root) {
  const branch = tryCmd("git rev-parse --abbrev-ref HEAD") || "?";
  const headShort = tryCmd("git rev-parse --short HEAD") || "?";
  const headSubject = (tryCmd("git log -1 --pretty=%s") || "").slice(0, 60);
  const dirty = tryCmd("git diff --name-only") || "";
  const untracked = tryCmd("git ls-files --others --exclude-standard") || "";
  return {
    branch,
    headShort,
    headSubject,
    dirtyCount: dirty.split("\n").filter(Boolean).length,
    untrackedCount: untracked.split("\n").filter(Boolean).length,
  };
}

function collectDefects(root) {
  const p = path.join(root, "docs/KNOWN_DEFECTS.md");
  if (!fs.existsSync(p)) return { openCount: 0 };
  const src = fs.readFileSync(p, "utf8");
  const ids = [...src.matchAll(/^###\s+([A-Z]+-\d+)\./gm)].map((m) => m[1]);
  let open = 0;
  for (const id of ids) {
    const re = new RegExp(`^###\\s+${id}\\.[\\s\\S]*?(?=^###\\s+|\\Z)`, "m");
    const block = src.match(re)?.[0] ?? "";
    if (!/✅\s*해결됨/.test(block)) open++;
  }
  return { openCount: open, totalIds: ids.length };
}

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function tryCmd(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 2000 }).trim();
  } catch {
    return "";
  }
}
