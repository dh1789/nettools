// 하네스 공통 유틸 — 색상, 출력, 파일 IO.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const isTTY = process.stdout.isTTY && !process.env.NO_COLOR;
const C = {
  reset: isTTY ? "\x1b[0m" : "",
  red: isTTY ? "\x1b[31m" : "",
  green: isTTY ? "\x1b[32m" : "",
  yellow: isTTY ? "\x1b[33m" : "",
  blue: isTTY ? "\x1b[34m" : "",
  cyan: isTTY ? "\x1b[36m" : "",
  gray: isTTY ? "\x1b[90m" : "",
  bold: isTTY ? "\x1b[1m" : "",
};

export const color = C;

export function ok(msg) {
  process.stdout.write(`${C.green}✅${C.reset} ${msg}\n`);
}

export function fail(msg) {
  process.stdout.write(`${C.red}❌${C.reset} ${msg}\n`);
}

export function warn(msg) {
  process.stdout.write(`${C.yellow}⚠️${C.reset}  ${msg}\n`);
}

export function info(msg) {
  process.stdout.write(`${C.cyan}ℹ️${C.reset}  ${msg}\n`);
}

export function header(msg) {
  process.stdout.write(`\n${C.bold}${msg}${C.reset}\n`);
}

export function section(msg) {
  process.stdout.write(`\n${C.cyan}${msg}${C.reset}\n`);
}

export function readText(p) {
  return fs.readFileSync(p, "utf8");
}

export function exists(p) {
  return fs.existsSync(p);
}

export function fileSize(p) {
  try {
    return fs.statSync(p).size;
  } catch {
    return 0;
  }
}

export function tryExec(cmd, opts = {}) {
  try {
    return execSync(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      ...opts,
    });
  } catch (e) {
    return { __error: true, stdout: e.stdout?.toString() ?? "", stderr: e.stderr?.toString() ?? "", status: e.status };
  }
}

export function gitChangedFiles(diffArgs = "HEAD") {
  const out = tryExec(`git diff --name-only ${diffArgs}`);
  if (typeof out !== "string") return [];
  return out.split("\n").filter(Boolean);
}

export function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => !ext || f.endsWith(ext))
    .map((f) => path.join(dir, f));
}

export function jsonOut(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

export function bytesHuman(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)}MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)}GB`;
}

export function nowIso() {
  return new Date().toISOString();
}
