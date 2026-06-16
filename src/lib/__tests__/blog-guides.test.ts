import fs from "fs";
import path from "path";
import { parseFrontmatter } from "../blog";
import { getAllSlugs } from "@/data/tools";

const CONTENT_DIR = path.resolve(process.cwd(), "src/content/blog");
const LOCALES = ["ko", "en"] as const;
const VALID_CATEGORIES = ["network", "security", "linux", "developer", "general"];
const TOOL_SLUGS = new Set(getAllSlugs());

// Phase별로 채워짐 — Phase 1: jwt만 / Phase 2: +ssl,chmod / Phase 3: +dns,base64
const GUIDE_SLUGS = [
  "jwt-generate-guide",
];

describe("블로그 가이드 글", () => {
  GUIDE_SLUGS.forEach((slug) => {
    describe(slug, () => {
      it("ko/en MDX 쌍이 존재한다", () => {
        for (const locale of LOCALES) {
          const file = path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);
          expect(fs.existsSync(file)).toBe(true);
        }
      });

      it("필수 frontmatter 필드가 존재한다", () => {
        for (const locale of LOCALES) {
          const raw = fs.readFileSync(
            path.join(CONTENT_DIR, `${slug}.${locale}.mdx`),
            "utf8"
          );
          const { frontmatter } = parseFrontmatter(raw);
          expect(frontmatter.title).toBeTruthy();
          expect(frontmatter.description).toBeTruthy();
          expect(frontmatter.category).toBeTruthy();
          expect(frontmatter.keywords.length).toBeGreaterThanOrEqual(3);
        }
      });

      it("publishedAt이 YYYY-MM-DD 형식이다", () => {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.ko.mdx`), "utf8");
        const { frontmatter } = parseFrontmatter(raw);
        expect(frontmatter.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it("category가 유효한 ToolCategory다", () => {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.ko.mdx`), "utf8");
        const { frontmatter } = parseFrontmatter(raw);
        expect(VALID_CATEGORIES).toContain(frontmatter.category);
      });

      it("relatedTools가 ≥1이며 전부 실재 도구 slug다", () => {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.ko.mdx`), "utf8");
        const { frontmatter } = parseFrontmatter(raw);
        expect(frontmatter.relatedTools).toBeDefined();
        expect(frontmatter.relatedTools!.length).toBeGreaterThanOrEqual(1);
        for (const tool of frontmatter.relatedTools!) {
          expect(TOOL_SLUGS.has(tool)).toBe(true);
        }
      });

      it("본문에 연계 도구 링크 /tools/net/<slug>/ 가 최소 1개 있다", () => {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.ko.mdx`), "utf8");
        const { content } = parseFrontmatter(raw);
        expect(content).toMatch(/\/tools\/net\/[a-z0-9-]+\//);
      });
    });
  });
});
