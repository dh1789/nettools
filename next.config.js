const { execSync } = require("child_process");

let gitHash = "dev";
try {
  gitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // 루트 레이아웃이 (ko)/(en) 두 그룹으로 나뉘어 전역 404 는 app/global-not-found.tsx 가 담당한다.
  // 이 플래그 없으면 404.html 이 <html lang> 도 헤더/푸터도 없는 Next 내장 껍데기로 떨어진다(TR-12).
  experimental: {
    globalNotFound: true,
  },
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
