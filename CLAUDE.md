# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소를 다룰 때 참고하는 핵심 지침.

## 프로젝트 개요

**NetTools** — 네트워크 엔지니어/보안 전문가용 무료 웹 도구 모음.

- **Stack**: Next.js 15 (App Router, `output: "export"`) · TypeScript · React 19 · Tailwind v4 · Jest
- **Hosting**: Cloudflare Pages (정적 자산 + Worker)
- **빌드 산출물**: `out/` (정적 HTML)
- **Dev 포트**: 50000 (`npm run dev` → `0.0.0.0:50000`)
- **수익화**: 광고 슬롯(`AdSlot`) — 네트워크 독립적

## 운영 가이드 색인 (작업 전 반드시 참조)

| 문서 | 역할 |
|------|------|
| [docs/PROJECT_CONVENTIONS.md](docs/PROJECT_CONVENTIONS.md) | 레이어 컨벤션·도메인 규칙·코딩 안티패턴·운영 안전 규칙 |
| [docs/HARNESS_ENGINEERING.md](docs/HARNESS_ENGINEERING.md) | `bin/harness` 자동 검증/진단 도구 매뉴얼 (verify/lint/smoke/status/drift/defects/log) |
| [docs/KNOWN_DEFECTS.md](docs/KNOWN_DEFECTS.md) | 구조적 결함 카탈로그 (`harness defects` 가 파싱) |
| [docs/TODO.md](docs/TODO.md) | 도구 추가/인프라 개선 백로그 |
| [docs/features/](docs/features/) | 기능별 PRD/PLAN/PROGRESS 문서 |
| [README.md](README.md) | 신규 도구 추가 절차 (수동 / `npm run new-tool`) |

## 핵심 안전 규칙 (위반 시 즉시 중단)

- ❌ `next.config.js`에서 `output: "export"` 제거 — Cloudflare Pages 정적 호스팅 불가. → 유지 필수
- ❌ `trailingSlash: true` 제거 — 사이트맵/색인 정책 어긋남 (커밋 `05f3279` 참조)
- ❌ `TOOLS[]` slug ↔ `TOOL_COMPONENTS` 키 ↔ `src/components/tools/*.tsx` 파일 3중 정합성 깨뜨리기 — 슬러그 페이지 빌드 실패
- ❌ 도구 컴포넌트에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()` 를 렌더 페이즈에서 호출 — SSG hydration mismatch
- ❌ Server Component에서 `useState`/`useEffect`/이벤트 핸들러 — `'use client'` 필요
- ❌ `public/oui.json` 등 빌드 시 페치되는 데이터 파일 git에서 제외 — Cloudflare 빌드 실패 (커밋 `a594131` 참조)
- ❌ 의존성 무리한 메이저 업그레이드 — ERESOLVE 발생 시 즉시 롤백 (커밋 `687512b` 참조)
- ❌ 빌드 산출물(`out/`, `.next/`) 커밋 — `.gitignore` 위반
- ❌ Bash hook 우회(`git commit --no-verify`) — 사용자 명시 요청 시에만

## 핵심 명령어

```bash
npm run dev                      # 개발 서버 (0.0.0.0:50000)
npm run build                    # 정적 빌드 (out/)
npm run lint                     # next lint
npm test                         # Jest
npm run new-tool                 # 신규 도구 스캐폴딩

./bin/harness status             # 시스템 상태 종합 리포트
./bin/harness verify             # 불변 조건 검증 (pre-commit 게이트)
./bin/harness lint               # 컨벤션 위반 감지
./bin/harness smoke              # 5초 헬스 체크
./bin/harness defects            # KNOWN_DEFECTS.md 미해결 결함
./bin/harness drift              # 메모리 ↔ 현실 불일치
./bin/harness log --recent 20    # 에이전트 작업 로그
```

자세한 옵션: [docs/HARNESS_ENGINEERING.md](docs/HARNESS_ENGINEERING.md).

## 기능 개발 워크플로우 (필수)

```
plan → implement → verify
```

각 단계에서 **반드시** 참조해야 하는 docs:

| 단계 | 도구/명령 | 반드시 참조 |
|------|-----------|------------|
| **plan** | `/plan` 스킬, `docs/features/<slug>/PRD.md` | `docs/PROJECT_CONVENTIONS.md` (컨벤션) · `docs/HARNESS_ENGINEERING.md §14` 함정 카탈로그 · `docs/KNOWN_DEFECTS.md` |
| **implement** | `/implement` 스킬 | RED → 신규 로직은 `src/lib/__tests__/` 에 Jest 테스트 · GREEN → `docs/PROJECT_CONVENTIONS.md` 의 컴포넌트 패턴 · GREEN 직전 → `docs/HARNESS_ENGINEERING.md §14` (TR-1~ 함정 grep) |
| **verify** | `npm test` + `npm run lint` + `./bin/harness verify lint` | UI 변경 시 `npm run dev` → 브라우저 검증 (`/browse` 등) · 빌드 깨짐 의심 시 `npm run build` 로컬 재현 |

신규 함정 발견 시 `docs/HARNESS_ENGINEERING.md §14` 에 `TR-N` 형식으로 추가 — 같은 함정 재발 방지.

테스트 없는 로직 변경 금지. UI 변경 시 브라우저 검증 필수.

## 신규 도구 추가 시 정합성 체크 (3중)

`./bin/harness verify` 의 `tool_registry_consistency` 가 자동 검증하는 항목:

1. `src/data/tools.ts` 의 `TOOLS[].component` (예: `"FooBar"`)
2. `src/components/tools/index.ts` 의 `TOOL_COMPONENTS` 키 (예: `FooBar:`)
3. `src/components/tools/FooBar.tsx` 파일 + named export `FooBar`

3개 중 하나라도 누락되면 동적 라우트 `/tools/<slug>/` 가 빌드 시 깨진다. `npm run new-tool` 사용 시 자동 처리되지만 수동 추가 시 반드시 위 3곳을 함께 갱신.

## 응답·문서 정책

- **한글로 보고** (코드/식별자 제외)
- 라인 끝 공백 / 공백만 있는 라인 만들지 말 것
- 신규 파일 최소화 — 기존 파일 편집 우선
- 사용자 명시 요청 없으면 `*.md` 신규 작성 금지
- 비밀/토큰 절대 커밋 금지 (`.env.local` 등)

## SuperClaude / gstack 사용

루트 `~/.claude/CLAUDE.md` 의 SuperClaude 프레임워크와 gstack 스킬은 그대로 사용. 본 저장소 고유 규칙은 위 색인의 docs 가 우선.
