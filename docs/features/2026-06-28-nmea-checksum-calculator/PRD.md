# PRD — NMEA 0183 Checksum Calculator / Validator

- **상태**: Draft
- **생성일**: 2026-06-28
- **slug**: `nmea-checksum`
- **카테고리**: developer (데이터/인코딩 유틸 — base64·hash 계열)

## 1. 개요 / 목표

NMEA 0183 문장의 체크섬(`*XX`)을 **계산(Generate)** 하고 **검증(Validate)** 하는 클라이언트 사이드 도구. GPS·해양·드론·임베디드 개발자가 NMEA 문장을 만들거나 디버깅할 때 체크섬 일치 여부를 즉시 확인.

**최우선 가치 = 정확성.** 체크섬이 한 케이스라도 틀리면 도구 사이트 전체 신뢰도가 무너진다(애드센스 심사·외부 홍보 진행 중). → 발표된 검증 테스트 벡터로 TDD.

## 2. 근거 (서베이 확정)

- **알고리즘**: 시작 구분자(`$` 표준 / `!` AIS) 와 `*` **사이** 모든 문자(구분자 제외)를 **8비트 XOR** → **2자리 대문자 16진수**. (출처: [gpsd NMEA](https://gpsd.gitlab.io/gpsd/NMEA.html), [NMEA 0183 Wikipedia](https://en.wikipedia.org/wiki/NMEA_0183))
- **직접 검증 통과한 테스트 벡터** (Python XOR 재현):
  - `$GPGGA,092750.000,5321.6802,N,00630.3372,W,1,8,1.03,61.7,M,55.2,M,,*76` → `76`
  - `$GPRMC,092751.000,A,5321.6802,N,00630.3371,W,0.06,31.66,280511,,,A*45` → `45`
  - `$GNGGA,062735.00,3150.788156,N,11711.922383,E,1,12,2.0,90.0,M,,M,,*55` → `55`
- 경쟁 도구(nmeachecksum.eqth.net, hhhh.org nmeaxor, meme.au, eye4software) = 대부분 단순 1입력 계산기. **차별점**: 검증 모드 · 멀티라인 일괄 · AIS(`!`) · XOR 과정 표시 · 한/영 · 클라이언트 처리.

## 3. 사용자 시나리오

1. **검증** — 임베디드 개발자가 GPS 모듈 로그의 `$GPRMC,...*45` 한 줄을 붙여넣음 → 추출된 `45` vs 계산값 비교 → **✅ 일치** 표시. 깨진 문장이면 ❌ + 기대 체크섬 제시.
2. **계산** — 개발자가 `*` 없이 본문 `GPGGA,123519,...` 만 입력 → 계산된 `*47` + 완성 문장(`$GPGGA,...*47`) 출력 → 복사.
3. **일괄(멀티라인)** — 로그 여러 줄을 한 번에 붙여넣음 → 각 줄별 결과 표(본문·계산값·기존값·✅/❌)를 출력.
4. **AIS** — `!AIVDM,1,1,,B,...,0*5B` 처럼 `!` 시작 문장도 동일 규칙으로 검증.

## 4. 기능 요구사항 (FR)

- **FR-1** 본문(또는 전체 문장)에서 체크섬을 계산: 시작 구분자(`$`/`!`)와 `*` 사이 문자 XOR → 2자리 **대문자** hex.
- **FR-2** `*` 미포함 입력(본문만)도 허용 → 계산 모드로 동작 + 완성 문장 제공.
- **FR-3** `*XX` 포함 입력 → 검증 모드: 기존값 추출 후 계산값과 비교(대소문자 무시), valid/invalid.
- **FR-4** `$` 와 `!`(AIS AIVDM/AIVDO) 시작 구분자 모두 지원. 구분자 없이 본문만 줘도 계산.
- **FR-5** 멀티라인 일괄 처리(줄 단위), 빈 줄/공백/`\r\n` 트림 후 무시.
- **FR-6** 잘못된 형식 검출: 시작 구분자 없음, 기존 체크섬이 비-hex/길이≠2 → 명확한 에러 메시지(한/영).
- **FR-7** XOR 과정(누적 XOR 단계) 선택적 표시 — 교육/디버깅용.
- **FR-8** 결과 복사(완성 문장 / 체크섬), 샘플 입력 제공.

## 5. 비기능 요구사항 (NFR)

- **NFR-1 정확성(최우선)**: 핵심 로직 단위 테스트 커버리지 ≥ 95%, 발표 벡터 전수 통과. 1건이라도 실패 시 릴리스 차단.
- **NFR-2 프라이버시**: 전 처리 브라우저 클라이언트 사이드 — 입력값 서버 전송 금지(사이트 핵심 컨셉).
- **NFR-3 결정성**: 렌더 페이즈에서 `Date.now()`/`Math.random()`/`crypto.randomUUID()` 호출 금지(SSG hydration mismatch, TR-5).
- **NFR-4 i18n**: UI·에러·라벨 한/영(useLocale + `T`). 본문 언어 = 메타데이터 언어 정합(TR-7).
- **NFR-5 성능**: 1000줄 입력도 즉시(동기 XOR, O(n)). 디바운스 불필요 수준.

## 6. 기술 스택

- Next.js 15 (App Router, `output: "export"`), React 19, TypeScript, Tailwind v4
- 테스트: **Jest** (+ `@testing-library/react` — 컴포넌트 렌더 테스트, 기존 `ComparisonTable.test.tsx` 선례)
- 순수 로직: `src/lib/nmea-checksum.ts` / 테스트 `src/lib/__tests__/nmea-checksum.test.ts`
- 컴포넌트: `src/components/tools/NmeaChecksum.tsx` (`'use client'`, useLocale, `T`)

## 7. 제약사항 / 가정 (운영 가이드 반영)

- 🔴 **3중 정합성(TR-4)**: `TOOLS[].component="NmeaChecksum"` ↔ `TOOL_COMPONENTS["NmeaChecksum"]` ↔ `src/components/tools/NmeaChecksum.tsx` named export. 셋 중 하나라도 누락 시 동적 라우트 빌드 실패. `npm run new-tool` 사용 또는 수동 3곳 동시 갱신 후 `./bin/harness verify`.
- 🔴 **TR-5**: 렌더 비결정 함수 금지 — 계산은 입력 기반 순수 함수만.
- 🔴 **TR-6**: 도구 컴포넌트는 `'use client'` (useState/useLocale 사용).
- 🟡 **TR-7**: 도구 metadata/JSON-LD ko 기준(DEFAULT_LOCALE=ko) 정합.
- 패턴 미러: `json-csv.ts`(결과 객체 + `error?` 필드, 한글 에러) / `json-csv.test.ts`(describe/test, Happy·Boundary·Exception) / `JsonCsvConverter.tsx`(인라인 스타일·SAMPLE·ko/en 옵션).
- 가정: AIS 페이로드 내부 특수문자(백틱 등)도 XOR 대상(구분자 사이 모든 문자). 단일 `*` 기준(첫 `*`까지가 본문).

## 8. 성공 지표 (KPI)

- 발표 NMEA 테스트 벡터 **100% 통과** (GPS 3종 + 추가 AIS/엣지 벡터).
- 핵심 로직 커버리지 **≥ 95%**, 전체 `npm test` 그린 유지(기존 677 + 신규).
- `./bin/harness verify` 13/13 통과(레지스트리 정합), `npm run build` 정적 export 성공(`/tools/net/nmea-checksum/` 생성).
- 배포 후 라이브에서 검증/계산/멀티라인/AIS 시나리오 동작.

## 9. 테스트 요구사항

- **단위(Jest)**: `computeChecksum`·`parseSentence`·`validateSentence`·`processInput`·`xorSteps` — 발표 벡터 + 엣지(빈 본문, 소문자 hex, `!` AIS, 구분자 없음, 비-hex, 멀티라인/CRLF).
- **컴포넌트(RTL)**: 문장 입력 → 계산값/✅·❌ 렌더 확인.
- **정합성**: harness verify(레지스트리 3중) — Phase 4 Quality Gate.
- 커버리지 ≥ 95%(로직). TDD: 로직 RED→GREEN 먼저, UI 마지막.
