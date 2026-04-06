import fs from "fs";
import path from "path";
import { parseFrontmatter } from "../blog";

const CONTENT_DIR = path.resolve(process.cwd(), "src/content/blog");

const COMPARISON_SLUGS = [
  "beomanro-vs-subnet-calculators",
  "beomanro-vs-crontab-guru",
  "beomanro-vs-regex101",
];

const LOCALES = ["ko", "en"] as const;

describe("비교 콘텐츠 MDX 파일", () => {
  for (const slug of COMPARISON_SLUGS) {
    for (const locale of LOCALES) {
      const filename = `${slug}.${locale}.mdx`;

      describe(filename, () => {
        it("파일이 존재한다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          expect(fs.existsSync(filePath)).toBe(true);
        });

        it("필수 frontmatter 필드가 존재한다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { frontmatter } = parseFrontmatter(raw);

          expect(frontmatter.title).toBeTruthy();
          expect(frontmatter.description).toBeTruthy();
          expect(frontmatter.category).toBeTruthy();
          expect(frontmatter.keywords.length).toBeGreaterThanOrEqual(3);
          expect(frontmatter.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it("relatedTools에 비교 대상 도구가 포함된다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { frontmatter } = parseFrontmatter(raw);

          expect(frontmatter.relatedTools).toBeDefined();
          expect(frontmatter.relatedTools!.length).toBeGreaterThanOrEqual(1);
        });

        it("본문에 비교표가 포함된다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { content } = parseFrontmatter(raw);

          // 마크다운 테이블 또는 ComparisonTable 컴포넌트 사용
          const hasMarkdownTable = content.includes("| ");
          const hasComparisonComponent = content.includes("ComparisonTable");
          expect(hasMarkdownTable || hasComparisonComponent).toBe(true);
        });

        it("본문에 h2 헤딩이 2개 이상 존재한다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { content } = parseFrontmatter(raw);

          const h2Count = (content.match(/^## /gm) || []).length;
          expect(h2Count).toBeGreaterThanOrEqual(2);
        });

        it("본문에 도구 페이지 내부 링크가 존재한다", () => {
          const filePath = path.join(CONTENT_DIR, filename);
          const raw = fs.readFileSync(filePath, "utf-8");
          const { content } = parseFrontmatter(raw);

          // /tools/ 또는 /도구slug 형태의 내부 링크
          const hasToolLink = /\[.*?\]\(\/tools\//.test(content) ||
            /\[.*?\]\(\/[a-z-]+\)/.test(content);
          expect(hasToolLink).toBe(true);
        });
      });
    }
  }
});
