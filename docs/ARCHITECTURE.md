# ARCHITECTURE — 저장소 구조와 도구 추가 절차서

> 목적: 새 도구/가이드를 추가할 때 **무엇을 어디에 만들어야 하는가**를 단계별로 확정한다.
> 작성 기준: 2026-09-12 실측 (도구 47 · 가이드 25편 ko/en · 테스트 854).
> 관련: [PROJECT_CONVENTIONS.md](PROJECT_CONVENTIONS.md)(코딩 규칙) · [HARNESS_ENGINEERING.md](HARNESS_ENGINEERING.md)(검증 CLI·함정 카탈로그 TR-1~12).

---

## 1. 스택과 빌드

| 항목 | 값 |
|---|---|
| 프레임워크 | Next.js 15.4.11 App Router · React 19 · TypeScript |
| 렌더링 | **정적 생성 전용** — `output: "export"`, SSR·ISR 없음 |
| URL | `trailingSlash: true` (모든 내부 링크에 슬래시 필수 — TR-3) |
| 산출물 | `out/` — ko 85 + en 83 = 168 HTML |
| 호스팅 | Cloudflare Workers Static Assets (`wrangler.jsonc` → `assets.directory: "out"`) |
| 배포 | **GitHub Actions 없음.** CF 가 저장소에 직접 연동돼 `main` push 시 빌드·배포(관측: push 후 100~160초) |
| 서버 코드 | `worker.ts` 단 하나. `/api/whois` · `/api/http-headers` · `/api/ssl-check` 3개 엔드포인트, 나머지는 `env.ASSETS.fetch` 로 정적 자산 패스스루 |
| 스타일 | 인라인 `style={{}}` + CSS 변수(`--text-primary` 등, `SiteShell` 의 `<style>` 에 정의). Tailwind 는 devDep 에 있으나 **실사용 안 함** |
| 테스트 | Jest (`testEnvironment: node`, jsdom 은 파일 상단 `@jest-environment jsdom` 로 개별 지정) |

빌드 전 `prebuild` 가 `scripts/fetch-oui.mjs`(IEEE OUI DB)와 `scripts/generate-og-images.mjs`(satori/sharp)를 돌린다. **`public/oui-db.json` 은 git 에 커밋된 상태를 유지해야 한다**(빌드 실패 방지, 커밋 `a594131`).

---

## 2. 디렉토리

```
src/
├── app/                          # 라우트 — 페이지는 얇은 껍데기, 로직은 components/layout 으로
│   ├── (ko)/                     #   한국어 루트 레이아웃. 무프리픽스 경로
│   │   ├── layout.tsx            #     SiteShell locale="ko"
│   │   ├── page.tsx              #     /
│   │   ├── about|contact|privacy|terms/page.tsx
│   │   ├── blog/page.tsx · blog/[slug]/page.tsx
│   │   ├── category/[id]/page.tsx
│   │   └── tools/net/[slug]/page.tsx · tools/net/page.tsx
│   ├── (en)/                     #   영어 루트 레이아웃. /en 프리픽스
│   │   ├── layout.tsx            #     SiteShell locale="en"
│   │   └── en/…                  #     (ko) 와 동일 트리
│   ├── global-not-found.tsx      # 전역 404 (루트 레이아웃 2개라 필수 — TR-12)
│   ├── sitemap.ts · robots.ts · rss.xml/route.ts
├── components/
│   ├── layout/                   # 라우트 빌더 + 공용 셸 + 프레젠테이션
│   └── tools/                    # 도구 컴포넌트 47 + index.ts(레지스트리) + ToolLoadingSkeleton
├── content/blog/<slug>.{ko,en}.mdx
├── data/tools.ts                 # 도구 단일 소스 (2,975줄)
└── lib/                          # i18n · seo · blog · mdx-components + __tests__/
```

**페이지 파일은 얇게 유지한다.** `app/(ko)/tools/net/[slug]/page.tsx` 와 `app/(en)/en/tools/net/[slug]/page.tsx` 는 둘 다 `ToolRoute` 를 로케일만 바꿔 호출하는 20줄짜리다. 실제 로직은 `components/layout/ToolRoute.tsx` 한 곳에 있다. 카테고리·블로그도 같은 패턴(`CategoryRoute`, `BlogPostRoute`, `BlogListRoute`).

---

## 3. 라우팅과 i18n

**언어는 URL 이 결정한다.** ko 는 무프리픽스(`/tools/net/base64/`), en 은 `/en` 프리픽스(`/en/tools/net/base64/`). 루트 레이아웃이 2개이고 각자 `<html lang>` 과 `LocaleProvider initialLocale` 을 고정한다.

```
/                        → app/(ko)/page.tsx
/en/                     → app/(en)/en/page.tsx
/tools/net/<slug>/       → app/(ko)/tools/net/[slug]/page.tsx   → ToolRoute locale="ko"
/en/tools/net/<slug>/    → app/(en)/en/tools/net/[slug]/page.tsx → ToolRoute locale="en"
```

⚠️ 도구 경로에 **카테고리 프리픽스 `net` 이 필수**다. `/tools/<slug>/` 는 404.

### 문자열 규칙

| 대상 | 위치 | 형식 |
|---|---|---|
| UI 공통 문자열 | `src/lib/i18n.ts` 의 `T` | `{ ko: "...", en: "..." }` |
| 도구 제목·설명·FAQ 등 | `src/data/tools.ts` | 같은 `Translatable` 객체 |
| 가이드 본문 | `src/content/blog/<slug>.{ko,en}.mdx` | 로케일별 파일 쌍 |

컴포넌트에서 `const { t, locale, href } = useLocale()`.

**내부 링크는 반드시 `href()` 또는 `localePath(path, locale)` 를 거친다.** 하드코딩 `href="/blog/"` 는 en 페이지에서 ko 로 새게 만든다(TR-10). `localePath` 가 로케일 프리픽스와 trailing slash 를 동시에 붙인다.

---

## 4. 도구 하나의 구성 — 3중 정합성

새 도구는 **세 곳을 동시에** 갱신해야 하고, `./bin/harness verify` 의 `tool_registry_consistency` 가 이를 검사한다.

| # | 파일 | 내용 |
|---|---|---|
| 1 | `src/data/tools.ts` | `TOOLS[]` 에 항목 추가. `component: "FooBar"` |
| 2 | `src/components/tools/index.ts` | `TOOL_COMPONENTS` 에 `FooBar: dynamic(...)` 등록 |
| 3 | `src/components/tools/FooBar.tsx` | `"use client"` + **named export** `export function FooBar()` |

셋 중 하나라도 빠지면 동적 라우트가 빌드 시 깨진다. 등록은 `next/dynamic` 지연 로딩이라 초기 번들에 안 들어간다.

### `TOOLS[]` 항목 형태

```ts
{
  slug: "sbom-viewer",                              // URL. /tools/net/sbom-viewer/
  title: { ko: "...", en: "..." },
  description: { ko: "...", en: "..." },            // 메타 description 겸용
  longDescription: { ko: "...", en: "..." },        // 선택 — '도구 소개' 섹션
  category: "security",                             // network|security|linux|developer|general
  keywords: ["...", "..."],                         // ko/en 섞어서
  component: "SbomViewer",                          // ← index.ts 키와 일치
  datePublished: "2026-09-12",
  dateModified: "2026-09-20",                       // 선택
  faqs: [{ question: {ko,en}, answer: {ko,en} }],   // 선택 — FAQPage JSON-LD 로 자동 출력
  howTo: { steps: [{ko,en}] },                      // 선택 — HowTo JSON-LD
  usageExamples: [{ title, scenario, steps[], result }],  // 선택 — howTo 보다 우선
  relatedConcepts: [{ title, description }],        // 선택
  relatedTools: ["other-slug"],                     // 선택 — 하단 링크
}
```

`ToolLayout` 이 이 필드들을 섹션으로 자동 렌더한다. **도구 컴포넌트는 `ToolLayout` 을 직접 import 하지 않는다** — `ToolPageContent` 가 바깥에서 감싼다. 컴포넌트는 도구 본체 UI 만 그린다.

### enhancements 분리 — howTo·relatedConcepts·relatedTools 는 여기에

`src/data/enhancements/{network,security,linux,developer,general}.ts` 의 `*_ENHANCEMENTS` 가 `tools.ts` 로딩 직후 `TOOLS[]` 에 머지된다.

```ts
// enhancements/security.ts
"sbom-viewer": {
  howTo: { steps: [{ko,en}, …] },
  relatedConcepts: [{ title: {ko,en}, description: {ko,en} }, …],
  relatedTools: ["hash-generator", …],
  extraFaqs: [{ question: {ko,en}, answer: {ko,en} }, …],   // tools.ts 의 faqs 뒤에 이어붙는다
  usageExamples: [...],                                      // 선택 — howTo 보다 우선 표시
}
```

⚠️ **머지는 덮어쓰기다.** `TOOLS[]` 에 `howTo`/`relatedConcepts`/`relatedTools` 를 써도 같은 slug 의 enhancement 가 있으면 무시된다. 이 셋은 **enhancements 쪽에만** 두고, `tools.ts` 에는 기본 `faqs` 만 둔다.

### 콘텐츠 품질 규약 (테스트가 강제)

`src/data/__tests__/` 의 CMP-41·CMP-61 테스트가 아래를 검사한다. 하나라도 어기면 `npm test` 가 실패한다.

| 규약 | 내용 |
|---|---|
| FAQ **6개 이상** | `tools.ts` 의 `faqs` + enhancements 의 `extraFaqs` 합계 |
| `relatedConcepts` 필수 | enhancements 에 최소 1개 |
| **양방향 내부 링크** | A 의 `relatedTools` 에 B 가 있으면 **B 의 `relatedTools` 에도 A 가 있어야 한다** |

양방향 규칙 때문에 새 도구를 추가하면 **참조한 도구들의 enhancements 도 함께 수정해야 한다.** 예: `sbom-viewer` 가 `hash-generator`·`json-formatter`·`json-schema-validator`·`json-csv-converter` 를 참조하면 그 4개 항목의 `relatedTools` 에 `"sbom-viewer"` 를 추가한다.

### 가이드(블로그) 연결

가이드 frontmatter 의 `relatedTools` 에 도구 slug 를 넣으면 **역참조로 도구 페이지에 '관련 가이드' 섹션이 자동 생성**된다(`getGuidesForTool`). 도구 쪽에 따로 쓸 필요 없다.

---

## 5. 공통 UI

재사용 가능한 것은 `src/components/layout/` 에 있다.

| 컴포넌트 | 역할 |
|---|---|
| `SiteShell` | `<html>`/`<head>`/`<body>` + Provider + 헤더·사이드바·푸터. 루트 레이아웃 2개가 공유 |
| `ToolLayout` | 도구 페이지 골격 — 제목/설명/본체/소개/관련가이드/사용법/예시/FAQ/관련개념/관련도구 |
| `ToolPageContent` | `useLocale` 로 로케일 뽑아 `ToolLayout` 에 주입 |
| `BlogLayout` · `BlogPostContent` | 가이드 골격(TOC·메타·관련 도구) |
| `ToolCard` · `Sidebar` · `ClientHeader` · `ClientFooter` · `LanguageSwitcher` | 네비게이션 |
| `AdSlot` | 광고 슬롯. `NEXT_PUBLIC_ADSENSE_ID` 미설정 시 렌더 안 함(현재 미설정) |
| `ToolLoadingSkeleton` | dynamic import 로딩 표시 |
| `ComparisonTable` | MDX 전용 비교표 (`src/components/blog/`) |

**입력창·결과표·복사 버튼의 공용 컴포넌트는 없다.** 각 도구가 인라인 스타일로 직접 그린다. 새 도구도 기존 도구(예: `HashGenerator.tsx`, `TextCounter.tsx`)의 마크업을 참고해 같은 시각 언어를 따른다.

---

## 6. SEO

전부 `src/lib/seo.ts` 가 `tools.ts`/MDX frontmatter 로부터 자동 생성한다. **페이지에서 메타를 손으로 쓰지 않는다.**

- `generateToolMetadata(tool, locale)` — title/description/OG/Twitter + `localeAlternates`
- `localeAlternates(path, locale)` — canonical(자기 로케일) + hreflang `ko`/`en`/`x-default`
- `generateToolJsonLd` — WebApplication + BreadcrumbList (+FAQPage/HowTo 가 있으면 자동)
- `sitemap.ts` → `localizeSitemapEntries` — ko 시드마다 en 트윈 생성(166 URL)
- 제목 접미사는 루트 레이아웃의 `title.template` 이 붙인다. **생성기에서 `| NetTools` 를 또 붙이면 중복된다**(TR-11)

---

## 7. 검증 체계

```bash
npm test                 # Jest 854
npm run lint             # next lint
npx tsc --noEmit         # 타입
./bin/harness verify     # 불변조건 13종 (pre-commit 게이트)
./bin/harness lint       # 컨벤션 위반
./bin/harness smoke      # 5초 헬스체크
npm run build            # 정적 빌드 재현
```

`.githooks/pre-commit` 이 `harness verify` + `harness lint` + `tsc` 를 강제한다. 우회(`--no-verify`)는 사용자 명시 요청 시에만.

테스트 위치: 순수 로직은 `src/lib/__tests__/`, 컴포넌트는 `src/components/*/__tests__/`(파일 상단 `@jest-environment jsdom`).

---

## 8. 새 도구 추가 절차 (확정 절차서)

> `npm run new-tool` 이 1~3 을 스캐폴딩하지만 **본문·FAQ·테스트는 직접 써야 한다.** 아래는 수동 기준 전체 절차.

### ① 설계 — 코드 전에 확인

- [ ] slug 결정 (`kebab-case`, 최종 URL `/tools/net/<slug>/`)
- [ ] 카테고리 선택 — `network|security|linux|developer|general`
- [ ] **외부 네트워크 호출이 있는가?** 있으면 설계를 다시 본다(9장 참조)
- [ ] 무거운 파싱/연산이 있는가? → Web Worker + 가상 스크롤 검토
- [ ] `docs/HARNESS_ENGINEERING.md` §14 함정 TR-1~12 훑기

### ② RED — 테스트 먼저

순수 로직(파서·계산기·변환기)을 `src/lib/<name>.ts` 로 **컴포넌트와 분리**하고 `src/lib/__tests__/<name>.test.ts` 를 먼저 쓴다. 실패를 확인한 뒤 구현한다. 컴포넌트에 로직을 섞으면 테스트가 불가능해진다.

### ③ GREEN — 구현

1. `src/lib/<name>.ts` — 순수 함수. `Date.now()`/`Math.random()`/`crypto.randomUUID()` 를 **렌더 경로에서** 호출 금지(SSG hydration mismatch). 이벤트 핸들러·`useEffect` 안에서는 허용.
2. `src/components/tools/FooBar.tsx`
   ```tsx
   "use client";
   import { useState } from "react";
   export function FooBar() { /* 도구 본체만. ToolLayout import 금지 */ }
   ```
3. `src/components/tools/index.ts` 에 등록
   ```ts
   FooBar: dynamic(() => import("./FooBar").then(m => ({ default: m.FooBar })), { loading }),
   ```
4. `src/data/tools.ts` 의 `TOOLS[]` 에 항목 추가 (ko/en 양쪽 문자열 필수, `faqs` 포함)
5. `src/data/enhancements/<category>.ts` 에 `howTo`·`relatedConcepts`·`relatedTools`·`extraFaqs` 추가
6. **참조한 도구들의 `relatedTools` 에 새 slug 를 역으로 추가** (양방향 규칙)

### ④ 검증

```bash
npm test && npm run lint && npx tsc --noEmit && ./bin/harness verify && ./bin/harness lint
npm run build
```

빌드 후 `out/tools/net/<slug>/index.html` 과 `out/en/tools/net/<slug>/index.html` 이 **둘 다** 생겼는지, en 쪽 `<html lang="en">` 과 `<h1>` 이 영어인지 확인한다.

### ⑤ 브라우저 검증 (UI 변경 시 필수)

```bash
npm run dev                      # 0.0.0.0:50000
```
또는 빌드 산출물을 정적 서빙해서 실제 클릭·입력·결과를 확인한다. 외부 요청이 없어야 하는 도구는 **DevTools 네트워크 탭에서 요청 0건**임을 확인한다.

### ⑥ 배포·전파

```bash
git add … && git commit    # pre-commit 훅이 게이트
git push origin main       # CF 가 100~160초 뒤 배포
```

배포 확인 후 IndexNow 로 신규 URL 통지:

```bash
curl -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"beomanro.com","key":"86c594df1551c2ca049a2be12c429eef",
       "keyLocation":"https://beomanro.com/86c594df1551c2ca049a2be12c429eef.txt",
       "urlList":["https://beomanro.com/tools/net/<slug>/",
                  "https://beomanro.com/en/tools/net/<slug>/"]}'
```

### ⑦ 가이드 연결 (선택, 권장)

도구에 대응하는 실무 가이드를 쓰면 `src/content/blog/<guide-slug>.{ko,en}.mdx` frontmatter 의 `relatedTools` 에 도구 slug 를 넣는다. 도구 페이지에 '관련 가이드' 섹션이 자동으로 붙는다. 가이드 추가 시 `src/lib/__tests__/blog-guides.test.ts` 의 `GUIDE_SLUGS` 배열에도 추가해야 한다.

---

## 9. 신규 도구의 네트워크 제약

이 사이트의 포지셔닝은 **"가입 없이. 추적 없이. 오직 도구만."** 이고, 그게 경쟁 사이트 대비 유일한 구조적 차별점이다. 신규 도구는 **브라우저 안에서만 동작**해야 한다.

- 파일 파싱·계산·리포트 생성 전부 클라이언트
- 서버 저장·로깅·전송 금지
- 외부 호출이 불가피하면 **무엇이 어디로 나가는지 UI 에 명시**하고 사용자가 끌 수 있게 한다
- 파일을 받는 도구는 화면에 고지: "이 파일은 브라우저 안에서만 처리되며, 서버로 전송되지 않습니다."

### 기존 도구의 외부 호출 현황 (실측 2026-09-12)

| 도구 | 나가는 곳 | 판정 |
|---|---|---|
| `MacOuiLookup` | `/oui-db.json` (자기 사이트 정적 파일) | ✅ 문제없음 |
| `DnsLookup` | Cloudflare DoH | 조회 도구 — 성격상 불가피 |
| `IpLookup` | ipwho.is / ip.guide | 조회 도구 — 성격상 불가피 |
| `WhoisLookup` · `HttpHeadersChecker` · `SslChecker` | 자체 Worker `/api/*` → 대상 서버 | 조회 도구 — 성격상 불가피 |
| **`QrCodeGenerator`** | **`api.qrserver.com` 으로 사용자 입력 전송** | ❌ **위반** — 아래 |

**`QrCodeGenerator` 는 고쳐야 한다.** QR 에 넣는 내용(URL·와이파이 비밀번호·연락처)이 제3자 서버로 나가는데, 이건 조회 도구처럼 "성격상 불가피"한 경우가 아니다. QR 인코딩은 순수 클라이언트로 구현 가능하다. 슬로건을 직접 반증하는 항목이라 우선순위가 높다.

---

## 10. 절대 하지 말 것

`CLAUDE.md` 의 안전 규칙 + 이 문서 기준:

- `output: "export"` / `trailingSlash: true` 제거
- 3중 정합성 깨기
- 렌더 경로에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()`
- Server Component 에서 `useState`/`useEffect`/이벤트 핸들러 (`"use client"` 필요)
- 내부 링크 하드코딩 (`localePath`/`href()` 우회)
- `seo.ts` 생성기에서 `| NetTools` 중복 부착
- `public/oui-db.json` 등 빌드 데이터 파일 git 제외
- 빌드 산출물(`out/`, `.next/`) 커밋
- 신규 도구에서 사용자 데이터를 외부로 전송
