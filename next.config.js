/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 HTML로 빌드 → Cloudflare Pages에 바로 올림
  output: "export",

  // 이미지 최적화는 서버가 필요하므로 비활성화
  images: {
    unoptimized: true,
  },

  // trailing slash 사용 (Cloudflare Pages 호환)
  trailingSlash: true,
};

module.exports = nextConfig;
