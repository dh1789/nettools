// TOOLS[].component ↔ TOOL_COMPONENTS 키 ↔ src/components/tools/<Name>.tsx 정합성.
import fs from "node:fs";
import path from "node:path";

export function check({ root }) {
  const toolsTsPath = path.join(root, "src/data/tools.ts");
  const indexPath = path.join(root, "src/components/tools/index.ts");
  const componentsDir = path.join(root, "src/components/tools");

  if (!fs.existsSync(toolsTsPath) || !fs.existsSync(indexPath)) {
    return { ok: false, detail: "필수 파일 누락 (tools.ts 또는 index.ts)" };
  }

  const toolsTs = fs.readFileSync(toolsTsPath, "utf8");
  const indexTs = fs.readFileSync(indexPath, "utf8");

  const componentNames = [...toolsTs.matchAll(/component:\s*"([A-Za-z0-9_]+)"/g)].map((m) => m[1]);
  const registryKeys = [...indexTs.matchAll(/^\s+([A-Za-z0-9_]+):\s*dynamic\(/gm)].map((m) => m[1]);

  const missingInRegistry = componentNames.filter((n) => !registryKeys.includes(n));
  const orphanInRegistry = registryKeys.filter((k) => !componentNames.includes(k));
  const missingFiles = registryKeys.filter((k) => !fs.existsSync(path.join(componentsDir, `${k}.tsx`)));

  const issues = [];
  if (missingInRegistry.length) issues.push(`tools.ts 에는 있으나 index.ts 에 없음: ${missingInRegistry.join(", ")}`);
  if (orphanInRegistry.length) issues.push(`index.ts 에는 있으나 tools.ts 에 없음: ${orphanInRegistry.join(", ")}`);
  if (missingFiles.length) issues.push(`.tsx 파일 누락: ${missingFiles.join(", ")}`);

  return {
    ok: issues.length === 0,
    detail: issues.length === 0 ? `${componentNames.length}개 도구 정합성 OK` : issues.join(" | "),
    counts: { tools: componentNames.length, registry: registryKeys.length },
  };
}
