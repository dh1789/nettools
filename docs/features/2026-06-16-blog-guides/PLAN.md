# PLAN: 블로그 도구 가이드 글 5편 추가 (blog-guides)

**Status**: TODO

## 메타데이터
| 항목 | 내용 |
|------|------|
| **Status** | TODO |
| **생성일** | 2026-06-16 |
| **예상 완료** | 2026-06-16 |
| **프로젝트 타입** | Node.js/TypeScript |
| **언어/프레임워크** | TypeScript · Next.js 15 (App Router, output: export) · MDX |
| **테스트 프레임워크** | Jest (next/jest) |
| **실행 환경** | 로컬 (macOS), Node 26 |

---

## 아키텍처 결정사항

| 결정사항 | 근거 | 트레이드오프 |
|---------|------|-------------|
| 기존 MDX 파이프라인 재사용 (소스만 추가) | `lib/blog.ts`·SSG·sitemap 그대로. 신규 코드 0 | 글 추가마다 재빌드(정적 빌드 특성) |
| 가이드 글 전용 검증 테스트 신설 | comparison-posts.test는 비교글(비교표) 전용. 가이드는 비교표 없음 | 테스트 파일 1개 추가 |
| 각 글 ko/en 쌍 필수 (TR-7) | locale별 SSG 본문 언어 일치 → 색인 안전 | 글당 2파일 |
| relatedTools는 실재 도구 slug만 | 깨진 내부링크 = 빌드/SEO 손상 | 작성 시 slug 대조 |

---

## 주요 컴포넌트

### 컴포넌트 1: 신규 MDX 글 10파일 (`src/content/blog/`)
- `jwt-generate-guide.{ko,en}.mdx` — JWT 생성/HMAC 서명. relatedTools: jwt-generator, jwt-decoder
- `ssl-certificate-check-guide.{ko,en}.mdx` — SSL 인증서 확인. relatedTools: ssl-checker
- `chmod-permissions-guide.{ko,en}.mdx` — chmod 권한. relatedTools: chmod-calculator
- `dns-records-guide.{ko,en}.mdx` — DNS 레코드. relatedTools: dns-lookup
- `base64-encoding-guide.{ko,en}.mdx` — Base64. relatedTools: base64, image-base64-converter

### 컴포넌트 2: 가이드 글 검증 테스트 (`src/lib/__tests__/blog-guides.test.ts`)
- 책임: 신규 5글의 frontmatter 스키마 + ko/en 쌍 + relatedTools slug 유효성 검증
- 의존성: `lib/blog.ts` parseFrontmatter, `data/tools.ts` getAllSlugs

---

## Phase 구성

```
Phase 1 (1.5h): 가이드 검증 테스트 + 1편 파일럿 (jwt-generate-guide ko/en)
Phase 2 (2h):   2편 추가 (ssl-certificate-check, chmod-permissions) ko/en
Phase 3 (2h):   2편 추가 (dns-records, base64-encoding) ko/en + 빌드/sitemap 검증
```

---

### Phase 1: 검증 테스트 + 파일럿 글

**목표**: 가이드 글 검증 테스트를 먼저 세우고 1편(JWT 생성) 작성으로 패턴 확정
**예상 시간**: 1.5시간

#### 🔴 RED — `src/lib/__tests__/blog-guides.test.ts`

테스트 파일: `src/lib/__tests__/blog-guides.test.ts`

단위 테스트 케이스 (≥4):
1. `각 가이드 slug는 ko/en MDX 쌍이 존재한다` — fs 존재 확인 (✅ Happy)
2. `필수 frontmatter 필드 존재 (title/description/category/keywords≥3/publishedAt)` — parseFrontmatter (✅ Happy)
3. `publishedAt이 YYYY-MM-DD 형식` (🔶 Boundary)
4. `relatedTools가 ≥1이며 전부 실재 도구 slug` — getAllSlugs와 대조 (🔶 Boundary, 깨진 링크 검출)
5. `본문에 연계 도구 링크 /tools/net/<slug>/ 최소 1개 포함` (🔶 Boundary)
6. `category가 유효 ToolCategory(network/security/linux/developer/general)` (🔶 Boundary)

GUIDE_SLUGS 배열을 테스트 상단에 정의(5개). 각 slug × 검증을 forEach.
`npm test` → **실패 확인** (글 미작성 → 파일 없음/frontmatter 없음).

#### 🟢 GREEN — `jwt-generate-guide.{ko,en}.mdx` 작성

- frontmatter: title("JWT 토큰 생성과 HMAC 서명 — HS256 완벽 가이드"), description,
  category: security, keywords(≥3: "jwt 생성", "jwt 서명", "hmac", "hs256"...),
  publishedAt: "2026-06-16", relatedTools: [jwt-generator, jwt-decoder], author: NetTools Team
- 본문: 도입(테스트 토큰 발급 상황) → JWT 서명 원리(HMAC) → 단계별
  (jwt-generator 도구 링크) → HS256/384/512 차이 → FAQ 3개 → 마무리
- en: 동일 구조 영어 본문
- GUIDE_SLUGS에 5개 다 넣되, Phase 1은 jwt-generate-guide만 작성 → 나머지 4개는 Phase 2~3에서.
  (테스트는 작성된 글만 통과하도록 GUIDE_SLUGS를 단계적으로 채우거나, describe.each에 작성분만 우선)

**구현 메모**: GUIDE_SLUGS를 Phase별로 늘리면 테스트-글 동기화가 깔끔.
Phase 1 테스트는 `["jwt-generate-guide"]`만 검증.

`npm test` → **통과**.

### Quality Gate (Phase 1)
- [ ] blog-guides.test 신규 케이스 ≥4 통과 (jwt-generate-guide 기준)
- [ ] frontmatter 스키마 + relatedTools slug 유효
- [ ] `npx tsc --noEmit` 통과

### 롤백
- jwt-generate-guide.{ko,en}.mdx + blog-guides.test.ts 삭제

---

### Phase 2: SSL·chmod 가이드 2편

**목표**: 2편 추가, GUIDE_SLUGS 확장 검증
**예상 시간**: 2시간

#### 🔴 RED — GUIDE_SLUGS 확장

`blog-guides.test.ts`의 GUIDE_SLUGS에 `ssl-certificate-check-guide`, `chmod-permissions-guide`
추가 → 글 미작성 상태로 `npm test` → **실패 확인**.

단위 테스트 케이스 (≥2, 확장된 GUIDE_SLUGS에 자동 적용):
1. `ssl-certificate-check-guide: ko/en 쌍 + frontmatter + relatedTools(ssl-checker) 유효`
2. `chmod-permissions-guide: ko/en 쌍 + frontmatter + relatedTools(chmod-calculator) 유효`

#### 🟢 GREEN — 2편 작성

- `ssl-certificate-check-guide.{ko,en}.mdx`: category security, relatedTools[ssl-checker].
  본문: SSL 인증서 구조 → 만료/발급자 확인 → ssl-checker 도구 링크 → FAQ
- `chmod-permissions-guide.{ko,en}.mdx`: category linux, relatedTools[chmod-calculator].
  본문: 퍼미션 비트(rwx) → 숫자 표기(755/644) → chmod-calculator 링크 → FAQ

`npm test` → **통과**.

### Quality Gate (Phase 2)
- [ ] 확장 GUIDE_SLUGS(3개) 전부 검증 통과
- [ ] `npm run lint` (MDX는 lint 대상 외지만 코드 변경 시) / tsc 통과

### 롤백
- 2편 4파일 삭제, GUIDE_SLUGS 되돌리기

---

### Phase 3: DNS·Base64 가이드 2편 + 빌드 검증

**목표**: 마지막 2편 + 프로덕션 빌드/sitemap 검증
**예상 시간**: 2시간

#### 🔴 RED — GUIDE_SLUGS 최종 확장 + sitemap 테스트

`blog-guides.test.ts` GUIDE_SLUGS에 `dns-records-guide`, `base64-encoding-guide` 추가.
추가 단위 테스트:
1. `dns-records-guide: ko/en + relatedTools(dns-lookup) 유효`
2. `base64-encoding-guide: ko/en + relatedTools(base64) 유효`
3. `전체 가이드 5편이 getAllPosts("ko")에 포함된다` — blog.ts 로딩 확인 (통합)

`npm test` → **실패 확인**.

#### 🟢 GREEN — 2편 작성

- `dns-records-guide.{ko,en}.mdx`: category network, relatedTools[dns-lookup].
  본문: DNS 역할 → 레코드 종류(A/AAAA/MX/CNAME/TXT/NS) → dns-lookup 링크 → FAQ
- `base64-encoding-guide.{ko,en}.mdx`: category developer, relatedTools[base64, image-base64-converter].
  본문: Base64 원리(3바이트→4문자) → 사용처(data URI, 이메일) → base64 도구 링크 → FAQ

#### 🔵 검증
1. `npm run build` → 성공
2. sitemap: `grep -c 'blog/.*guide' out/sitemap.xml` → 신규 5 ko 엔트리 확인 (blog 9→14)
3. 산출물: `out/blog/jwt-generate-guide/index.html` h1 한국어 + canonical 확인
4. `./bin/harness verify` → 13/13

### Quality Gate (Phase 3)
- [ ] `npm test` 전체 통과 (기존 646 + 신규)
- [ ] `npm run build` 성공
- [ ] sitemap 블로그 엔트리 9→14
- [ ] 산출물 ko 글 본문 한국어 + canonical 정상

### 롤백
- 2편 4파일 삭제, GUIDE_SLUGS 되돌리기

---

## 진행 상황 추적

| Phase | 상태 | 단위테스트 | 글 |
|-------|------|-----------|-----|
| Phase 1 (검증+JWT) | ⏳ 대기 | ≥4 | 1편 |
| Phase 2 (SSL·chmod) | ⏳ 대기 | ≥2 | 2편 |
| Phase 3 (DNS·Base64+빌드) | ⏳ 대기 | ≥3 | 2편 |

**총 단위 테스트 ≥ 9 (Phase 3개 ≥ 각 1)**

---

## 최종 체크리스트

- [ ] 신규 10 MDX(5글×2언어) frontmatter 스키마 통과
- [ ] relatedTools 전부 실재 도구 slug (깨진 링크 0)
- [ ] 각 글 본문에 연계 도구 링크 ≥1
- [ ] ko 본문 한국어 / en 본문 영어 (TR-7)
- [ ] `npm test` 전체 통과
- [ ] `npm run build` 성공 + sitemap 9→14
- [ ] `harness verify` 13/13

---

## 위험 요소

| 위험 | 확률 | 영향 | 완화 |
|------|------|------|------|
| relatedTools 오타 → 깨진 내부링크 | 중 | 중 | blog-guides.test가 getAllSlugs 대조로 검출 |
| MDX 문법 오류 → 빌드 실패 | 중 | 고 | Phase별 `npm run build` 전 로컬 파싱 + Phase 3 빌드 게이트 |
| ko/en 본문 언어 뒤바뀜 (TR-7) | 저 | 중 | 빌드 산출물 h1 언어 확인 |
| 색인 0이라 즉효 없음 | 높음 | 낮음 | PRD에 명시 — 콘텐츠 자산 목적, 색인은 도메인 신뢰(별개) |
| 기술 내용 오류 (chmod 비트 등) | 중 | 고 | 검증된 사실만, 작성 후 reviewer 확인 |

---

## 참고 자료

- 기존 글: `src/content/blog/jwt-decode-verify.ko.mdx` (가이드 구조 참고)
- 테스트 패턴: `src/lib/__tests__/comparison-posts.test.ts` (frontmatter 검증)
- 파싱: `src/lib/blog.ts` (parseFrontmatter, getAllPosts)
- 운영 가이드: PROJECT_CONVENTIONS(블로그 스키마), HARNESS §14 TR-7(언어 일치)
