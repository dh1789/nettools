# PRD: JWT 생성기 (jwt-generator)

## 메타데이터
| 항목 | 내용 |
|------|------|
| 생성일 | 2026-06-05 |
| 기능명 | jwt-generator |
| 카테고리 | security |
| 짝 도구 | jwt-decoder (developer) |
| 프로젝트 타입 | Node.js/TypeScript (Next.js 15 App Router, output: export) |

## 개요

JWT(JSON Web Token) 생성기. Header/Payload(JSON)와 secret을 입력받아 HMAC 서명(HS256/HS384/HS512)으로
완성된 JWT 토큰을 생성한다. 기존 `jwt-decoder`의 짝 도구로, 디코딩↔생성 클러스터를 완성한다.

**근거 (팩트 기반 서베이)**: IT-Tools/CyberChef/DevToys/W3Schools 4개 경쟁 도구 전부 JWT 생성/서명 보유.
NetTools는 decoder만 존재(갭). 보안 카테고리는 6개로 최소 → JWT 생성기로 보강. 전부 클라이언트
(Web Crypto API) 처리라 `output: export` 정적 빌드 호환 + 프라이버시 셀링포인트 유지.

## 목표

- jwt-decoder의 짝 도구로 JWT 생성 기능 제공
- 표준 HMAC 알고리즘(HS256/384/512) 지원
- 모든 처리 브라우저 내 (secret이 서버로 전송되지 않음)
- 보안 카테고리 6→7개 보강 + 롱테일 키워드("jwt 생성기", "jwt generator") 확보

## 기능 요구사항

1. **입력**: Header(JSON, alg/typ), Payload(JSON), Secret(문자열), 알고리즘 선택(HS256/HS384/HS512)
2. **알고리즘 선택 시 Header의 alg 자동 동기화**
3. **생성**: Web Crypto API HMAC 서명 → `base64url(header).base64url(payload).base64url(signature)`
4. **출력**: 완성 JWT 토큰 표시 + 클립보드 복사
5. **편의**: 예제 로드(jwt-decoder의 SAMPLE과 동일한 표준 벡터), iat 현재시각 삽입 버튼(핸들러 내)
6. **에러 처리**: 잘못된 JSON, 빈 secret → 사용자 친화 메시지
7. **한/영 이중 언어** (`useLocale`)

## 비기능 요구사항

- **보안**: secret/payload 서버 전송 없음. 전부 브라우저 Web Crypto.
- **SSG 안전**: 렌더 페이즈에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()` 호출 금지
  (iat 삽입 등 현재시각은 이벤트 핸들러 내부에서만). → TR-5 hydration mismatch 회피.
- **성능**: 서명 < 50ms (HMAC은 즉시)

## 사용자 시나리오

1. **API 개발자**: 테스트용 JWT가 필요. Payload에 `{"sub":"123","role":"admin"}` 입력, secret 입력,
   HS256 선택 → 생성 → 복사 → Postman/curl `Authorization: Bearer` 헤더에 사용.
2. **JWT 학습자**: jwt-decoder로 토큰 구조를 본 뒤, 생성기로 직접 만들어 보며 서명 메커니즘 이해.
   secret을 바꾸면 signature가 바뀌는 것을 관찰.

## 성공 지표 (KPI)

- 표준 벡터(HS256, secret `your-256-bit-secret`) → 생성 결과가 jwt.io 표준 JWT와 **바이트 일치**
- `lib/jwt-sign.ts` 단위 테스트 커버리지 ≥ 90%
- `npm run build` 성공 + `harness verify` tool_registry_consistency 통과 (3중 정합성)
- 전체 테스트 통과 (기존 620 + 신규)

## 기술 스택

- TypeScript, React 19, Next.js 15 (App Router, output: export)
- **Web Crypto API** (`crypto.subtle.importKey` + `crypto.subtle.sign`) — 외부 의존성 0
- Jest (단위 테스트) — Node 환경에서 `globalThis.crypto.subtle` 사용 가능 (확인됨)

## 운영 가이드 참조 (검토 결과)

- **PROJECT_CONVENTIONS.md**: `lib/` 순수 함수 100% Jest 테스트 → `jwt-sign.ts`를 lib에 분리.
  컴포넌트 `'use client'` 필수. 렌더 페이즈 비결정 함수 금지(§ SSG 안전).
- **HARNESS_ENGINEERING.md §14 TR-5**: hydration mismatch — iat 자동삽입은 핸들러 내부로.
- **§ 3중 정합성**: tools.ts `component` ↔ index.ts `TOOL_COMPONENTS` 키 ↔ `JwtGenerator.tsx` named export.
  `harness verify`의 tool_registry_consistency가 자동 검증.
- **KNOWN_DEFECTS.md**: 미해결 결함 없음 — 충돌 없음.

## 제약사항 및 가정

- **HMAC 전용** (HS256/384/512). RS/ES(비대칭)는 범위 외 — 키쌍 관리 복잡, 1차 범위에서 제외.
- secret은 UTF-8 문자열 (raw key). JWK/PEM 미지원 (1차 범위 외).
- 표준 벡터 검증: header `{"alg":"HS256","typ":"JWT"}`, payload `{"sub":"1234567890","name":"John Doe","iat":1516239022}`,
  secret `your-256-bit-secret` → `eyJhbGci...SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` (jwt-decoder의 SAMPLE_JWT와 동일).
