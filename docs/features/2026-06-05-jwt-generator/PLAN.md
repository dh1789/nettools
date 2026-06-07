# PLAN: JWT 생성기 (jwt-generator)

**Status**: TODO

## 메타데이터
| 항목 | 내용 |
|------|------|
| **Status** | TODO |
| **생성일** | 2026-06-05 |
| **예상 완료** | 2026-06-05 |
| **프로젝트 타입** | Node.js/TypeScript |
| **언어/프레임워크** | TypeScript · Next.js 15 (App Router, output: export) · React 19 |
| **테스트 프레임워크** | Jest (프로젝트 기존 설정 — next/jest) |
| **실행 환경** | 로컬 (macOS), Node 26 |

---

## 아키텍처 결정사항

| 결정사항 | 근거 | 트레이드오프 |
|---------|------|-------------|
| 서명 로직을 `src/lib/jwt-sign.ts` 순수 모듈로 분리 | PROJECT_CONVENTIONS: lib 순수함수 100% 테스트. UI와 분리 | 파일 1개 추가 |
| Web Crypto API (`crypto.subtle`) 사용 | 외부 의존성 0, output:export 호환, 브라우저 네이티브 | async API → 컴포넌트에서 await 처리 |
| HMAC 전용 (HS256/384/512) | 대칭키, secret 문자열만. 비대칭은 키관리 복잡 | RS/ES 미지원 (범위 외 명시) |
| iat 자동삽입은 이벤트 핸들러 내 | TR-5 hydration mismatch 회피 (렌더페이즈 Date.now 금지) | 렌더 시 자동 iat 없음 (의도) |
| category: security + relatedTools에 jwt-decoder | 보안 카테고리(6→7) 보강 + 짝 도구 클러스터 연결 | 짝인데 카테고리 분리 (relatedTools로 해결) |

---

## 주요 컴포넌트

### 컴포넌트 1: `src/lib/jwt-sign.ts` (순수 로직, 테스트 대상)
- 책임: base64url 인코딩 + JWT HMAC 서명
- 인터페이스:
  - `base64UrlEncode(input: string): string` — UTF-8 문자열 → base64url (패딩 제거, +/→-_)
  - `signJwt(headerJson: string, payloadJson: string, secret: string, alg: JwtAlg): Promise<JwtSignResult>`
    - `type JwtAlg = "HS256" | "HS384" | "HS512"`
    - `interface JwtSignResult { token: string | null; error: string }`
    - JSON 파싱 검증 → header.alg를 alg로 강제 동기화 → signing input 조립 → Web Crypto HMAC sign → 토큰 반환
- 의존성: 없음 (Web Crypto는 런타임 글로벌)

### 컴포넌트 2: `src/components/tools/JwtGenerator.tsx` (UI)
- 책임: 입력 폼 + 생성 + 복사. jwt-decoder 패턴(inputStyle/labelStyle/sectionStyle, useLocale, useState/useCallback) 재사용
- 상태: `header`, `payload`, `secret`, `alg`, `token`, `error`, `copied`
- 이벤트: 생성(async handleGenerate), 복사, 예제 로드, iat 삽입
- 의존성: `jwt-sign.ts`, `useLocale`, `T`

### 컴포넌트 3~4: 도구 등록 (3중 정합성)
- `src/data/tools.ts` TOOLS 배열: `{ slug: "jwt-generator", component: "JwtGenerator", category: "security", ... }`
- `src/components/tools/index.ts` TOOL_COMPONENTS: `JwtGenerator` 등록

### 컴포넌트 5: `src/data/enhancements/security.ts`
- `"jwt-generator"` 키: howTo / relatedConcepts / relatedTools(["jwt-decoder","hash-generator","bcrypt-generator"]) / extraFaqs / usageExamples

---

## Phase 구성

```
Phase 1 (1.5h): 순수 서명 로직 jwt-sign.ts — TDD (표준벡터 결정적 검증)
Phase 2 (1.5h): JwtGenerator.tsx 컴포넌트 + 3중 도구 등록
Phase 3 (1h):   enhancement 콘텐츠 + 빌드/정합성 검증
```

---

### Phase 1: 순수 서명 로직 (`src/lib/jwt-sign.ts`)

**목표**: base64url 인코딩 + HMAC JWT 서명을 TDD로 구현. 표준 벡터로 결정적 검증.
**예상 시간**: 1.5시간

#### 🔴 RED — `src/lib/__tests__/jwt-sign.test.ts` 작성 (실패 확인)

테스트 파일: `src/lib/__tests__/jwt-sign.test.ts`

단위 테스트 케이스 (≥6):
1. `base64UrlEncode - ASCII 인코딩 정확성` — `base64UrlEncode("{}")` 등 알려진 출력 (✅ Happy)
2. `base64UrlEncode - 패딩 제거 및 URL-safe 문자` — `=` 없음, `+/` 대신 `-_` (🔶 Boundary)
3. `base64UrlEncode - UTF-8 한글 인코딩` — 멀티바이트 처리 (🔀 Edge)
4. `signJwt - HS256 표준벡터가 SAMPLE_JWT와 바이트 일치` — header/payload/secret `your-256-bit-secret`
   → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` (✅ Happy, 결정적)
5. `signJwt - HS384/HS512는 서로 다른 signature 생성` — alg별 출력 길이/값 상이 (🔶 Boundary)
6. `signJwt - alg 인자가 header.alg를 덮어씀` — header에 `alg:"none"` 줘도 결과 header는 선택 alg (🔶 Boundary)
7. `signJwt - 잘못된 JSON payload → error 반환, token null` (❌ Exception)
8. `signJwt - 빈 secret → error 반환` (❌ Exception)

`npm test` → **신규 테스트 실패 확인** (jwt-sign.ts 미구현).

#### 🟢 GREEN — `src/lib/jwt-sign.ts` 구현

```typescript
export type JwtAlg = "HS256" | "HS384" | "HS512";
export interface JwtSignResult { token: string | null; error: string }

export function base64UrlEncode(input: string): string {
  // TextEncoder → btoa → URL-safe (+→-, /→_, = 제거)
}

const ALG_HASH: Record<JwtAlg, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };

export async function signJwt(headerJson, payloadJson, secret, alg): Promise<JwtSignResult> {
  // 1. JSON.parse 검증 (header, payload)
  // 2. header.alg = alg 강제, header.typ ??= "JWT"
  // 3. secret 빈값 검증
  // 4. signingInput = base64UrlEncode(headerStr) + "." + base64UrlEncode(payloadStr)
  // 5. crypto.subtle.importKey("raw", TextEncoder(secret), {name:"HMAC", hash}, false, ["sign"])
  // 6. crypto.subtle.sign("HMAC", key, TextEncoder(signingInput)) → ArrayBuffer
  // 7. base64url(signature bytes) → token = signingInput + "." + sig
}
```
바이트→base64url은 `String.fromCharCode(...new Uint8Array(buf))` 후 btoa + URL-safe.

`npm test` → **전체 통과 확인**.

#### 🔵 REFACTOR
- JSON.parse 에러 메시지 사용자 친화 (어느 필드)
- JSDoc 핵심 함수
- 커버리지 확인

### Quality Gate (Phase 1)
- [ ] `npm test` jwt-sign 신규 케이스 ≥6 통과
- [ ] 표준 벡터 바이트 일치 (KPI)
- [ ] 커버리지 ≥ 90% (`jwt-sign.ts`)
- [ ] `npx tsc --noEmit` 통과

### 롤백
- `jwt-sign.ts` + `__tests__/jwt-sign.test.ts` 삭제

---

### Phase 2: 컴포넌트 + 도구 등록

**목표**: UI 구현 + 3중 정합성 등록
**예상 시간**: 1.5시간

#### 🔴 RED — `src/components/tools/__tests__/JwtGenerator.test.tsx`

테스트 파일: `src/components/tools/__tests__/JwtGenerator.test.tsx` (`@jest-environment jsdom`)

단위 테스트 케이스 (≥3):
1. `기본 렌더링 — Header/Payload/Secret 입력 필드 + 생성 버튼 존재` (✅ Happy)
2. `생성 버튼 클릭 시 JWT 토큰 출력 (표준 입력 → 토큰에 3개 '.' 파트)` — async, `findByText`/textContent (✅ Happy)
3. `잘못된 JSON 입력 시 에러 메시지 표시` (❌ Exception)

LocaleProvider mock은 기존 JsonCsvConverter.test 패턴 참고.

`npm test` → **실패 확인**.

#### 🟢 GREEN — 구현 + 등록

1. `src/components/tools/JwtGenerator.tsx` — jwt-decoder 스타일 재사용:
   - alg `<select>`, header/payload/secret `<textarea>`/`<input>`
   - `handleGenerate = async () => { const r = await signJwt(...); setToken/​setError }`
   - 예제 로드(표준 벡터), iat 삽입(핸들러 내 `Math.floor(Date.now()/1000)`)
   - 토큰 출력 박스 + 복사
2. `src/components/tools/index.ts` — `JwtGenerator` import + TOOL_COMPONENTS 등록
3. `src/data/tools.ts` — TOOLS에 항목 추가:
   ```
   { slug:"jwt-generator", title:{ko:"JWT 생성기",en:"JWT Generator"},
     description:{...}, longDescription:{...}, category:"security",
     keywords:["jwt 생성기","jwt generator","jwt 서명","hmac","hs256"],
     component:"JwtGenerator", datePublished:"2026-06-05", faqs:[...] }
   ```

`npm test` → **통과**.

#### 🔵 REFACTOR
- 접근성: `<label htmlFor>`, aria-label
- `npm run lint` 경고 0

### Quality Gate (Phase 2)
- [ ] `npm test` 신규 컴포넌트 케이스 ≥3 통과
- [ ] `harness verify` tool_registry_consistency 통과 (3중 정합성)
- [ ] `npm run lint` 에러 0
- [ ] `npx tsc --noEmit` 통과

### 롤백
- `JwtGenerator.tsx` + 테스트 삭제, index.ts/tools.ts 항목 되돌리기

---

### Phase 3: enhancement 콘텐츠 + 빌드 검증

**목표**: 콘텐츠 강화 + 프로덕션 빌드/산출물 검증
**예상 시간**: 1시간

#### 🔴 RED — enhancement 병합 검증 테스트

테스트 파일: `src/data/__tests__/jwt-generator-enhancement.test.ts` (없으면 신규)

단위 테스트 케이스 (≥2):
1. `getToolBySlug("jwt-generator").howTo가 존재하고 steps ≥ 2` — enhancement 병합 확인 (✅ Happy)
2. `jwt-generator.relatedTools에 "jwt-decoder" 포함` — 짝 도구 클러스터 연결 (🔶 Boundary)

`npm test` → **실패 확인** (enhancement 미작성).

#### 🟢 GREEN — `src/data/enhancements/security.ts`에 `"jwt-generator"` 추가

```
"jwt-generator": {
  howTo: { steps: [ {ko:"...",en:"..."}, ... ] },           // ≥3 steps
  relatedConcepts: [ {title,description} × 3 ],               // HMAC, base64url, JWT 구조
  relatedTools: ["jwt-decoder","hash-generator","bcrypt-generator"],
  extraFaqs: [ {question,answer} × 3 ],
  usageExamples: [ {title,scenario,steps,result} × 1 ],
}
```

`npm test` → **통과**.

#### 🔵 검증
1. `npm run build` → 성공
2. 산출물: `grep '<h1' out/tools/net/jwt-generator/index.html` → 한국어 "JWT 생성기"
3. `grep canonical out/tools/net/jwt-generator/index.html` → `.../jwt-generator/`
4. `./bin/harness verify` → 13/13 (도구 수 44→45)

### Quality Gate (Phase 3)
- [ ] `npm test` 전체 통과 (620 + 신규 11+)
- [ ] `npm run build` 성공
- [ ] `harness verify` 통과 (도구 정합성 45개)
- [ ] 산출물 canonical/lang/본문 한국어 확인

### 롤백
- security.ts enhancement 항목 제거 (Phase 2 상태로)

---

## 진행 상황 추적

| Phase | 상태 | 단위테스트 |
|-------|------|-----------|
| Phase 1 (jwt-sign.ts) | ⏳ 대기 | ≥6 |
| Phase 2 (컴포넌트+등록) | ⏳ 대기 | ≥3 |
| Phase 3 (enhancement+빌드) | ⏳ 대기 | ≥2 |

**총 단위 테스트 ≥ 11 (Phase 3개 ≥ 각 1)**

---

## 최종 체크리스트

- [ ] 표준 벡터 바이트 일치 (HS256 → SAMPLE_JWT)
- [ ] `npm test` 전체 통과
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 0
- [ ] `npx tsc --noEmit` 통과
- [ ] `harness verify` 13/13 (45개 도구 정합성)
- [ ] 한/영 언어 전환 정상
- [ ] 복사 동작
- [ ] 에러 메시지 (잘못된 JSON, 빈 secret)
- [ ] 렌더 페이즈 비결정 함수 없음 (TR-5)

---

## 위험 요소

| 위험 | 확률 | 영향 | 완화 |
|------|------|------|------|
| jest node 환경 `crypto.subtle` 미가용 | 저 | 고 | 사전 확인됨 (Node 26 webcrypto=object). 미가용 시 `@jest-environment jsdom` 또는 node:crypto webcrypto import |
| base64url 멀티바이트(한글) 인코딩 버그 | 중 | 중 | TextEncoder 기반 + UTF-8 테스트 케이스로 커버 |
| 렌더 페이즈 Date.now (iat) → hydration mismatch | 중 | 고 | iat는 이벤트 핸들러 내부에서만. TR-5 명시. 빌드 후 산출물 확인 |
| 3중 정합성 누락 → 빌드 실패 | 저 | 고 | harness verify tool_registry_consistency 게이트 |

---

## 참고 자료

- 기존 컴포넌트: `src/components/tools/JwtDecoder.tsx` (패턴/스타일 재사용)
- 테스트 패턴: `src/components/tools/__tests__/JsonCsvConverter.test.tsx` (LocaleProvider mock)
- 표준 벡터: jwt.io HS256 예제 (secret `your-256-bit-secret`)
- [RFC 7519 JWT](https://datatracker.ietf.org/doc/html/rfc7519) · [RFC 7515 JWS](https://datatracker.ietf.org/doc/html/rfc7515)
- 운영 가이드: PROJECT_CONVENTIONS(lib 테스트·SSG 안전), HARNESS_ENGINEERING §14 TR-5
