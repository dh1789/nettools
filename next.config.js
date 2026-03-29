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
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
