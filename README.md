# NetTools — Network & Security Tools

네트워크 엔지니어와 보안 전문가를 위한 무료 웹 도구 모음.

**🔗 Live: [beomanro.com](https://beomanro.com)**

서브넷 계산기 · VLSM · CIDR · DNS 조회 · SSL 인증서 확인 · JWT 디코드/생성 · Base64 · JSON 포매터 · chmod · cron · ufw · SSH config 등 **45개 이상의 도구**. 모든 처리는 브라우저에서 수행되어 데이터가 서버로 전송되지 않습니다. 가입·결제 없이 즉시 사용.

## Stack

- **Framework**: Next.js (Static Export)
- **Hosting**: Cloudflare Pages (무료, 무제한 대역폭)
- **Language**: TypeScript + React
- **수익화**: 광고 슬롯 (PropellerAds/Ezoic/Carbon Ads)

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # out/ 디렉토리에 정적 HTML 생성
```

## 새 도구 추가하기 (3단계)

### 방법 1: 자동 생성 스크립트

```bash
npm run new-tool
# 대화형으로 slug, 제목, 설명, 카테고리 입력
# → 컴포넌트 파일 + 레지스트리 자동 업데이트
```

### 방법 2: 수동 추가

1. `src/components/tools/MyNewTool.tsx` 생성
2. `src/data/tools.ts` → `TOOLS` 배열에 항목 추가
3. `src/components/tools/index.ts` → import + registry에 등록

### 배포

```bash
git add -A && git commit -m "feat: add [도구명]" && git push
# Cloudflare Pages가 자동으로 빌드 + 배포
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 공통 레이아웃 (헤더, 푸터, 다크모드)
│   ├── page.tsx            # 홈페이지 (도구 목록)
│   ├── sitemap.ts          # 자동 생성 sitemap.xml
│   ├── robots.ts           # robots.txt
│   └── tools/
│       └── [slug]/
│           └── page.tsx    # 동적 도구 페이지 (자동 라우팅)
├── components/
│   ├── layout/
│   │   ├── AdSlot.tsx      # 광고 슬롯 (네트워크 독립적)
│   │   └── ToolLayout.tsx  # 도구 공통 래퍼
│   └── tools/
│       ├── index.ts        # 컴포넌트 레지스트리
│       └── SubnetCalculator.tsx  # 서브넷 계산기
├── data/
│   └── tools.ts            # 도구 메타데이터 + 카테고리 정의
├── lib/
│   ├── i18n.ts             # 다국어 (한/영)
│   └── seo.ts              # SEO 메타 + JSON-LD 자동 생성
└── scripts/
    └── new-tool.mjs        # 새 도구 생성 자동화 스크립트
```

## 자동화되는 것들

| 항목 | 자동화 방식 |
|------|------------|
| 페이지 라우팅 | `tools.ts` slug → Next.js dynamic route |
| SEO 메타데이터 | `tools.ts` 정보 → Open Graph + JSON-LD |
| sitemap.xml | `tools.ts` → `sitemap.ts` 자동 생성 |
| 광고 슬롯 | `ToolLayout` 이 자동 삽입 |
| 빌드/배포 | git push → Cloudflare Pages |
| 다크모드 | CSS variables, 시스템 설정 자동 감지 |

## 광고 연동

`src/components/layout/AdSlot.tsx` 파일 하나만 수정:

```tsx
// PropellerAds
<div data-zone-id="YOUR_ZONE_ID" />

// Ezoic
<div id="ezoic-pub-ad-placeholder-101" />

// Carbon Ads
<script src="//cdn.carbonads.com/carbon.js?serve=YOUR_ID" />
```

## Cloudflare Pages 설정

1. GitHub repo 연결
2. Build command: `npm run build`
3. Build output directory: `out`
4. 끝. push 할 때마다 자동 배포.

## 환경 변수

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADS_ENABLED=true
```
