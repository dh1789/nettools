# PRD: 블로그 도구 가이드 글 5편 추가 (blog-guides)

## 메타데이터
| 항목 | 내용 |
|------|------|
| 생성일 | 2026-06-16 |
| 기능명 | blog-guides |
| 프로젝트 타입 | Node.js/TypeScript (Next.js 15, output: export) |

## 개요

기존 블로그(MDX 9편)에 도구 연계 **가이드 글 5편**(각 한·영) 추가. 신규 도구(jwt-generator)
홍보 + 검색 트래픽 높은 주제 + 도구↔블로그 클러스터 강화. 글 추가가 주, 발견경로는 부수.

**근거 (이번 세션 분석)**: 블로그가 헤더/푸터 외 진입점이 없던 orphan 문제는 `91de329`에서
일부 해소했으나 여전히 미색인. 신규 글은 ① 롱테일 키워드 자산(색인 풀린 후 가치) ②
사이트 신선도 신호 ③ 신규 jwt-generator 도구로의 콘텐츠 유입 경로. 색인 0인 현 상황에서
즉효는 작으나, 도메인 신뢰 축적과 함께 누적 가치.

## 신규 글 5편 (기존 9편과 비중복, 도구 연계)

| slug | 주제 | 연계 도구 | 카테고리 |
|------|------|----------|----------|
| `jwt-generate-guide` | JWT 토큰 생성·HMAC 서명 (HS256/384/512) | jwt-generator, jwt-decoder | security |
| `ssl-certificate-check-guide` | SSL 인증서 만료·발급자 확인 방법 | ssl-checker | security |
| `chmod-permissions-guide` | 리눅스 파일 권한 chmod 완벽 정리 | chmod-calculator | linux |
| `dns-records-guide` | DNS 레코드 종류 (A/AAAA/MX/CNAME/TXT) | dns-lookup | network |
| `base64-encoding-guide` | Base64 인코딩 원리와 실무 사용처 | base64, image-base64-converter | developer |

## 기능 요구사항

1. 각 글: `<slug>.ko.mdx` + `<slug>.en.mdx` (양언어 쌍)
2. frontmatter: title, description, category, keywords(≥3), publishedAt(YYYY-MM-DD), relatedTools(≥1 유효 slug), author
3. 본문: 도입(문제 상황) → 핵심 개념 → 단계별 사용법(연계 도구 링크 포함) → FAQ → 마무리
4. 연계 도구로의 본문 내부 링크 (`/tools/net/<slug>/`) 최소 1개
5. 기존 BlogPosting JSON-LD / sitemap / SSG 파이프라인 그대로 활용 (소스만 MDX 추가)

## 비기능 요구사항

- **SEO/언어 일치 (TR-7)**: ko/en 본문 언어가 각 locale과 일치. SSG로 정적 생성.
- **빌드 안전**: MDX 파싱 실패 없이 `npm run build` 통과. relatedTools는 실재 도구 slug만.
- **콘텐츠 품질**: 각 글 한국어 본문 1500자 이상, 고유 콘텐츠(템플릿 복붙 금지).

## 사용자 시나리오

1. **검색 유입 개발자**: "chmod 755 의미" 검색 → chmod-permissions-guide 도달 → 본문에서
   chmod-calculator 도구로 이동 → 권한 계산. (색인 풀린 후)
2. **신규 도구 발견**: jwt-decode-verify 글 독자가 관련 글 jwt-generate-guide로 → jwt-generator
   도구 발견. 도구↔블로그 클러스터 내 회유.

## 성공 지표 (KPI)

- 신규 10개 MDX(5글×2언어) 전부 frontmatter 스키마 통과
- 각 글 relatedTools가 실재 도구 slug 참조 (깨진 링크 0)
- `npm run build` 성공 + sitemap에 신규 5글 ko 엔트리 포함 (blog 9→14)
- 전체 테스트 통과 (기존 + 신규 가이드 검증)

## 기술 스택

- MDX (기존 `src/content/blog/` 파이프라인), `src/lib/blog.ts` 파싱
- Jest (신규 가이드 글 검증 테스트)

## 운영 가이드 참조 (검토 결과)

- **PROJECT_CONVENTIONS.md**: 블로그는 `src/content/blog/*.{ko,en}.mdx`, frontmatter 스키마 고정.
  신규 글도 동일 스키마 준수.
- **HARNESS_ENGINEERING §14 TR-7**: SSG 본문 언어 = locale 일치. ko 글은 한국어, en 글은 영어 본문.
- **KNOWN_DEFECTS.md**: 미해결 없음 — 충돌 없음.

## 제약사항 및 가정

- 색인 0인 현 상황에서 **즉각적 색인/트래픽 효과는 기대하지 않음**. 콘텐츠 자산 축적 목적.
- 글 본문은 사실 정확성 필수 (기술 콘텐츠) — chmod 비트, DNS 레코드, JWT 알고리즘 등 검증된 내용만.
- 비교글(beomanro-vs-*)과 달리 가이드글이므로 비교표 불필요. 별도 가이드 검증 테스트 사용.
