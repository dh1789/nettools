#!/usr/bin/env node

/**
 * New Tool Generator
 * ──────────────────
 * Usage: npm run new-tool
 *
 * 인터랙티브로 새 도구의 정보를 입력받아:
 * 1. React 컴포넌트 파일 생성
 * 2. tools.ts 레지스트리에 항목 추가
 * 3. index.ts에 export 추가
 *
 * 이후 git push 하면 자동 빌드/배포.
 */

import { createInterface } from "readline";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

async function main() {
  console.log("\n🔧 New Tool Generator\n");

  const slug = await ask("Slug (e.g. mac-oui-lookup): ");
  const titleEn = await ask("Title (English): ");
  const titleKo = await ask("Title (Korean): ");
  const descEn = await ask("Description (English): ");
  const descKo = await ask("Description (Korean): ");
  const category = await ask("Category (network/security/linux/developer/general): ");
  const keywords = await ask("Keywords (comma-separated): ");

  // ComponentName from slug: mac-oui-lookup → MacOuiLookup
  const componentName = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  // 1. Create component file
  const componentContent = `"use client";

import { useState } from "react";

export function ${componentName}() {
  return (
    <div>
      <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>
        ${titleEn} — TODO: Implement tool logic
      </p>
    </div>
  );
}
`;

  const componentPath = resolve("src/components/tools", `${componentName}.tsx`);
  writeFileSync(componentPath, componentContent);
  console.log(`✅ Created ${componentPath}`);

  // 2. Add to tools.ts registry
  const toolsPath = resolve("src/data/tools.ts");
  let toolsContent = readFileSync(toolsPath, "utf-8");

  const today = new Date().toISOString().split("T")[0];
  const newEntry = `  {
    slug: "${slug}",
    title: { ko: "${titleKo}", en: "${titleEn}" },
    description: { ko: "${descKo}", en: "${descEn}" },
    category: "${category}",
    keywords: [${keywords.split(",").map((k) => `"${k.trim()}"`).join(", ")}],
    component: "${componentName}",
    datePublished: "${today}",
  },`;

  // Insert before the closing ];
  toolsContent = toolsContent.replace(
    /^(\];)/m,
    `${newEntry}\n$1`,
  );
  writeFileSync(toolsPath, toolsContent);
  console.log(`✅ Added to tools.ts registry`);

  // 3. Add to index.ts exports
  const indexPath = resolve("src/components/tools/index.ts");
  let indexContent = readFileSync(indexPath, "utf-8");

  // Add import
  const importLine = `import { ${componentName} } from "./${componentName}";`;
  indexContent = indexContent.replace(
    /(import .+ from ".\/\w+";)\n/,
    `$1\n${importLine}\n`,
  );

  // Add to TOOL_COMPONENTS
  indexContent = indexContent.replace(
    new RegExp(`(\\s+)(// ${componentName},.*)`),
    `$1${componentName},`,
  );

  // If no placeholder comment exists, add before closing brace
  if (!indexContent.includes(`${componentName},`) && !indexContent.includes(`${componentName}:`)) {
    indexContent = indexContent.replace(
      /^(};)/m,
      `  ${componentName},\n$1`,
    );
  }

  writeFileSync(indexPath, indexContent);
  console.log(`✅ Added to index.ts exports`);

  console.log(`\n🎉 Done! Now implement the tool logic in:`);
  console.log(`   src/components/tools/${componentName}.tsx`);
  console.log(`\nThen: git add -A && git commit -m "feat: add ${titleEn}" && git push`);
  console.log(`Cloudflare Pages will auto-build and deploy.\n`);

  rl.close();
}

main().catch(console.error);
