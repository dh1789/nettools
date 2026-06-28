# PLAN — NMEA 0183 Checksum Calculator / Validator

**Status**: Planned
**생성일**: 2026-06-28
**예상 완료**: ~6-9시간 (4 Phase)
**프로젝트 타입**: Node.js / TypeScript (Next.js 15 App Router, static export)
**언어 / 프레임워크**: TypeScript / Jest (+ @testing-library/react)
**실행 환경**: 로컬 — `npm test` · `npm run lint` · `./bin/harness verify` · `npm run build`
**slug / component / category**: `nmea-checksum` / `NmeaChecksum` / `developer`

## 아키텍처 결정사항

| 결정 | 근거 | 트레이드오프 |
|---|---|---|
| 순수 로직을 `src/lib/nmea-checksum.ts`로 분리 | TR-5(렌더 비결정성) 회피 + 단위 테스트 용이 (`json-csv.ts` 선례) | 파일 1개 추가 |
| `error?` 필드 결과객체 패턴 | 기존 컨벤션(`CsvResult`) 일치, 예외 대신 명시적 에러 | throw 안 함 → 호출부 분기 필요 |
| 자동 모드(`*XX` 있으면 검증/없으면 계산) | UX 단순화 — 모드 토글 불필요 | 입력 의도 추론 |
| `$`·`!` 시작 구분자 둘 다 지원 | AIS(AIVDM/AIVDO) 포함 — 차별점 | 파싱 분기 |
| 카테고리 `developer` | base64·hash·json 같은 데이터/인코딩 유틸 계열 | network 카테고리 아님(검색 동선 이견 가능) |

## 핵심 로직 인터페이스 (`src/lib/nmea-checksum.ts`)

```ts
export interface NmeaResult {
  input: string;            // 원본 줄
  start: "$" | "!" | null;  // 시작 구분자 (null = 본문만)
  body: string;             // XOR 대상 본문 (구분자~* 사이)
  computed: string;         // 계산된 2자리 대문자 hex
  given: string | null;     // 입력의 *XX (없으면 null)
  valid: boolean | null;    // given 있을 때만 비교, 없으면 null(계산 모드)
  full: string;             // 완성 문장 (start+body+"*"+computed)
  error?: string;
}
export function computeChecksum(body: string): string;
export function xorSteps(body: string): { char: string; code: number; acc: number }[];
export function parseSentence(line: string): { start: "$"|"!"|null; body: string; given: string|null; error?: string };
export function validateSentence(line: string): NmeaResult;
export function processInput(text: string): NmeaResult[];
```

---

### Phase 1: 핵심 체크섬 계산 (computeChecksum / xorSteps)

**목표**: XOR 체크섬 계산 + XOR 누적 단계. **예상 시간**: 1.5h

**Tasks**
1. 🔴 RED — `src/lib/__tests__/nmea-checksum.test.ts` 작성(실패 확인):
   - `describe('computeChecksum')`: `GPGGA 벡터 → 76` · `GPRMC 벡터 → 45` · `GNGGA 벡터 → 55` · `빈 본문 → 00` · `단일문자 A → 41` · `소문자 없이 대문자 hex(3D)`
   - `describe('xorSteps')`: `단계 길이 = 본문 길이` · `마지막 acc(hex) = computeChecksum 결과`
2. 🟢 GREEN — `src/lib/nmea-checksum.ts`에 `computeChecksum`(`c ^= ch.charCodeAt(0)` → `toString(16).toUpperCase().padStart(2,'0')`) + `xorSteps`.
3. 🔵 REFACTOR — 공통 XOR 헬퍼 정리, JSDoc.

**테스트 전략**: ✅ Happy(벡터 3) | 🔶 Boundary(빈/단일) | ❌ Exception(없음 — 순수계산) | 커버리지 100%
**Quality Gate**: `npx jest nmea-checksum` 그린 + `computeChecksum` 벡터 3종 통과
**롤백**: `nmea-checksum.ts`·테스트 파일 삭제(다른 파일 무영향, 레지스트리 미연결 상태)

### Phase 2: 파싱 · 검증 (parseSentence / validateSentence)

**목표**: 문장 분해 + 검증/계산 모드 판정. **예상 시간**: 2h

**Tasks**
1. 🔴 RED — 같은 테스트 파일에 추가:
   - `describe('parseSentence')`: `$ 문장 분해(start/body/given)` · `! AIS 분해` · `* 없는 본문만 → given null` · `구분자 없는 순수 본문 허용(start null)` · `비-hex given → error` · `길이≠2 given → error`
   - `describe('validateSentence')`: `유효 문장 → valid true` · `틀린 체크섬 → valid false + computed 제시` · `소문자 given normalize 비교(*4a == 4A)` · `* 없음 → 계산모드(valid null, full 제공)` · `! AIS 검증` · `구분자/형식 오류 → error`
2. 🟢 GREEN — `parseSentence`(첫 `$`/`!` 위치, 첫 `*`까지 본문, 이후 2자 given), `validateSentence`(parse → compute → 대소문자 무시 비교 → `NmeaResult` 구성, `full` 생성).
3. 🔵 REFACTOR — 에러 메시지 한/영 키 정리.

**테스트 전략**: ✅ Happy(유효 검증) | 🔶 Boundary(소문자·`!`·`*`없음) | ❌ Exception(구분자없음·비hex) | 커버리지 ≥95%
**Quality Gate**: `npx jest nmea-checksum` 그린 + 검증/계산/AIS/에러 케이스 전수 통과
**롤백**: Phase 2 추가분(함수·테스트) git revert, Phase 1 상태 유지

### Phase 3: 멀티라인 일괄 처리 (processInput)

**목표**: 여러 줄 입력 → 줄별 결과 배열. **예상 시간**: 1h

**Tasks**
1. 🔴 RED — 테스트 추가:
   - `describe('processInput')`: `여러 줄 각각 처리(개수 일치)` · `빈 줄/공백 줄 무시` · `\r\n 트림 후 처리` · `혼합 valid/invalid 결과`
2. 🟢 GREEN — `processInput`(`text.split(/\r?\n/)` → trim → 빈 줄 제외 → 각 줄 `validateSentence`).
3. 🔵 REFACTOR — 빈 입력/전부 공백 처리.

**테스트 전략**: ✅ Happy(멀티) | 🔶 Boundary(빈줄·CRLF) | ❌ Exception(전부 무효) | 커버리지 ≥95%
**Quality Gate**: `npx jest nmea-checksum` 그린 + 전체 `npm test`(기존 677 + 신규) 그린
**롤백**: `processInput`·테스트 revert

### Phase 4: UI 컴포넌트 + 레지스트리 정합 (NmeaChecksum)

**목표**: 도구 UI + 3중 정합 등록 + i18n. **예상 시간**: 2.5h

**Tasks**
1. 🔴 RED — `src/components/tools/__tests__/NmeaChecksum.test.tsx`(RTL, `ComparisonTable.test.tsx` 선례):
   - `문장 입력 시 계산 체크섬 + ✅ 렌더` · `틀린 체크섬 입력 시 ❌ 렌더`
2. 🟢 GREEN — `src/components/tools/NmeaChecksum.tsx`(`'use client'`, useState/useCallback, useLocale/`T`, `processInput` 호출, 결과 표 + XOR 토글 + 복사/샘플; `JsonCsvConverter.tsx` 스타일 미러) → **3중 정합 동시 등록**:
   - `src/data/tools.ts` `TOOLS[]`에 엔트리(slug `nmea-checksum`, component `"NmeaChecksum"`, category `developer`, title/description/keywords/faqs ko·en, datePublished, relatedTools)
   - `src/components/tools/index.ts` `TOOL_COMPONENTS["NmeaChecksum"]`
   - i18n `T` 키(라벨·에러) 추가
3. 🔵 REFACTOR — 접근성(label/aria), 반응형.

**테스트 전략**: ✅ Happy(렌더+계산) | ❌ Exception(틀린 체크섬) | 정합성 게이트
**Quality Gate** (모두 통과):
- `npx jest`(RTL 포함) 그린
- `./bin/harness verify` → `tool_registry_consistency` 포함 13/13 (TR-4)
- `npm run lint` 0 · `npx tsc --noEmit` OK
- `npm run build` → `out/tools/net/nmea-checksum/index.html` 생성(static export)
**롤백**: 3중 등록 동시 revert(부분 등록 = 빌드 깨짐 TR-4) → 컴포넌트·tools.ts·index.ts·i18n 함께 되돌림

---

## 진행 상황 추적

| Phase | 상태 | 단위 테스트 수 | 실제 시간 |
|---|---|---|---|
| 1 핵심 계산 | ⬜ | 8 | |
| 2 파싱·검증 | ⬜ | 12 | |
| 3 멀티라인 | ⬜ | 4 | |
| 4 UI·정합 | ⬜ | 2 (RTL) + verify | |
| **합계** | | **26+ (≥ Phase 4)** | |

## 의존성

- **신규 의존성 없음** — 표준 라이브러리만(`String.charCodeAt`, `Number.toString(16)`). 외부 패키지 추가 X.
- 기존 인프라 재사용: `@/lib/LocaleProvider`(useLocale), `@/lib/i18n`(`T`), `ToolLayout`, Jest + `@testing-library/react`(기존 devDeps).
- 선행: 없음(독립 신규 도구). 후행: 배포(main push → CF) 후 라이브 검증.

## 위험 요소 / 완화

| 위험 | 영향 | 완화 |
|---|---|---|
| 체크섬 계산 오류(엣지) | 신뢰도 추락(최우선) | 발표 벡터 TDD + 커버리지 ≥95% + 추가 AIS 벡터 |
| 레지스트리 부분 등록(TR-4) | 빌드 실패 | Phase 4에서 3곳 동시 + `harness verify` 게이트 |
| 렌더 비결정 함수(TR-5) | hydration mismatch | 계산은 순수함수, 렌더에 Date/random 금지 |
| 언어 정합(TR-7) | 색인 보류 | metadata ko 기준, 본문 토글 |
| AIS 페이로드 특수문자 | 계산 누락 | 본문=구분자~첫`*` 사이 "모든" 문자 XOR(예외 없음) |

## 최종 체크리스트

- [ ] 발표 벡터(GPGGA/GPRMC/GNGGA) 100% 통과
- [ ] 검증·계산·멀티라인·AIS·에러 케이스 전수 통과
- [ ] `npm test` 전체 그린 · 로직 커버리지 ≥95%
- [ ] `./bin/harness verify` 13/13 (3중 정합)
- [ ] `npm run lint` 0 · `tsc` OK · `npm run build` 성공(`/tools/net/nmea-checksum/`)
- [ ] (배포 후) 라이브 4 시나리오 동작 확인

## 참고 자료

- PRD: `./PRD.md` · 서베이 출처: [gpsd NMEA](https://gpsd.gitlab.io/gpsd/NMEA.html), [NMEA 0183 Wikipedia](https://en.wikipedia.org/wiki/NMEA_0183)
- 미러 패턴: `src/lib/json-csv.ts` · `src/lib/__tests__/json-csv.test.ts` · `src/components/tools/JsonCsvConverter.tsx`
- 함정: `docs/HARNESS_ENGINEERING.md` §14 (TR-4 레지스트리, TR-5 hydration, TR-7 언어정합) · `CLAUDE.md` 3중 정합 체크
