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

## 애드센스 승인 준비 (2026-06-24 서베이)

> 상세·요건·근거 22개 사이트 분석: [docs/ADSENSE_APPROVAL.md](ADSENSE_APPROVAL.md). 판정 = **2~4주 작업 후 신청** (지금 신청은 거절 위험).

- [x] 🔴 색인 지원 (코드 가능분 완료, 2026-06-24) — ✅ 홈에 가이드 8편 1-hop 섹션 추가(`HomeContent`, 색인된 홈→가이드 발견 신호) · ✅ 내부링크 trailing-slash 전체 정규화 · ✅ canonical/noindex 점검(`/tools/net` noindex=홈 중복 통합 의도, 정상). 🙋 **남은 GSC sitemap 제출·핵심 URL 색인 요청은 사용자만 가능**(코드 불가)
- [x] 🔴 가이드 ko 14/14 심화 ✅ (2026-06-24, build 검증) — 도구 워크드 예제·엣지케이스·명령어표·1인칭+교차링크. subnet 3편 distinct 앵글 클러스터 분리(subnet-guide는 CIDR/VLSM로 retitle). 내부링크 trailing-slash 전체 정규화. **en 패리티 보류**: ko=primary(DEFAULT_LOCALE=ko), en은 hreflang 변형이라 AdSense 평가 비대상 — 필요 시 후속
- [x] 🟡 privacy 애드센스 디스클로저 보강 ✅ (2026-06-24) — 제3자 쿠키·웹비콘·IP 명시 + aboutads.info/youronlinechoices 옵트아웃 + partner-sites 링크 + 날짜 갱신 (legal 페이지 ko 단일, en 변형 없음). lint/test/verify 통과
- [x] 🟡 Contact 페이지 ✅ (2026-06-24) — footer 링크 + i18n navContact + sitemap 등록. tsc/lint/test(677)/verify 통과
- [x] 🟡 가이드 저자 바이라인 ✅ (2026-06-24) — 28편 전부 author:NetTools Team 보유 확인 + BlogLayout 헤더 가시 바이라인 추가(JSON-LD 기존 보유). tsc/lint/test 통과
- [ ] ⚪ (승인 후) ads.txt Google DIRECT 라인 추가 · (EEA/UK 서빙 전) 인증 CMP — 둘 다 신청 게이트 아님
- [ ] ⚪ "이것저것 다 올리기" 금지 — 니치 심화 + intent 수익화가 정답 (근거: ADSENSE_APPROVAL.md §6)

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
