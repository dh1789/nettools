// 빌드 산출물 git 추적 여부 검사.
import { execSync } from "node:child_process";

export function check() {
  let tracked = "";
  try {
    tracked = execSync("git ls-files out .next 2>/dev/null", { encoding: "utf8" });
  } catch {
    return { ok: true, detail: "git ls-files 실행 불가 (저장소 아닐 수 있음)" };
  }
  const lines = tracked.split("\n").filter(Boolean);
  return {
    ok: lines.length === 0,
    detail: lines.length === 0 ? "out/, .next/ 추적되지 않음" : `추적 중인 빌드 산출물 ${lines.length}개`,
  };
}
