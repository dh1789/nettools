# HARNESS_ENGINEERING.md — nettools AI 에이전트 하네스 매뉴얼

> **하네스(harness)** = AI 에이전트(Claude)가 이 코드베이스에서 안전·일관되게 작업하도록 둘러싸는 **자동 검증/진단 인프라**.
> 컨벤션·도메인·코딩 규칙은 [`PROJECT_CONVENTIONS.md`](PROJECT_CONVENTIONS.md) 참조.
>
> 이 문서는 `bin/harness` 도구 모음(`status`/`verify`/`smoke`/`lint`/`defects`/`drift`/`log`)의 사용법, 검증 항목, 확장 방법을 다룬다.

---

## 1. 개념

### 왜 하네스가 필요한가
AI 에이전트는 코드 변경 후 무엇이 깨졌는지 즉시 감지하기 어렵다. 매번 `npm run build` + Cloudflare 배포까지 가서야 깨지는 회귀(예: `output: "export"` 누락, 도구 레지스트리 3중 정합성 깨짐)는 비용이 크다. 하네스는:

1. **불변 조건(invariants)** — 절대 깨지면 안 되는 구성/데이터 상태 자동 검증 (`verify`)
2. **컨벤션 위반 감지** — Next.js/React 안티패턴 정적 분석 (`lint`)
3. **빠른 헬스 체크** — 5초 내 타입체크/데이터/dev 서버 정상 여부 (`smoke`)
4. **상태 진단 리포트** — 작업 전/후 비교용 통합 스냅샷 (`status`)
5. **메모리 ↔ 현실 드리프트 감지** — 에이전트의 잘못된 가정 차단 (`drift`)
6. **결함 추적** — `KNOWN_DEFECTS.md` 파싱 + 미해결 표시 (`defects`)
7. **작업 로그** — 에이전트 행동 기록 (`log`)

### 통합 지점
- **pre-commit hook** (`.githooks/pre-commit`): `verify` 실패 시 커밋 차단, `lint` baseline 비교로 신규 위반만 차단
- **Claude Code hooks** (`.claude/hooks/`): Edit/Write 직후 lint, Stop 시 변경 파일 회귀 알림
- **CI**: 현재 hook 없음 (Cloudflare Pages 빌드 = 배포 게이트). 향후 `.github/workflows/ci.yml` 통합 검토.

---

## 2. CLI 명령 일람

```bash
./bin/harness <command> [options]
```

| 명령 | 목적 | 옵션 | exit code |
|------|------|------|-----------|
| `status` | 시스템 상태 종합 리포트 (작업 전/후 비교용) | `--json` | 항상 0 |
| `verify` | 불변 조건 검증 (pre-commit용) | `--json` | 통과 0 / 실패 1 |
| `smoke` | 5초 헬스 체크 (타입/데이터/dev 서버) | `--json` | 항상 0 (정보용) |
| `lint` | 컨벤션 위반 감지 | `--json` | 항상 0 (pre-commit가 baseline 비교) |
| `defects` | `KNOWN_DEFECTS.md` 결함 목록 | `--json` `--stats` `--all` | 항상 0 |
| `drift` | 에이전트 메모리 ↔ 현실 불일치 감지 | `--json` | 항상 0 |
| `log` | 에이전트 작업 로그 | `--recent=N` `--json` | 항상 0 |
| `help` | 도움말 | — | 0 |

**실행 환경**: Node 18+ 필요 (ESM, top-level await 사용). Homebrew node 손상 시 `brew reinstall node`.

---

## 3. `verify` 불변 조건

`config/harness/invariants.json` 정의. 각 항목은 `type` 에 따라 `file_exists`/`file_contains`/`file_size_min`/`custom` 실행기가 결정. truthy=통과, falsy=실패.

| ID | 카테고리 | 검증 내용 | 실패 의미 |
|----|---------|---------|---------|
| `package_json_present` | infra | `package.json` 존재 | 프로젝트 루트 손상 |
| `next_config_static_export` | convention | `next.config.js` 의 `output: "export"` 유지 | Cloudflare Pages 정적 호스팅 깨짐 |
| `next_config_trailing_slash` | convention | `trailingSlash: true` 유지 | SEO 색인 회귀 (커밋 `05f3279` 참조) |
| `wrangler_config_present` | infra | `wrangler.jsonc` 존재 | Cloudflare 배포 불가 |
| `wrangler_assets_directory` | convention | `assets.directory` = `out` | Next 정적 export 와 어긋남 |
| `tools_data_present` | data | `src/data/tools.ts` 존재 | 모든 동적 라우트 깨짐 |
| `tool_component_index_present` | data | `src/components/tools/index.ts` 존재 | 도구 페이지 렌더 불가 |
| `tool_registry_consistency` | data | `TOOLS[].component` ↔ `TOOL_COMPONENTS` 키 ↔ `<Name>.tsx` 3중 정합성 | 슬러그 페이지 빌드 실패 |
| `tool_slug_uniqueness` | data | `TOOLS[].slug` 중복 없음 | 동적 라우트 충돌 |
| `no_build_artifacts_in_git` | convention | `out/`, `.next/` git 추적 안 됨 | `.gitignore` 누락 |
| `tool_layout_present` | infra | `src/components/layout/ToolLayout.tsx` 존재 | 광고/레이아웃 일관성 깨짐 |
| `sitemap_route_present` | seo | `src/app/sitemap.ts` 존재 | SEO 회귀 |
| `robots_route_present` | seo | `src/app/robots.ts` 존재 | 크롤러 정책 부재 |

**실행 예**:
```bash
./bin/harness verify
# 🔒 불변 조건 검증
# ✅ package_json_present: package.json 존재
# ✅ next_config_static_export: next.config.js 패턴 매칭 OK
# ❌ tool_registry_consistency: tools.ts 에는 있으나 index.ts 에 없음: NewTool
# ...
# 결과: 12/13 통과, 1건 실패
```

**JSON 출력**: `./bin/harness verify --json` → CI/스크립트 연동용.

---

## 4. `lint` 감지 규칙

`scripts/harness/lint.mjs` 정의. 정규식 + 휴리스틱 기반 정적 분석.

| 규칙 ID | 대상 | 위반 패턴 | 심각도 |
|---------|------|---------|--------|
| `use-client-missing` | `src/components/**/*.tsx` | `useState`/`useEffect`/`onClick` 등 사용하면서 `'use client'` 없음 | ERROR |
| `ssr-unsafe-jsx` | `src/components/tools/*.tsx` | JSX 식 `{...}` 안에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()` 직접 호출 | WARNING |
| `console-log-in-component` | `src/components/tools/*.tsx` | 코드 라인 (문자열/주석/백틱 템플릿 외) 의 `console.log(...)` 잔존 | WARNING |
| `tool-component-no-default-export-style` | `src/components/tools/*.tsx` | `export function <FileName>` / `export const <FileName>` 패턴 미발견 | WARNING |

> 참고 — 도구 컴포넌트에서 `<ToolLayout>` 직접 사용은 검사하지 않는다. 본 프로젝트는 `src/components/layout/ToolPageContent.tsx` 가 `TOOL_COMPONENTS` 의 컴포넌트를 외부에서 `<ToolLayout>` 으로 감싸는 패턴이므로 도구 컴포넌트 자체는 ToolLayout 을 import 할 필요가 없다.

**baseline 메커니즘** (pre-commit):
- 첫 실행 시 현재 ERROR 수를 `.harness-lint-baseline` 에 기록
- 후속 커밋은 ERROR 가 baseline 보다 늘어났을 때만 차단 (기존 위반 허용 — 점진적 개선)
- baseline 갱신: 위반을 직접 수정한 뒤 `rm .harness-lint-baseline && ./bin/harness lint --json | jq '.error_count' > .harness-lint-baseline`

**실행 예**:
```bash
./bin/harness lint
# 🧹 컨벤션 lint
# ❌ use-client-missing: src/components/tools/Foo.tsx:12
#    const [state, setState] = useState(0);
# ⚠️ tool-without-toollayout: src/components/tools/Foo.tsx:1
#    ToolLayout 미사용
# 요약: 1 ERROR, 1 WARNING
```

---

## 5. `status` — 시스템 상태 종합 리포트

작업 전/후 비교용 통합 스냅샷. 4개 섹션:

```bash
./bin/harness status
```

**📦 코드/데이터**: 도구 등록 수, 컴포넌트 파일 수, 레지스트리 키 수, OUI 데이터 크기
**⚙️ 인프라**: Node/npm 버전, Next 버전, `output: export` 여부, `trailingSlash` 여부, dev 서버 listen 여부
**🚦 git**: 현재 브랜치, HEAD 커밋, 미커밋/미트래킹 파일 수
**⚠️ 경고** (조건부): 도구 수 불일치, 정적 export 누락, 다량 미커밋, 미해결 결함

**작업 전후 비교**:
```bash
./bin/harness status > /tmp/before.txt
# ... 작업 ...
./bin/harness status > /tmp/after.txt && diff /tmp/before.txt /tmp/after.txt
```

---

## 6. `smoke` — 5초 헬스 체크

| 항목 | 검증 |
|-----|------|
| `node_modules` | 설치 여부 |
| `type-check` | `npx tsc --noEmit` 통과 |
| `jest-config` | `jest.config.js` 존재 |
| `oui-data` | `public/oui.json` 존재 + 100KB 이상 (정상 크기) |
| `public-dir` | `public/` 존재 |
| `dev-server` | 포트 50000 listen 여부 |

서버 재시작 후 또는 의심 상황에서 `./bin/harness smoke` 실행.

---

## 7. `drift` — 메모리 ↔ 현실 불일치 감지

AI 에이전트는 세션 간 메모리(`~/.claude/projects/-Users-idongho-proj-nettools/memory/*.md`)를 가진다. 메모리에 기록된 사실이 현재 코드와 다르면 잘못된 작업으로 이어짐.

`scripts/harness/drift.mjs` 의 `CHECKS` 배열:

| 패턴 | 메모리에서 추출 | 현실 검증 |
|------|---------------|---------|
| `(\d+)개 도구` | 도구 개수 주장 | `TOOLS[]` 의 slug 개수 |
| `포트 (\d+)` | dev 포트 주장 | `package.json scripts.dev` 의 `-p` 값 |

**실행 예**:
```bash
./bin/harness drift
# 🌊 메모리 ↔ 현실 drift
# ✅ project_status.md [도구 개수] 주장 45 vs 실제 45
# ❌ project_status.md [dev 포트] 주장 31000 vs 실제 50000 (drift)
```

drift 감지 시 메모리 갱신 또는 사용자 확인 필요.

---

## 8. `defects` — 결함 카탈로그 추적

[`KNOWN_DEFECTS.md`](KNOWN_DEFECTS.md) 를 파싱해 미해결 결함만 표시.

```bash
./bin/harness defects             # 미해결만
./bin/harness defects --all       # 해결됨 포함
./bin/harness defects --stats     # 통계 (CRITICAL/HIGH/MEDIUM/LOW 카운트)
./bin/harness defects --json
```

**파싱 규칙**: `### {ID}.` 헤더 (예: `### N-1.`) + 본문에 `✅ 해결됨` 마크가 있으면 resolved, 없으면 open. `**심각도**: HIGH` 형식으로 severity 추출.

`status` 명령의 ⚠️ 경고 섹션이 이 결과를 사용.

---

## 9. `log` — 에이전트 작업 로그

`.claude/agent_log/YYYY-MM-DD.jsonl` 에 작업 메타데이터 자동 기록 (Claude Code hook 통해).

```bash
./bin/harness log                  # 최근 10건
./bin/harness log --recent=50      # 최근 50건
./bin/harness log --json
```

**기록 내용**: `timestamp`, `event`, `task_type`, `files_changed[]`. (확장: `tests_affected`, `before_state`, `after_state`)

---

## 10. 3종 게이트 — pre-commit + Claude Code hooks 통합

| 게이트 | 트리거 | 동작 | 차단/알림 |
|------|------|------|----------|
| (1) Claude PostToolUse | Edit/Write 후 (`src/**/*.tsx?` 한정) | `bin/harness lint` baseline 대비 신규 위반 검사 | exit 2 + stderr 컨텍스트 주입 → Claude 즉시 수정 |
| (2) Claude Stop | 턴 종료 시 | 변경된 컴포넌트의 type-check 결과 stderr 알림 | exit 0 (차단 X) — 조기 회귀 가시성 |
| (3) git pre-commit | `git commit` | `harness verify` + `lint` baseline + `tsc --noEmit` | exit 1 → commit 차단 |

### (1) `.claude/hooks/harness-lint-on-edit.sh` (PostToolUse)
- Edit/Write 가 `src/components/**/*.tsx` 수정 시에만 동작
- baseline + 1 이상 ERROR 발견 → exit 2 + 위반 패턴 + 수정 방향 출력
- 정당한 변경이면 baseline 갱신: `./bin/harness lint --json | jq '.error_count' > .harness-lint-baseline`

### (2) `.claude/hooks/harness-typecheck-on-stop.sh` (Stop)
- `git diff --name-only HEAD` 로 변경된 `.ts`/`.tsx` 추출
- `npx tsc --noEmit` 결과 stderr 1줄 알림 (errors 카운트)
- 차단 X (exit 0)

### (3) `.githooks/pre-commit`

```bash
# 1. verify — 불변 조건, 실패 시 차단
./bin/harness verify || exit 1

# 2. lint baseline — 신규 ERROR 만 차단
current=$(./bin/harness lint --json | node -e 'process.stdin.on("data",d=>process.stdout.write(String(JSON.parse(d).error_count)))')
baseline=$(cat .harness-lint-baseline 2>/dev/null || echo 0)
if [ "$current" -gt "$baseline" ]; then
  echo "❌ 신규 lint ERROR $((current - baseline))건 추가됨"
  exit 1
fi

# 3. type-check
npx --no-install tsc --noEmit || exit 1
```

**활성화**:
```bash
git config core.hooksPath .githooks
```

**Claude hook 등록**: `.claude/settings.json` 의 `hooks.PostToolUse` (Edit|Write matcher) + `hooks.Stop` 에 등록 (기본 템플릿 제공됨).

**우회** (권장하지 않음): `git commit --no-verify`

### 회귀 정책

| 항목 | 값 | 강제 |
|------|----|------|
| 타입체크 | `tsc --noEmit` 0 errors | pre-commit 의무 |
| Jest 테스트 | `jest.config.js` 의 `collectCoverageFrom` 대상 100% 통과 | Phase 종료 전 |
| 빌드 | `npm run build` 로컬 통과 | 의심 변경 후 |
| UI 변경 | 브라우저 검증 (`/browse` 또는 수동) | 컴포넌트 직접 수정 시 |

---

## 11. 새 검증 규칙 추가하기

### 새 verify 불변 조건 추가
`config/harness/invariants.json` 의 `invariants` 배열에 항목 추가:

```json
{
  "id": "my_new_check",
  "category": "convention",
  "type": "file_contains",
  "path": "next.config.js",
  "pattern": "myFlag:\\s*true",
  "description": "내 새 검증 조건",
  "message_on_fail": "myFlag 누락 — 운영 정책 위반"
}
```

지원되는 `type`:
- `file_exists` — `path` 존재 여부
- `file_contains` — `path` 의 내용이 `pattern` (정규식) 매칭
- `file_size_min` — `path` 크기 ≥ `min_bytes`
- `custom` — `module` (예: `checks/my-check.mjs`) 의 `check({ root })` 호출, `{ ok: boolean, detail: string }` 반환

### 새 linter 규칙 추가
`scripts/harness/lint.mjs`:

1. `RULES` 객체에 규칙명 + 심각도 추가:
   ```js
   "my-new-rule": { severity: "error", description: "..." }
   ```
2. `scanToolComponents` 또는 `scanAllComponents` 의 루프에서 검사 후 `add(violations, "my-new-rule", rel, line, snippet)` 호출

### 새 drift 체크 추가
`scripts/harness/drift.mjs` `CHECKS` 배열에 `{ pattern, label, verify({ root }) }` 추가.

---

## 12. 골든 트레이스 — 하네스로 사고 진단

### 사례 1: 신규 도구 추가 후 빌드 실패
```bash
./bin/harness verify       # tool_registry_consistency 실패 확인
# → tools.ts 에는 있으나 index.ts 에 없음
# → src/components/tools/index.ts 에 dynamic import 추가
./bin/harness verify       # 재실행 → 통과 확인
```

### 사례 2: Cloudflare 빌드 실패 (정적 export 회귀)
```bash
./bin/harness verify       # next_config_static_export 또는 wrangler_assets_directory 실패
./bin/harness status       # 인프라 섹션의 `output: export` ❌ 표시
git log -- next.config.js  # 회귀 도입 커밋 식별
```

### 사례 3: hydration mismatch 의심
```bash
./bin/harness lint         # ssr-unsafe-render 위반 확인
# 위반 라인의 Date.now()/Math.random() 을 useEffect 안으로 이동
```

### 사례 4: 메모리 기반 잘못된 가정
```bash
./bin/harness drift        # 메모리 주장 vs 현실 비교
# drift 감지되면 memory/*.md 갱신 또는 사용자 확인
```

---

## 13. 관련 파일

| 파일 | 역할 |
|------|------|
| `bin/harness` | CLI 엔트리포인트 (Node ESM) |
| `scripts/harness/_util.mjs` | 공통 유틸 (색상/포맷/exec) |
| `scripts/harness/status.mjs` | 상태 진단 |
| `scripts/harness/verify.mjs` | 불변 조건 검증 (실행기) |
| `scripts/harness/lint.mjs` | 컨벤션 위반 감지 |
| `scripts/harness/smoke.mjs` | 5초 헬스 체크 |
| `scripts/harness/defects.mjs` | KNOWN_DEFECTS.md 파싱 |
| `scripts/harness/drift.mjs` | 메모리 ↔ 현실 불일치 |
| `scripts/harness/log.mjs` | 에이전트 작업 로그 |
| `scripts/harness/checks/*.mjs` | `verify` custom 체크 모듈 |
| `config/harness/invariants.json` | verify 규칙 정의 |
| `.githooks/pre-commit` | pre-commit 통합 |
| `.claude/hooks/*.sh` | Claude Code hook 스크립트 |
| `.harness-lint-baseline` | lint baseline (점진적 개선용) |

---

## 14. 함정 카탈로그 — 하네스가 잡지 못하는 실패 모드

`verify`/`lint` 는 **알려진 패턴**만 차단한다. 새 실패 모드는 매번 구현 중에 처음 발견되며, 같은 함정에 두 번 빠지지 않도록 여기에 누적 기록한다.

각 항목: **증상 → 원인 → 회복 → (가능하면) 자동 차단 후보 → 최초 발견**.

### TR-1. Cloudflare 빌드 데이터 페치 실패

**증상**: 로컬 `npm run build` 는 통과하지만 Cloudflare Pages 빌드에서 `prebuild` 의 `fetch-oui.mjs` 가 네트워크 오류로 실패.

**원인**: 빌드 환경의 외부 네트워크/DNS 제약. `public/oui.json` 이 git 에 포함되지 않으면 매 빌드마다 페치 시도.

**회복**: OUI 데이터를 git 추적 + 페치 실패 시 캐시된 데이터 사용하는 견고한 fallback (커밋 `a594131`).

**자동 차단 후보 (verify)**: `public/oui.json` 파일 크기 100KB 이상 (smoke `oui-data` 체크).

**최초 발견**: 2026-04~ Cloudflare 빌드 실패.

---

### TR-2. 의존성 메이저 업그레이드 ERESOLVE

**증상**: `npm install` 또는 Cloudflare 빌드의 `npm ci` 가 `ERESOLVE` 로 실패. 로컬 lock 은 멀쩡한데 클린 환경에서 깨짐.

**원인**: `@eslint/js` 등 핵심 패키지를 메이저 버전 올렸을 때 다른 의존성의 peer 버전과 충돌.

**회복**: 호환 가능한 메이저 버전으로 다운그레이드 (커밋 `687512b` 의 `@eslint/js` 9.x 다운그레이드).

**자동 차단 후보**: 어려움. 정책 — 의존성 메이저 업그레이드 시 클린 환경 `npm ci --dry-run` 검증을 PR 본문에 명시.

**최초 발견**: 2026-04~ Cloudflare 빌드 ERESOLVE.

---

### TR-3. trailing slash 정책 누락 → 색인 리디렉션 회귀

**증상**: Google Search Console 에 "리디렉션 있음" 으로 색인 누락. 사이트맵 URL 과 실제 응답 URL 불일치.

**원인**: `next.config.js` 의 `trailingSlash: true` 와 `sitemap.ts` 가 생성하는 URL 형식 불일치. 특히 `output: "export"` 환경은 디렉토리 인덱스(`/foo/index.html`)로 빌드되므로 trailing slash 가 정답.

**회복**: 사이트맵의 모든 URL 끝에 `/` 추가 (커밋 `05f3279`).

**자동 차단 후보 (verify)**: `next_config_trailing_slash` invariant 활성. 추가로 `sitemap.ts` 출력의 URL 형식 검사 lint 규칙 가능.

**최초 발견**: 2026-04~ 색인 누락 발견.

---

### TR-4. 도구 레지스트리 3중 정합성 깨짐

**증상**: 새 도구를 추가했는데 `/tools/<slug>/` 접속 시 404 또는 빌드 시 `ReferenceError: <Component> is not defined`.

**원인**: 다음 3곳 중 하나만 갱신:
1. `src/data/tools.ts` 의 `TOOLS[]` 항목
2. `src/components/tools/index.ts` 의 `TOOL_COMPONENTS` 키
3. `src/components/tools/<Name>.tsx` 파일 + named export

**회복**: 누락된 항목 추가. `npm run new-tool` 사용 시 자동 처리.

**자동 차단 후보 (verify)**: `tool_registry_consistency` invariant 활성.

**최초 발견**: 본 하네스 도입 시 정의됨.

---

### TR-5. SSG hydration mismatch — 렌더 페이즈의 비결정 함수

**증상**: 클라이언트에서 React 콘솔 경고 "Hydration failed because the initial UI does not match what was rendered on the server". 또는 도구의 첫 렌더 결과가 새로고침 때마다 다름.

**원인**: 컴포넌트 본문(렌더 페이즈)에서 `Date.now()`, `Math.random()`, `crypto.randomUUID()` 등을 직접 호출. SSG(서버) 렌더 결과와 클라이언트 첫 렌더가 달라짐.

**회복**: 비결정 값을 `useEffect` 또는 이벤트 핸들러 내부로 이동. 초기값은 안정적인 기본값.

**자동 차단 후보 (lint)**: `ssr-unsafe-jsx` 활성 (JSX 식 안에서의 직접 호출 한정 — 헬퍼 함수 정의 안의 호출은 호출 컨텍스트를 알 수 없어 정적 분석으로는 false positive 가 많아 제외). 헬퍼 함수의 호출 컨텍스트는 코드 리뷰에서 확인.

**최초 발견**: 본 하네스 도입 시 정의됨 (예방적 규칙).

---

### TR-6. Server Component 에서 클라이언트 훅 사용

**증상**: `npm run build` 시 `Error: useState only works in Client Components`.

**원인**: 도구 컴포넌트 파일 상단에 `'use client'` 디렉티브 누락. App Router 의 Server Component 가 기본값.

**회복**: 파일 첫 줄에 `'use client'` 추가.

**자동 차단 후보 (lint)**: `use-client-missing` 활성.

**최초 발견**: 본 하네스 도입 시 정의됨 (예방적 규칙).

---

### 함정 추가 가이드

새 함정 발견 시 다음 형식으로 추가:

```markdown
### TR-N. <한 줄 요약>

**증상**: 사용자/에이전트가 가장 먼저 보게 되는 에러.
**원인**: 본질 (왜 발생하는가).
**회복**: 구체적 코드/명령어 수정.
**자동 차단 후보**: lint/verify 규칙 추가 가능 여부.
**최초 발견**: YYYY-MM-DD PRD/Phase.
```

함정 카탈로그가 충분히 누적되면 (≥3건/카테고리) `scripts/harness/lint.mjs` 신규 규칙으로 승격.

---

## 15. 관련 문서

- [`PROJECT_CONVENTIONS.md`](PROJECT_CONVENTIONS.md) — 컨벤션·도메인·코딩 규칙 (이 문서가 검증하는 대상)
- [`KNOWN_DEFECTS.md`](KNOWN_DEFECTS.md) — 결함 카탈로그 (`defects` 명령이 파싱)
- [`../README.md`](../README.md) — 신규 도구 추가 절차
- [`../CLAUDE.md`](../CLAUDE.md) — 작업 워크플로우 + 안전 규칙
