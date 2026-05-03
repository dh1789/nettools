#!/usr/bin/env bash
# Claude Code PostToolUse hook — Edit/Write 후 nettools 컴포넌트 lint.
# baseline 대비 신규 ERROR 발견 시 exit 2 + stderr 컨텍스트 → Claude 가 즉시 수정.
# 등록: .claude/settings.json hooks.PostToolUse[matcher=Edit|Write].
set -e

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

# stdin 으로 Claude Code 가 JSON 이벤트 전달 (tool_input.file_path 등)
INPUT=$(cat)
FILE=$(echo "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{try{const o=JSON.parse(d);process.stdout.write(o.tool_input?.file_path||"")}catch{}})' 2>/dev/null || echo "")

# 대상 한정: src/components/**/*.tsx 만
case "$FILE" in
  */src/components/*/*.tsx|*/src/components/*.tsx) ;;
  *) exit 0 ;;
esac

if ! command -v node >/dev/null 2>&1; then exit 0; fi
if [ ! -x ./bin/harness ]; then exit 0; fi

current=$(./bin/harness lint --json 2>/dev/null | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{try{process.stdout.write(String(JSON.parse(d).error_count))}catch{process.stdout.write("0")}})')
baseline=$(cat .harness-lint-baseline 2>/dev/null || echo 0)

if [ "${current:-0}" -gt "${baseline:-0}" ]; then
  >&2 echo "❌ harness lint 신규 ERROR $((current - baseline))건 (baseline=${baseline}, current=${current})"
  >&2 echo "   파일: $FILE"
  >&2 ./bin/harness lint 2>&1 | grep -A1 "$(basename "$FILE")" | head -20
  >&2 echo ""
  >&2 echo "📌 docs/HARNESS_ENGINEERING.md §4 참조 — 위반 규칙 즉시 수정 필요."
  exit 2
fi
exit 0
