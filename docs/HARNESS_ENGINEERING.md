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

### TR-7. SSG 본문 언어 ≠ 메타데이터 언어 → 색인 보류

**증상**: GSC "크롤링됨 - 현재 색인이 생성되지 않음" 다수. 도구 페이지가 200 + `index,follow` + canonical 정상인데 색인 안 됨. 라이브 HTML 의 `<h1>`/`<h2>` 가 영어(`Subnet Calculator`, `About This Tool`)인데 `<title>`/`description`/`og:locale`/`<html lang>` 은 한국어.

**원인**: `LocaleProvider` 의 `useState<Locale>(DEFAULT_LOCALE)` 초기값이 `DEFAULT_LOCALE`. `output: "export"` SSG 빌드는 `useEffect`(클라이언트 전용 `detectBrowserLocale()`) 가 돌기 전 상태로 정적 HTML 을 굽는다. 따라서 **SSG 본문 언어 = `DEFAULT_LOCALE`**. 이게 `"en"` 이면 본문만 영어로 박제되고, `generateMetadata`/`layout` 의 `"ko"` 하드코딩 메타와 불일치 → Googlebot 이 언어 신호 충돌로 색인 보류.

**회복**: `src/lib/i18n.ts` 의 `DEFAULT_LOCALE` 를 사이트 1차 타겟 언어(`"ko"`)로 설정. 반대 언어 사용자는 `detectBrowserLocale()` 에 분기를 둬 클라이언트 mount 후 swap (`navigator.language` 가 `"en"` 으로 시작 → `"en"`).

**검증**: 빌드 후 `grep '<h1' out/tools/net/<slug>/index.html` 로 본문 언어가 메타와 같은지 확인. `<title>` 언어 == `<h1>` 언어 == `<html lang>` 이어야 한다.

**자동 차단 후보 (lint)**: `out/**/index.html` 에서 `<html lang="ko">` 인데 `<h1>` 이 ASCII-only 인 경우 경고 — 미구현.

**최초 발견**: 2026-06 색인 정체 진단 중. 커밋 `aa44cae`.

---

### TR-8. `pgrep -f <스크립트명>` 동시 실행 게이트가 항상 통과한다

**증상**: "동시 실행 금지" 게이트를 걸었는데도 배치 두 개가 같은 Chrome(9335)에 붙어 탭이 섞인다. 사이트맵 재제출 중 Naver 배치가 끼어들어 GSC 탭이 7/24 스냅샷을 렌더한 상태로 읽혔다.

**원인**: `browser-harness < script.py` 는 **stdin 리다이렉트**라 프로세스 cmdline 에 스크립트명이 남지 않는다(`browser-harness` 만 보인다). 따라서 `pgrep -f "sitemap_resubmit\|gsc_batch"` 는 항상 0건 매칭 → 게이트 즉시 통과. `pgrep -f browser-harness` 로 바꿔도 장수 데몬 프로세스 4개가 상시 매칭돼 반대로 영원히 대기한다.

**회복**: 락 디렉토리로 직렬화한다. 래퍼 `~/.claude/projects/-Users-idongho-proj-nettools/ops/bh` 사용(스크래치패드 `/private/tmp` 는 macOS 가 3일 미접근 파일을 지우므로 운영 스크립트는 이 durable 경로에 둔다):
```bash
LOCKDIR=/tmp/bh-nettools.lockdir
for i in {1..180}; do mkdir "$LOCKDIR" 2>/dev/null && { trap 'rmdir "$LOCKDIR"' EXIT; break; }; sleep 5; done
BU_CDP_URL=http://127.0.0.1:9335 BU_NAME=nettools browser-harness < "$SCRIPT"
```
호출은 `./bh <script.py> [logfile]` 로 통일한다.

**자동 차단 후보**: 없음(스크래치패드 영역). 크론 프롬프트에 `./bh` 사용을 명시하는 것으로 대체.

**최초 발견**: 2026-08-24 사이트맵 재제출 + Naver 배치 충돌.

---

### TR-9. GSC Sitemaps 입력칸 대신 상단 'URL 검사' 검색바를 집는다

**증상**: 사이트맵 제출이 무음 실패한다. 타이핑한 값도 정상이고 제출 버튼(88×36 DIV, 좌표 1355,238)도 좌표·네이티브 양쪽으로 클릭되는데 목록의 제출 날짜가 안 바뀐다.

**원인**: `document.querySelectorAll('input')` 을 순회해 "폭 150 초과 + 보이는 것" 중 **첫 번째**를 고르면 페이지 최상단의 **URL 검사 검색바**(y≈32, w≈664)가 걸린다. 사이트맵 URL 입력칸은 그 아래(제출 버튼과 같은 행, y≈238)에 있다. 결국 검색바에 타이핑하고 **빈 사이트맵 입력칸**으로 제출을 누른 셈이라 아무 일도 안 일어난다.

**회복**: `r.y >= 100` 으로 상단 검색바를 배제하고, 제출 버튼의 y 에 **가장 가까운** input 을 고른다(같은 행이므로 `dy` 최소값). 상대 경로 금지(TR-9 이전부터 알려진 함정 — `sc-domain:` 속성은 `https://beomanro.com/sitemap.xml` 전체 URL 필수)와 별개 문제다.

**검증**: 토스트 문구는 잡히지 않을 때가 있으니 **목록 행의 제출 날짜가 오늘로 바뀌었는지**로 판정한다.

**자동 차단 후보**: 없음(외부 SPA).

**최초 발견**: 2026-08-24 사이트맵 14일 정체 해소 작업. 3회 시도 만에 성공(79→82 / 22→25).

---

### TR-10. 클라이언트 언어 토글은 검색엔진에 보이지 않는다 (en 콘텐츠 SEO 가치 0)

**증상**: ko/en 쌍으로 가이드 25편을 썼는데 GSC·`site:` 어디에도 영어 페이지가 없다. `?lang=en` 이나 언어 버튼으로 본 화면은 영어인데, `curl` 로 받은 HTML 은 어떤 URL 이든 `<html lang="ko">` + 한국어 본문이고 `hreflang` 도 없다.

**원인**: 언어가 **URL 이 아니라 React 상태**였다. `LocaleProvider` 가 mount 후 `navigator.language`/localStorage 로 텍스트만 갈아끼웠다. 정적 export 는 URL 당 HTML 하나만 굽고, 그 HTML 은 `DEFAULT_LOCALE`(ko) 로 고정된다(TR-7 의 반대편 함정). 검색엔진은 URL 단위로 문서를 색인하므로 URL 이 하나면 언어도 하나다. `docs/TODO.md` 의 "en 은 hreflang 변형" 기록은 사실이 아니었다 — hreflang 태그 자체가 없었다.

**회복**: 로케일을 라우트가 결정하게 한다.
- `app/(ko)/…`(무프리픽스) 와 `app/(en)/en/…` **루트 레이아웃 2개**(route group). 각자 `<html lang>` 과 `LocaleProvider initialLocale` 을 고정. `SiteShell` 이 공용 껍데기.
- 동적 라우트는 `ToolRoute`/`BlogPostRoute`/`CategoryRoute` 빌더를 로케일만 달리 호출.
- 메타: `localeAlternates(path, locale)` → canonical(자기 로케일) + `hreflang` ko/en/x-default. 사이트맵은 `localizeSitemapEntries` 가 ko 시드마다 en 트윈을 붙인다.
- 내부 링크는 `useLocale().href(path)` / `localePath(path, locale)` 로만 만든다(프리픽스 + trailing slash). 언어 전환은 반대 로케일 URL 로 **이동**(`LanguageSwitcher`).
- 브라우저 언어 자동 스왑 제거 — URL 이 단일 진실.

**검증**: `npm run build` 후 `out/en/**/index.html` 이 존재하고 `<html lang="en">`, `<h1>` 영어, `<link rel="alternate" hreflang="…">` 3종이 ko/en 양쪽에 있는지 grep. `out/sitemap.xml` 에 `/en/` URL 과 `xhtml:link` 가 있는지 확인.

**자동 차단 후보**: lint — `src/components/layout/**` 의 `href="/…"` 리터럴(로케일 헬퍼 미경유) 경고. 미구현.

**최초 발견**: 2026-08-29 AdSense 접근법 적대적 재평가. en.mdx 25편이 두 달간 검색 비가시였음.

---

### TR-11. `title.template` 과 페이지 제목 접미사가 겹쳐 `| NetTools | NetTools`

**증상**: 라이브 `<title>` 이 `서브넷 계산기 — 무료 온라인 도구 | NetTools | NetTools`. 모든 도구·가이드·법적 문서 페이지에서 수 개월간 지속(검색 결과 스니펫에 그대로 노출).

**원인**: 루트 레이아웃 `metadata.title.template = "%s | NetTools"` 가 **자식 세그먼트**의 문자열 title 에 접미사를 붙이는데, `seo.ts` 의 생성기도 `… | NetTools` 를 붙여 반환했다. 홈(`app/(ko)/page.tsx`)만 레이아웃과 같은 세그먼트라 템플릿이 적용되지 않아 정상으로 보였고, 그래서 눈에 안 띄었다.

**회복**: 페이지 레벨 생성기는 접미사 없는 제목만 반환(`${title} — 무료 온라인 도구`). 템플릿을 피해야 하는 브랜드 전체 제목(홈)은 `title: { absolute: "…" }`. `/en/` 홈은 `(en)/layout.tsx` 의 자식 세그먼트라 템플릿이 붙으므로 absolute 가 필수.

**검증**: `npm run build` 후 `grep -o '<title>[^<]*' out/**/index.html | grep -c 'NetTools | NetTools'` 가 0.

**자동 차단 후보**: 빌드 후 `out/` 전수 grep 을 `bin/harness smoke` 에 추가 — 미구현.

**최초 발견**: 2026-08-30 /en/ 라우트 빌드 검증 중. 라이브 확인으로 기존 결함임을 확정.

---

### TR-12. 루트 레이아웃을 route group 으로 나누면 `404.html` 이 껍데기만 남는다

**증상**: `app/layout.tsx` 를 지우고 `app/(ko)/layout.tsx`·`app/(en)/layout.tsx` 두 루트 레이아웃으로 나눈 뒤, `out/404.html` 이 `<html>`(lang 없음) + `404: This page could not be found.` 만 있는 Next 내장 기본 문서로 바뀐다. 헤더·푸터·다크모드 CSS 전부 없음. 빌드는 성공하므로 눈치채기 어렵다.

**원인**: 전역 `/_not-found` 라우트는 어느 route group 에도 속하지 않아 감쌀 루트 레이아웃이 없다. Next 는 이때 내부 기본 레이아웃으로 대체한다. `app/not-found.tsx` 를 두어도 같은 이유로 기본 껍데기에 감싸지므로(자체 `<html>` 을 넣으면 중첩) 해결이 안 된다.

**회복**: Next 15.4+ 의 `experimental.globalNotFound: true` + `app/global-not-found.tsx`. 이 파일은 **문서 전체(`<html>`/`<body>`)를 스스로 렌더**해야 하므로 `SiteShell` 을 그대로 감싼다. `metadata` 로 `robots: { index: false }` 와 절대 제목을 준다. 로케일을 알 수 없으니 ko 껍데기 + `/` `/en/` 양쪽 링크.

**검증**: `npm run build` 후 `grep -o '<html[^>]*>' out/404.html` 이 `lang="ko"` 를 포함하고 `grep -c NetTools out/404.html` ≥ 1. 라이브는 `curl -s https://beomanro.com/없는경로/ | grep -c NetTools` ≥ 1.

**함께 걸린 것**: Cloudflare Workers Static Assets 는 `wrangler.jsonc` 의 `assets.not_found_handling` 기본값이 `"none"` 이라 `404.html` 이 있어도 **빈 본문 404** 를 보낸다(라이브에서 수개월간 그랬다). `"not_found_handling": "404-page"` 를 설정해야 파일이 서빙된다.

**자동 차단 후보**: `bin/harness smoke` 에 `out/404.html` lang 검사 + 라이브 404 본문 길이 검사 추가 — 미구현.

**최초 발견**: 2026-08-30 /en/ 라우트 도입(TR-10) 빌드 검증 중.

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
