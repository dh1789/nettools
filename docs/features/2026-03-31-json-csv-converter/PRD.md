# PRD: JSON to CSV 변환기

## 개요

beomanro.com에 JSON 배열 데이터를 CSV 형식으로 변환하는 도구를 추가한다.
JSON 배열을 붙여넣으면 즉시 CSV로 변환하여 Excel, Google Sheets 등에서 바로 사용할 수 있게 한다.

## 목표

- 검색량이 높은 "json to csv" 키워드로 유기적 트래픽 확보
- 개발자/데이터 분석가가 자주 필요로 하는 실용적 도구 제공
- beomanro.com의 developer 카테고리 도구 수 확대

## 사용자 시나리오

### 시나리오 1: API 응답 CSV 변환
개발자가 REST API에서 받은 JSON 배열 응답을 스프레드시트로 분석하고 싶다.
JSON을 붙여넣고 "변환" 버튼을 클릭하면 CSV가 생성되어 복사하거나 다운로드할 수 있다.

### 시나리오 2: 중첩 JSON 단순화
데이터 분석가가 중첩된 JSON 객체를 평탄화(flatten)하여 CSV로 내보내고 싶다.
도구가 중첩 객체를 dot notation으로 평탄화하여 CSV 컬럼으로 변환한다.

## 기능 요구사항

### 필수 기능
1. JSON 배열 → CSV 변환
   - 입력: JSON 배열 (`[{...}, {...}]`)
   - 출력: 헤더 행 + 데이터 행 CSV
   - 인코딩: UTF-8 (한글 지원)
2. CSV 다운로드 버튼
3. 클립보드 복사 버튼
4. 에러 표시: 유효하지 않은 JSON, 배열이 아닌 경우

### 선택 기능
- 구분자 선택: 쉼표(,), 탭(\t), 세미콜론(;)
- 중첩 객체 평탄화 옵션 (기본값: on)

## 기술 스택

- **프레임워크**: Next.js 15 + TypeScript
- **스타일**: Tailwind CSS (기존 도구 인라인 CSS 패턴 유지)
- **테스트**: Jest + @testing-library/react (신규 설정)
- **배포**: Cloudflare Pages (정적 빌드)

## 제약사항 및 가정

- 클라이언트 사이드 전용 (서버 API 호출 없음)
- 기존 `src/components/tools/` 패턴 준수
- `useLocale` 훅으로 한/영 이중 언어 지원
- 외부 라이브러리 추가 불가 (CSV 변환 로직은 순수 TypeScript로 구현)

## 성공 지표

- 빌드 성공 (`npm run build`)
- 린트 통과 (`npm run lint`)
- 유닛 테스트 통과율 ≥ 80% 커버리지
- JSON 배열 → CSV 정확도 100% (테스트 케이스 기준)
- 한/영 언어 전환 정상 작동
