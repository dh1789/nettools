/**
 * 카테고리별 OG 이미지 사전 생성 스크립트
 * Satori(JSX→SVG) + sharp(SVG→PNG)로 1200×630px 이미지를 빌드 시 생성
 *
 * 사용법: node scripts/generate-og-images.mjs
 */
import satori from "satori";
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "og");

const WIDTH = 1200;
const HEIGHT = 630;

const CATEGORIES = [
  {
    id: "network",
    label: "Network Tools",
    icon: "🌐",
    bgColor: "#0f172a",
    accentColor: "#38bdf8",
    description: "서브넷, DNS, IP 조회 등",
  },
  {
    id: "security",
    label: "Security Tools",
    icon: "🔒",
    bgColor: "#0f172a",
    accentColor: "#4ade80",
    description: "SSL, 비밀번호, 해시 등",
  },
  {
    id: "linux",
    label: "Linux Tools",
    icon: "🐧",
    bgColor: "#1a1a2e",
    accentColor: "#fb923c",
    description: "Cron, chmod, SSH 등",
  },
  {
    id: "developer",
    label: "Developer Tools",
    icon: "💻",
    bgColor: "#1e1b4b",
    accentColor: "#a78bfa",
    description: "JSON, Base64, JWT 등",
  },
  {
    id: "general",
    label: "General Tools",
    icon: "🔧",
    bgColor: "#18181b",
    accentColor: "#60a5fa",
    description: "QR코드, 색상, 텍스트 등",
  },
];

/**
 * 시스템 폰트가 없을 경우 Google Fonts에서 Noto Sans를 다운로드
 * 이미 캐시된 폰트가 있으면 재사용
 */
async function loadFont() {
  const cachePath = join(ROOT, "node_modules", ".cache", "og-font.ttf");
  if (existsSync(cachePath)) {
    return readFileSync(cachePath);
  }

  const url =
    "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf";
  console.log("  폰트 다운로드 중...");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`폰트 다운로드 실패: ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const cacheDir = dirname(cachePath);
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
  await writeFile(cachePath, buffer);
  return buffer;
}

function buildTemplate(cat) {
  return {
    type: "div",
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: cat.bgColor,
        fontFamily: "NotoSansKR",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // 배경 장식 원
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: cat.accentColor,
              opacity: 0.08,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "-150px",
              left: "-150px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: cat.accentColor,
              opacity: 0.05,
            },
          },
        },
        // 아이콘
        {
          type: "div",
          props: {
            style: {
              fontSize: "80px",
              marginBottom: "20px",
            },
            children: cat.icon,
          },
        },
        // 카테고리 라벨
        {
          type: "div",
          props: {
            style: {
              fontSize: "52px",
              fontWeight: 700,
              color: cat.accentColor,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            },
            children: cat.label,
          },
        },
        // 설명
        {
          type: "div",
          props: {
            style: {
              fontSize: "28px",
              color: "#94a3b8",
              marginBottom: "40px",
            },
            children: cat.description,
          },
        },
        // 하단 브랜딩
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: cat.accentColor,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "24px",
                    color: "#e2e8f0",
                    fontWeight: 700,
                  },
                  children: "beomanro.com",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  console.log("🎨 OG 이미지 생성 시작");

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  const fontData = await loadFont();

  for (const cat of CATEGORIES) {
    const template = buildTemplate(cat);

    const svg = await satori(template, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "NotoSansKR",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
    const outPath = join(OUT_DIR, `${cat.id}.png`);
    await writeFile(outPath, png);
    console.log(`  ✅ ${cat.id}.png (${(png.length / 1024).toFixed(1)}KB)`);
  }

  console.log("🎨 OG 이미지 생성 완료 — public/og/");
}

main().catch((err) => {
  console.error("❌ OG 이미지 생성 실패:", err);
  process.exit(1);
});
