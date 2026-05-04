# 작업 백로그

> 신규 도구 / 인프라 / SEO 후속 작업 추적.
> 기존 도구 8종 백로그(DNS Lookup ~ SSL Checker)는 모두 구현 완료 — 하단 "완료" 섹션 참고.

---

## 인프라 · 사이트 품질

| 우선순위 | 항목 | 메모 |
|---|---|---|
| 1 | Analytics 연동 | Cloudflare Web Analytics (privacy-friendly, GDPR 친화). 어떤 도구가 실제로 쓰이는지 측정 → 콘텐츠 보강 우선순위 결정 |
| 2 | 도구별 콘텐츠 두께 강화 | `longDescription` / `howTo` / `faqs` 보강 — GSC "크롤링됨-색인 안 생성 339건"의 본질 원인(thin content) 해소 |
| 3 | PWA 지원 | manifest + service worker — 오프라인 사용, 홈 화면 추가 |
| 4 | 도구별 OG 이미지 | 현재 카테고리별 5종 → 도구별 동적 OG (Cloudflare Workers / `next/og`) |
| 5 | 테스트 커버리지 노출 | `harness status` 에 커버리지 % 자동 표시 |
| 6 | Lighthouse · a11y 감사 | 44개 도구 일괄 점검, 정량 점수 추적 |

## SEO 후속 (커밋 `1055335` 이후)

- [ ] **2주 후** GSC 색인 추세 확인 — 색인됨 2 → 회복 여부, "크롤링됨-색인 안 생성 339" 변화
- [ ] "리디렉션 오류 17" / "리디렉션 포함 8" 잔여 URL 패턴 분석 (대부분 trailing-slash fix 로 해소 예상)
- [ ] 위 "도구별 콘텐츠 두께 강화" — 339건 해소의 핵심 작업

## 신규 도구 아이디어 (검색 트래픽 후보)

| 아이디어 | 카테고리 | 메모 |
|---|---|---|
| JWT 생성기 | developer | 현재 `jwt-decoder`만 있음 — 짝 맞추기 |
| Markdown → HTML 변환기 | developer | 현재 `markdown-preview`만 — 변환/다운로드 추가 |
| 정규식 비주얼라이저 | developer | railroad 다이어그램 — `regex-tester` 보완 |
| HAR 파일 분석기 | network | 개발자/네트워크 엔지니어 수요, 페이지 성능 분석 |
| SSH key generator | security | Ed25519 / RSA, openssh 형식 출력 |
| 명령어 cheatsheet 검색 | linux | `ip` / `iptables` / `find` / `awk` 통합 검색 |

---

## 완료 (참고)

### 기존 백로그 8종 (2026-Q1~Q2)
- DNS Lookup → `dns-lookup`
- Port 번호 사전 → `port-dictionary`
- 비밀번호 생성기 → `password-generator`
- Base64 인코더/디코더 → `base64`
- JSON 포매터 → `json-formatter`
- Cron 표현식 해석기 → `cron-parser`
- chmod 계산기 → `chmod-calculator`
- SSL 인증서 확인 → `ssl-checker`

### 추가 도구 (2026-Q2)
- JSON ↔ CSV 변환기 → `json-csv-converter` (2026-04, [PROGRESS](features/2026-03-31-json-csv-converter/PROGRESS.md))
