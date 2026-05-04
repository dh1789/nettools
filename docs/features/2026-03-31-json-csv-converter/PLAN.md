# PLAN: JSON to CSV 변환기

---

## 메타데이터

| 항목 | 내용 |
|------|------|
| **Status** | TODO |
| **생성일** | 2026-03-31 |

**Status**: TODO
**생성일**: 2026-03-31
| **예상 완료** | 2026-03-31 |
| **프로젝트 타입** | Node.js/TypeScript |
| **언어/프레임워크** | TypeScript, Next.js 15, React 19 |
| **실행 환경** | 로컬 (macOS), Node.js |
| **테스트 환경** | Jest + @testing-library/react |

---

## 아키텍처 결정사항

| 결정사항 | 근거 | 트레이드오프 |
|---------|------|-------------|
| 순수 TS로 CSV 변환 로직 구현 | 외부 의존성 최소화, Cloudflare Pages 호환 | 복잡한 케이스(큰따옴표 이스케이프 등) 직접 처리 필요 |
| Jest 선택 (Vitest 아닌) | Next.js 15 공식 권장 테스트 프레임워크 | 초기 설정 필요 |
| 유틸 함수를 `src/lib/` 에 분리 | 테스트 용이성, 재사용성 | 파일 하나 더 필요 |

---

## 주요 컴포넌트

### 컴포넌트 1: `src/lib/json-csv.ts`
- 책임: JSON → CSV 변환 순수 함수 (UI 독립)
- 인터페이스: `jsonToCsv(json: string, delimiter: string): CsvResult`
- 의존성: 없음 (순수 TypeScript)

### 컴포넌트 2: `src/components/tools/JsonCsvConverter.tsx`
- 책임: UI 렌더링, 사용자 입력/출력 처리
- 인터페이스: React 컴포넌트 (props 없음)
- 의존성: `json-csv.ts`, `useLocale`, React

### 컴포넌트 3: `src/data/tools.ts` 수정
- 책임: 도구 레지스트리에 `json-csv-converter` 항목 추가

### 컴포넌트 4: `src/components/tools/index.ts` 수정
- 책임: `JsonCsvConverter` 컴포넌트 export 등록

---

## Phase 구성

```
Phase 1 (1.5h): 테스트 환경 설정 + 핵심 변환 로직 TDD
Phase 2 (1.5h): React 컴포넌트 구현 + 도구 등록
Phase 3 (0.5h): 빌드/린트 검증 + 완료
```

---

### Phase 1: 테스트 환경 설정 + 핵심 변환 로직

**목표**: Jest 설정 후 `json-csv.ts` 변환 로직을 TDD로 구현

**예상 시간**: 1.5시간

### Tasks

#### 🔴 RED: 테스트 먼저 작성

1. Jest + ts-jest 설치:
   ```bash
   npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom
   ```

2. `jest.config.js` 생성:
   ```js
   const nextJest = require('next/jest')
   const createJestConfig = nextJest({ dir: './' })
   module.exports = createJestConfig({
     testEnvironment: 'node',
     moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
   })
   ```

3. `package.json`에 test 스크립트 추가:
   ```json
   "test": "jest",
   "test:coverage": "jest --coverage"
   ```

4. `src/lib/__tests__/json-csv.test.ts` 작성 (테스트 먼저):
   ```typescript
   import { jsonToCsv } from '../json-csv';

   describe('jsonToCsv', () => {
     // Happy Path
     test('단순 배열 변환', () => { ... });
     test('빈 배열 처리', () => { ... });
     // Boundary
     test('값에 쉼표 포함 시 큰따옴표 감싸기', () => { ... });
     test('값에 개행 포함 시 큰따옴표 감싸기', () => { ... });
     test('null/undefined 값 처리', () => { ... });
     // Edge
     test('배열이 아닌 JSON 입력 시 에러', () => { ... });
     test('유효하지 않은 JSON 입력 시 에러', () => { ... });
     test('중첩 객체 평탄화', () => { ... });
     // Boundary: 구분자 옵션
     test('탭 구분자 사용', () => { ... });
   });
   ```

5. `npm test` 실행 → **모두 실패 확인** (RED)

#### 🟢 GREEN: 최소 코드로 테스트 통과

6. `src/lib/json-csv.ts` 구현:
   ```typescript
   export interface CsvResult {
     csv: string;
     rowCount: number;
     colCount: number;
     error?: string;
   }

   export function jsonToCsv(json: string, delimiter = ','): CsvResult {
     // 1. JSON 파싱
     // 2. 배열 검증
     // 3. 헤더 추출 (중첩 객체 평탄화 포함)
     // 4. 행 변환 (RFC 4180 준수: 쉼표/개행/큰따옴표 이스케이프)
     // 5. 결과 반환
   }

   function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
     // dot notation으로 중첩 객체 평탄화
   }

   function escapeCsvValue(value: string, delimiter: string): string {
     // RFC 4180: 구분자, 개행, 큰따옴표 포함 시 큰따옴표로 감싸기
   }
   ```

7. `npm test` 실행 → **모두 통과 확인** (GREEN)

#### 🔵 REFACTOR: 코드 품질 개선

8. 에지 케이스 추가 처리:
   - 배열 요소가 혼합 타입인 경우
   - 빈 객체 처리
9. JSDoc 주석 추가 (핵심 함수만)
10. `npm test -- --coverage` → **커버리지 ≥ 80% 확인**

### Quality Gate (Phase 1 완료 조건)
- [ ] `npm test` 전체 통과
- [ ] 커버리지 ≥ 80% (`src/lib/json-csv.ts` 기준)
- [ ] 타입 에러 없음 (`npx tsc --noEmit`)

### 롤백 전략
- 테스트 파일만 삭제, `jest.config.js` 및 package.json 스크립트 원복
- `src/lib/json-csv.ts` 삭제

---

### Phase 2: React 컴포넌트 구현 + 도구 등록

**목표**: UI 컴포넌트 구현 및 도구 레지스트리 등록

**예상 시간**: 1.5시간

### Tasks

#### 🔴 RED: 컴포넌트 테스트 작성

1. `src/components/tools/__tests__/JsonCsvConverter.test.tsx` 작성:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { JsonCsvConverter } from '../JsonCsvConverter';

   // LocaleProvider mock 필요
   test('기본 렌더링 확인', () => { ... });
   test('변환 버튼 클릭 시 CSV 출력', () => { ... });
   test('잘못된 JSON 입력 시 에러 표시', () => { ... });
   ```

2. `npm test` → **실패 확인**

#### 🟢 GREEN: 컴포넌트 구현

3. `src/components/tools/JsonCsvConverter.tsx` 구현:
   - 기존 `JsonFormatter.tsx` 패턴 참고
   - 상태: `input`, `output`, `error`, `delimiter`, `copied`
   - 이벤트: 변환, 복사, 다운로드
   - `useLocale` 훅으로 한/영 이중 언어
   - CSV 다운로드: `Blob` + `URL.createObjectURL`

4. `src/components/tools/index.ts` 수정:
   ```typescript
   import { JsonCsvConverter } from './JsonCsvConverter';
   // TOOL_COMPONENTS에 추가
   JsonCsvConverter,
   ```

5. `src/data/tools.ts` 수정 — TOOLS 배열에 추가:
   ```typescript
   {
     slug: "json-csv-converter",
     title: { ko: "JSON to CSV 변환기", en: "JSON to CSV Converter" },
     description: { ko: "JSON 배열을 CSV 파일로 변환합니다...", en: "Convert JSON arrays to CSV format..." },
     longDescription: { ... },
     category: "developer",
     keywords: ["json to csv", "json csv converter", ...],
     component: "JsonCsvConverter",
     datePublished: "2026-03-31",
     faqs: [ ... ],
   }
   ```

6. `npm test` → **통과 확인**

#### 🔵 REFACTOR: 코드 품질 개선

7. 접근성 개선: 버튼 aria-label, input label 연결
8. 에러 메시지 상세화
9. `npm run lint` → 경고/에러 0개

### Quality Gate (Phase 2 완료 조건)
- [ ] `npm test` 전체 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npx tsc --noEmit` 타입 에러 없음
- [ ] `localhost:50000/tools/net/json-csv-converter` 접근 확인

### 롤백 전략
- `JsonCsvConverter.tsx` 삭제
- `index.ts`, `tools.ts`에서 추가한 항목 되돌리기

---

### Phase 3: 빌드 검증 + 완료 처리

**목표**: 프로덕션 빌드 통과 및 최종 검증

**예상 시간**: 0.5시간

### Tasks

1. `npm run build` 실행 → 빌드 성공 확인
2. `npm test -- --coverage` → 최종 커버리지 리포트 확인
3. 로컬에서 페이지 동작 확인:
   - 도구 목록에서 "JSON to CSV 변환기" 카드 노출 확인
   - 변환 기능 수동 테스트
   - 한/영 언어 전환 확인
4. git commit:
   ```
   feat: JSON to CSV 변환기 도구 추가 (json-csv-converter)

   - src/lib/json-csv.ts: 순수 TS 변환 로직 구현
   - src/components/tools/JsonCsvConverter.tsx: UI 컴포넌트
   - Jest 테스트 환경 초기 설정 (jest.config.js)
   - 테스트 커버리지 80%+ 달성

   Co-Authored-By: Paperclip <noreply@paperclip.ing>
   ```

### Quality Gate (Phase 3 완료 조건)
- [ ] `npm run build` 성공 (에러 0)
- [ ] `npm test` 전체 통과
- [ ] `npm run lint` 에러 없음
- [ ] 커버리지 ≥ 80%
- [ ] git commit 완료

### 롤백 전략
- 빌드 실패 시 Phase 2 롤백 절차 적용
- git stash로 안전하게 되돌리기 가능

---

## 진행 상황 추적

| Phase | 상태 | 시작 | 완료 | 소요 시간 |
|-------|------|------|------|----------|
| Phase 1 | ⏳ 대기 | - | - | - |
| Phase 2 | ⏳ 대기 | - | - | - |
| Phase 3 | ⏳ 대기 | - | - | - |

---

## 최종 체크리스트

- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 린트 통과 (`npm run lint`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] 커버리지 ≥ 80%
- [ ] 한국어/영어 언어 전환 정상
- [ ] CSV 다운로드 동작
- [ ] 클립보드 복사 동작
- [ ] 에러 메시지 표시 (잘못된 JSON, 배열 아닌 경우)

---

## 위험 요소

| 위험 | 확률 | 영향 | 완화 전략 |
|------|------|------|----------|
| Jest 설정 충돌 (Next.js 15 호환성) | 중 | 중 | next/jest 공식 설정 사용 |
| CSV RFC 4180 이스케이프 누락 | 저 | 고 | 테스트 케이스로 커버 |
| 빌드 시 정적 분석 오류 | 저 | 저 | Phase 2에서 린트 선행 확인 |

---

## 참고 자료

- [RFC 4180 - CSV 형식 표준](https://tools.ietf.org/html/rfc4180)
- [Next.js Testing 공식 가이드](https://nextjs.org/docs/app/building-your-application/testing/jest)
- 기존 참고 컴포넌트: `src/components/tools/JsonFormatter.tsx`
- 기존 참고 컴포넌트: `src/components/tools/YamlJsonConverter.tsx`
