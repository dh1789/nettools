# PROJECT_CONVENTIONS.md — nettools 코드 컨벤션 / 도메인 규칙 / 안티패턴

> 이 문서는 `bin/harness verify`/`lint` 가 자동으로 검증하는 **정상 상태의 정의**.
> 새 컨벤션을 추가하면 가급적 [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md) §11 의 절차에 따라 자동 검증을 함께 추가.

---

## 1. 디렉토리 레이어

```
src/
├── app/                  # Next.js App Router (Server Component 기본)
│   ├── layout.tsx        # 공통 레이아웃 (LocaleProvider, Header, Footer)
│   ├── page.tsx          # 홈 (도구 목록)
│   ├── tools/[slug]/     # 동적 도구 페이지
│   ├── category/[id]/    # 카테고리 인덱스
│   ├── blog/             # MDX 블로그
│   ├── sitemap.ts        # 동적 sitemap.xml
│   └── robots.ts         # robots.txt
├── components/
│   ├── layout/           # AdSlot, ToolLayout, Header, Footer 등 (재사용 컨테이너)
│   ├── tools/            # 도구 단위 Client Component (한 파일=한 컴포넌트)
│   │   ├── index.ts      # 동적 import 레지스트리 (TOOL_COMPONENTS)
│   │   └── <Name>.tsx    # named export <Name>, ToolLayout 사용
│   └── blog/             # MDX 보조 컴포넌트
├── data/
│   ├── tools.ts          # TOOLS[] 메타데이터 (slug, title, component, FAQ, howTo, ...)
│   └── enhancements/     # 카테고리별 도구별 보강 정보
└── lib/                  # 순수 로직 (i18n, seo, og-image, json-csv 등) — 테스트 대상
```

레이어 책임:
- `app/` — 라우팅 / SEO 메타 / 정적 export 진입점. **비즈니스 로직 금지**, `lib/` 호출만.
- `components/layout/` — 공용 레이아웃. 도구별 로직 없음.
- `components/tools/` — 한 도구 = 한 파일. **`'use client'` 필수** (대부분 인터랙티브).
- `data/` — 정적 메타데이터. 함수 정의는 `getToolBySlug` 같은 단순 셀렉터만.
- `lib/` — 순수 함수 / 테스트 가능한 유틸. 외부 호출은 boundary 명확히.

---

## 2. 새 도구 추가 절차

### 자동 (권장)
```bash
npm run new-tool
# 대화형 입력 → 컴포넌트 + 레지스트리 동시 갱신
```

### 수동
다음 **3곳을 항상 함께** 갱신:

1. `src/components/tools/<Name>.tsx` 생성 — Client Component, named export, ToolLayout import 불필요:
   ```tsx
   "use client";
   import { useState } from "react";
   export function <Name>() {
     const [state, setState] = useState("");
     return <div>...</div>;
   }
   ```
2. `src/components/tools/index.ts` 의 `TOOL_COMPONENTS` 에:
   ```ts
   <Name>: dynamic(() => import("./<Name>").then(m => ({ default: m.<Name> })), { loading }),
   ```
3. `src/data/tools.ts` 의 `TOOLS` 배열에 `{ slug, title, description, category, component: "<Name>", ... }` 추가.

`./bin/harness verify` 가 3중 정합성을 자동 검증.

---

## 3. Server vs Client Component

- App Router 의 모든 컴포넌트는 **Server Component 기본**.
- `useState`/`useEffect`/`useRef`/이벤트 핸들러를 쓰면 → 파일 첫 줄 `"use client";` 필수.
- 도구(`src/components/tools/*`)는 거의 항상 Client Component.
- 레이아웃(`src/components/layout/*`) 은 가능한 한 Server Component 유지 (번들 크기 최소화).
- 도구 컴포넌트는 `<ToolLayout>` 을 직접 import 하지 않는다. `ToolPageContent` 가 외부에서 감싼다 (`src/components/layout/ToolPageContent.tsx`).

자동 검증: lint `use-client-missing`.

---

## 4. SSG / Hydration 안전 규칙

`output: "export"` 정적 빌드라 SSG 결과와 첫 클라이언트 렌더가 일치해야 함.

**금지** (렌더 페이즈에서):
- `Date.now()`, `new Date()` (직접 표시 시)
- `Math.random()`
- `crypto.randomUUID()`
- `window.*`, `document.*` 직접 참조 (typeof 가드 없이)
- locale-dependent 포맷 (`toLocaleString` 등 — 사용 시 동일 locale 강제)

**허용**:
- `useEffect` 내부에서 위 호출 → mount 이후 갱신
- 이벤트 핸들러(`onClick` 등) 내부 호출
- 초기값은 결정적 (예: `useState(() => "")`, `useState(0)`)

자동 검증: lint `ssr-unsafe-render`.

---

## 5. 도구 컴포넌트 컨벤션

- 파일명 = 컴포넌트명 = `TOOL_COMPONENTS` 키 = `TOOLS[].component` 값. 4중 일치.
- **named export 만** 사용 (default export 금지). 예: `export function PasswordGenerator()`.
- 도구 컴포넌트의 최상위는 자유로운 JSX. 광고/공통 헤더/SEO/FAQ 는 `ToolPageContent` 가 외부에서 `<ToolLayout>` 으로 감싸 자동 처리.
- 사용자 입력 → `<output>`/`<pre>` 영역으로 결과 출력. textarea 는 `font-mono` 권장.
- 외부 API 호출(예: DnsLookup, IpLookup, SslChecker, WhoisLookup) 은 **공개 무료 엔드포인트만** (Cloudflare DoH, ip-api.com 등). 요청 키 노출 금지.

자동 검증: lint `tool-component-no-default-export-style`, `ssr-unsafe-jsx`, `console-log-in-component`.

---

## 6. i18n / locale

- 한국어/영어 두 locale. `src/lib/i18n.ts` + `LocaleProvider`.
- 모든 사용자 가시 문자열은 `{ ko: "...", en: "..." }` 객체 또는 `t()` 헬퍼 경유.
- 도구의 `title`, `description`, `faq`, `howTo` 모두 `tools.ts` 에서 ko/en 둘 다 작성.

---

## 7. SEO

- 각 도구 페이지의 메타는 `src/lib/seo.ts` 가 `tools.ts` 정보로 자동 생성 (Open Graph + JSON-LD).
- `sitemap.ts` 는 `TOOLS[].slug` 를 순회해 동적 생성. **모든 URL 은 trailing slash 포함** (TR-3 참조).
- OG 이미지는 `scripts/generate-og-images.mjs` 가 prebuild 단계에서 일괄 생성.
- `robots.ts` 는 모든 라우트 허용 + sitemap 위치 명시.

---

## 8. 데이터 페칭

- 빌드 타임에만 페칭 (정적 export). 런타임 SSR 없음.
- `prebuild` 스크립트:
  - `scripts/fetch-oui.mjs` → `public/oui.json` (MAC OUI 데이터베이스)
  - `scripts/generate-og-images.mjs` → `public/og/<slug>.png`
- 외부 페치 실패 시 캐시된 데이터로 fallback (TR-1 참조). 빌드 자체를 깨뜨리지 말 것.
- 페치 결과는 git 추적 (`public/oui.json`) — Cloudflare 빌드 환경의 네트워크 신뢰 불가.

---

## 9. 테스트

- `lib/` 의 순수 함수는 100% Jest 단위 테스트 (`src/lib/__tests__/*.test.ts`).
- `data/` 의 메타데이터 일관성도 테스트 (`src/data/__tests__/`).
- 컴포넌트 단위 테스트는 선택적이지만 핵심 도구(JsonCsvConverter, ToolLayout)는 `jest.config.js` 의 `collectCoverageFrom` 에 포함.
- E2E/브라우저 검증은 gstack `/browse` 또는 수동.

---

## 10. 빌드 / 배포

- 빌드: `npm run build` → `out/` 정적 HTML.
- 배포: `git push origin main` → Cloudflare Pages 자동 빌드/배포.
- `wrangler.jsonc` 의 `assets.directory: "out"` 고정.
- `worker.ts` 는 정적 자산 핸들러 + 일부 동적 라우트 보조.

자동 검증: verify `next_config_static_export`, `wrangler_assets_directory`.

---

## 11. git / 커밋

- 한글 커밋 메시지 + Conventional Commits prefix:
  - `feat(<scope>): ...` — 신규 도구/기능
  - `fix(<scope>): ...` — 버그 수정
  - `docs: ...`, `chore: ...`, `refactor: ...`
- 빌드 산출물(`out/`, `.next/`) 절대 커밋 금지. 자동 검증: verify `no_build_artifacts_in_git`.
- pre-commit 게이트(`./bin/harness verify lint` + `tsc --noEmit`) 통과 필수. `--no-verify` 는 사용자 명시 요청 시에만.

---

## 12. 의존성 관리

- 메이저 업그레이드 전 클린 환경 `npm ci --dry-run` 으로 ERESOLVE 사전 확인 (TR-2).
- React/Next 메이저는 동시에. 단독 업그레이드 금지.
- TypeScript 5.x 유지 (Next 15 호환).

---

## 13. 안티패턴 (금지 목록)

- ❌ Server Component 에서 `useState` 등 클라이언트 훅
- ❌ 렌더 페이즈에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()`
- ❌ `tools.ts` 만 갱신하고 `index.ts`/컴포넌트 파일 누락
- ❌ default export 로 도구 컴포넌트 작성
- ❌ `output: "export"` 또는 `trailingSlash: true` 제거
- ❌ 빌드 산출물 git 커밋
- ❌ 외부 페치 결과를 git 추적 안 하면서 prebuild 에서 페치 시도
- ❌ 사용자 가시 문자열 하드코딩 (i18n 우회)
- ❌ 도구 컴포넌트에 `console.log` 잔존
