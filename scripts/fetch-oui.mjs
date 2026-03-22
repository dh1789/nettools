#!/usr/bin/env node
/**
 * IEEE OUI 데이터 빌드 스크립트
 * ─────────────────────────────
 * 빌드 시 IEEE에서 최신 OUI CSV 3종을 다운로드하여
 * public/oui-db.json 으로 변환합니다.
 *
 * 사용: node scripts/fetch-oui.mjs
 * 빌드: npm run build (prebuild에서 자동 실행)
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "oui-db.json");

const SOURCES = [
  {
    url: "https://standards-oui.ieee.org/oui/oui.csv",
    key: "l", // MA-L 24-bit (6 hex chars)
  },
  {
    url: "https://standards-oui.ieee.org/oui28/mam.csv",
    key: "m", // MA-M 28-bit (7 hex chars)
  },
  {
    url: "https://standards-oui.ieee.org/oui36/oui36.csv",
    key: "s", // MA-S 36-bit (9 hex chars)
  },
];

function parseCSV(text) {
  const result = {};
  const lines = text.split("\n");
  // skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // CSV format: Registry,Assignment,Organization Name,Organization Address
    // Use simple parse - split on first 3 commas, handle quoted fields
    const match = line.match(/^[^,]*,([^,]+),(?:"([^"]*?)"|([^,]*?))\s*,/);
    if (match) {
      const prefix = match[1].trim().toUpperCase();
      const company = (match[2] || match[3] || "").trim();
      if (prefix && company) {
        result[prefix] = company;
      }
    }
  }
  return result;
}

async function main() {
  console.log("IEEE OUI 데이터 다운로드 중...");

  const db = {};
  let total = 0;

  for (const src of SOURCES) {
    process.stdout.write(`  ${src.key.toUpperCase()}: ${src.url} ... `);
    const res = await fetch(src.url);
    if (!res.ok) {
      console.error(`FAILED (${res.status})`);
      process.exit(1);
    }
    const text = await res.text();
    const entries = parseCSV(text);
    const count = Object.keys(entries).length;
    db[src.key] = entries;
    total += count;
    console.log(`${count} entries`);
  }

  writeFileSync(OUT_PATH, JSON.stringify(db, null, 0));
  const sizeKB = (Buffer.byteLength(JSON.stringify(db)) / 1024).toFixed(0);

  console.log(`\n완료: ${total} OUI → ${OUT_PATH} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error("OUI 다운로드 실패:", err.message);
  process.exit(1);
});
