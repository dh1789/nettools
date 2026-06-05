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

## SEO 진행 경과 (2026-06 색인 정체 진단)

완료된 구조/온페이지 fix:
- [x] trailing-slash canonical 정합 (`1055335`)
- [x] 홈 redirect 제거 + `/tools/net/` canonical 통합 (`3f079db`)
- [x] **DEFAULT_LOCALE=ko** — SSG 본문 영어 렌더로 인한 언어 불일치 색인 보류 해소 (`aa44cae`, 함정 TR-7)
- [x] http→https 301 강제 (Cloudflare)
- [x] **orphan 블로그 내부링크 연결** — 헤더·푸터 블로그 링크 (`91de329`). 블로그 10 URL이 sitemap엔 있으나 내부링크 0이라 Google 미발견이던 문제
- [x] GSC URL 색인 요청 (도구 9 + `/blog/` 시드) + sitemap 재제출 + legacy WP sitemap 삭제

진단 후 코드 개입 불필요로 판정 (자연 해소):
- "리디렉션 오류 17" = slash 없는 old 도구 URL(307→slash 버전 정상) + legacy 404 2개. canonical 명확, 색인 주범 아님. 307→308은 CF 플랫폼 제약 + marginal이라 보류
- "찾을 수 없음(404)" = WP 잔재(`/ko/` `/en/`). 자연 drop 중 (41→27)
- 콘텐츠는 이미 충실 (enhancements/*.ts 44/44, 도구당 4800~6000자) — thin 아님

남은 병목 = **신규 도메인 신뢰(오프페이지).** 코드로 해결 불가. 시간 + 백링크 + 트래픽.

- [ ] 1주 후 GSC 재확인 — 블로그 색인 진입 + 도구 색인 전환 (6/1 한국어 재크롤 후 첫 재평가)
- [ ] (선택) 홈에 블로그 글 섹션 — 홈(색인됨)→9글 1-hop 최강 발견 신호
- [ ] (선택) 블로그 나머지 9글 개별 색인 요청 — /blog/ 시드 + 내부링크로 자연 발견 가능, marginal

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
