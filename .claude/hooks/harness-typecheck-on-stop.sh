#!/usr/bin/env bash
# Claude Code Stop hook — 턴 종료 시 변경된 .ts/.tsx 의 type-check 결과를 stderr 알림.
# 차단 X (exit 0). 조기 회귀 가시성 목적.
# 등록: .claude/settings.json hooks.Stop.
set -e

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

# 변경된 .ts/.tsx 파일 (커밋 안 된 + untracked)
CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
ALL=$(printf "%s\n%s" "$CHANGED" "$UNTRACKED" | grep -v '^$' || true)

if [ -z "$ALL" ]; then exit 0; fi
if ! command -v node >/dev/null 2>&1; then exit 0; fi

# 전체 프로젝트 type-check (Next.js 는 incremental + 빠름)
OUT=$(npx --no-install tsc --noEmit 2>&1 || true)
ERR=$(echo "$OUT" | grep -cE 'error TS' || true)

if [ "${ERR:-0}" -gt 0 ]; then
  >&2 echo "⚠️  tsc --noEmit: ${ERR} 타입 에러 (변경된 ts/tsx 파일 ${ALL//$'\n'/, })"
  >&2 echo "$OUT" | grep -E 'error TS' | head -10
fi
exit 0
