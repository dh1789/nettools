// TOOLS[].slug 중복 검사.
import fs from "node:fs";
import path from "node:path";

export function check({ root }) {
  const toolsTsPath = path.join(root, "src/data/tools.ts");
  if (!fs.existsSync(toolsTsPath)) return { ok: false, detail: "tools.ts 없음" };

  const src = fs.readFileSync(toolsTsPath, "utf8");
  const slugs = [...src.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

  const seen = new Map();
  const dups = [];
  for (const s of slugs) {
    seen.set(s, (seen.get(s) ?? 0) + 1);
    if (seen.get(s) === 2) dups.push(s);
  }

  return {
    ok: dups.length === 0,
    detail: dups.length === 0 ? `${slugs.length}개 slug 모두 유일` : `중복: ${dups.join(", ")}`,
    counts: { total: slugs.length, unique: seen.size },
  };
}
