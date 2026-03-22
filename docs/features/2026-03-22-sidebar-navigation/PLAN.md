# PLAN: 사이드바 네비게이션

---
**Status**: Draft
- **생성일**: 2026-03-22
- **예상 완료**: 2026-03-22
- **프로젝트 타입**: Node.js/TypeScript (Next.js)
- **언어/프레임워크**: TypeScript, React 19, Next.js 15
- **실행 환경**: 로컬 (macOS, port 50000)
---

## 아키텍처 결정사항

| 결정사항 | 근거 | 트레이드오프 |
|---------|------|-------------|
| Sidebar를 layout.tsx에 통합 | 모든 페이지에서 사이드바 표시 | layout 복잡도 증가 |
| CSS 미디어쿼리 + JS 상태 혼합 | 반응형 + 인터랙션 모두 필요 | inline style에 미디어쿼리 불가 → global style 일부 추가 |
| usePathname()으로 active 감지 | Next.js 네이티브 지원 | 클라이언트 컴포넌트 필수 |
| 카테고리 토글 상태 로컬 관리 | 서버 불필요, 단순 UI 상태 | 페이지 이동 시 초기화 (허용) |

## 주요 컴포넌트

### Sidebar (`src/components/layout/Sidebar.tsx`)
- 책임: 카테고리별 도구 목록 렌더링, active 하이라이트, 접기/펼치기
- 인터페이스: `useLocale()`, `usePathname()`, TOOLS/CATEGORIES 데이터
- 의존성: i18n, tools.ts

### SidebarLayout (`src/components/layout/SidebarLayout.tsx`)
- 책임: Sidebar + 콘텐츠 영역 배치, 모바일 햄버거/오버레이 제어
- 인터페이스: `children`, 미디어쿼리 기반 반응형
- 의존성: Sidebar

### layout.tsx 변경
- 책임: SidebarLayout 감싸기, global CSS 추가 (미디어쿼리)

---

### Phase 1: Sidebar 컴포넌트 구현
**목표**: 카테고리별 도구 목록을 렌더링하는 Sidebar 컴포넌트 생성
**예상 시간**: 1.5시간

**Tasks:**
1. 🔴 RED: Sidebar 렌더링 테스트 — 카테고리 표시, 도구 링크, active 하이라이트, 다국어
2. 🟢 GREEN: Sidebar.tsx 구현 — CATEGORIES/TOOLS 매핑, usePathname() active, useLocale() 번역
3. 🔵 REFACTOR: 스타일 정리, CSS 변수 활용

**테스트 전략:**
- ✅ 카테고리별 도구 목록 정상 렌더링
- ✅ 현재 경로에 해당하는 도구 active 스타일
- ✅ 한국어/영어 전환 시 레이블 변경
- 🔶 도구 없는 카테고리 숨김
- 🔶 카테고리 접기/펼치기 토글

**Quality Gate:**
- Sidebar가 모든 등록 도구를 표시
- Active 하이라이트가 현재 URL과 일치
- 다국어 텍스트 정상 전환

**롤백 전략:** Sidebar.tsx 파일 삭제로 원복

---

### Phase 2: SidebarLayout + 반응형 통합
**목표**: Sidebar와 콘텐츠 영역을 배치하고 모바일 대응
**예상 시간**: 2시간

**Tasks:**
1. 🔴 RED: 데스크톱 레이아웃 테스트 (사이드바+콘텐츠 나란히), 모바일 햄버거 테스트
2. 🟢 GREEN: SidebarLayout.tsx 구현, layout.tsx에 통합, 미디어쿼리 CSS 추가
3. 🔵 REFACTOR: 전환 애니메이션, 오버레이 dimming 추가

**테스트 전략:**
- ✅ 데스크톱(≥768px): 사이드바 왼쪽 고정 + 콘텐츠 우측
- ✅ 모바일(<768px): 사이드바 숨김, 햄버거 버튼 표시
- ✅ 햄버거 클릭 → 오버레이 사이드바 열림
- ✅ 도구 클릭 → 이동 후 사이드바 닫힘
- 🔶 배경 클릭 → 사이드바 닫힘
- ❌ 오버레이 상태에서 스크롤 잠금

**Quality Gate:**
- 768px 기준 반응형 전환 정상
- 모바일 오버레이 열기/닫기 동작
- 기존 페이지 레이아웃 깨지지 않음

**롤백 전략:** SidebarLayout.tsx 삭제 + layout.tsx git checkout

---

### Phase 3: 홈페이지 통합 + i18n 번역 키 추가
**목표**: 홈페이지에서도 사이드바 동작, 번역 키 완성
**예상 시간**: 1시간

**Tasks:**
1. 🔴 RED: 홈페이지 사이드바 표시 테스트, "홈" 링크 active 테스트
2. 🟢 GREEN: i18n.ts에 사이드바 번역 키 추가, 홈 링크 구현
3. 🔵 REFACTOR: 홈페이지 콘텐츠 max-width 조정

**테스트 전략:**
- ✅ 홈페이지(/) 접속 시 사이드바 표시
- ✅ "홈" 링크 클릭 → / 이동
- ✅ 홈페이지에서 도구 선택 → 해당 페이지 이동
- ✅ 한국어/영어 전환 시 사이드바 메뉴 전체 변경

**Quality Gate:**
- 모든 페이지에서 사이드바 일관 동작
- 번역 누락 키 없음

**롤백 전략:** i18n.ts 번역 키 제거 + 홈페이지 원복

---

### Phase 4: E2E 검증
**목표**: 전체 기능 검증 — 모든 버튼, 입력, 이벤트, 화면 전환
**예상 시간**: 1.5시간

**Tasks:**
1. 데스크톱 뷰포트 검증: 사이드바 표시, 도구 이동, active 상태
2. 모바일 뷰포트 검증: 햄버거, 오버레이, 닫기
3. 각 도구 페이지 기능 검증: 입력/버튼/결과 출력
4. 다국어 전환 검증: 모든 UI 요소 언어 변경
5. 재귀적 이벤트 검증: 값 입력 → 버튼 클릭 → 결과 확인 → 복사 버튼 등

**테스트 전략:**
- ✅ 전체 도구 페이지 접근 가능
- ✅ Subnet Calculator: IP 입력 → 결과 표시 → 에러 처리 → 복사
- ✅ MAC OUI Lookup: MAC 입력 → 조회 → 결과 표시 → 복사
- ✅ 사이드바 네비게이션 모든 링크 동작
- ✅ 언어 전환 후 모든 텍스트 변경 확인
- 🔶 브라우저 리사이즈 시 반응형 전환

**Quality Gate:**
- agent-browser로 전체 화면 스크린샷 수집
- 모든 인터랙션 시나리오 통과
- 에러 콘솔 출력 없음

---

## 진행 상황

| Phase | 상태 | 시작 | 완료 | 비고 |
|-------|------|------|------|------|
| 1. Sidebar 컴포넌트 | ⬜ | - | - | |
| 2. SidebarLayout + 반응형 | ⬜ | - | - | |
| 3. 홈페이지 + i18n | ⬜ | - | - | |
| 4. E2E 검증 | ⬜ | - | - | |

## 최종 체크리스트
- [ ] 모든 도구 페이지에서 사이드바 렌더링
- [ ] 반응형 전환 (768px) 정상
- [ ] 모바일 햄버거/오버레이 동작
- [ ] 현재 페이지 하이라이트
- [ ] 카테고리 접기/펼치기
- [ ] 다국어 완전 지원
- [ ] 기존 기능 정상 동작 (Subnet Calculator, MAC OUI Lookup)
- [ ] E2E 테스트 통과
