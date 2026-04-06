/**
 * 실사용 예시(usageExamples) 검증 테스트
 * CMP-60: 도구 페이지 SEO 강화 — 실사용 예시 섹션 추가
 *
 * 완료 기준:
 * - UsageExample 인터페이스가 Tool에 존재 (optional)
 * - 상위 10개 도구에 usageExamples 데이터 포함 (각 2-3개)
 * - 한영 이중 언어 지원
 * - ToolEnhancement에 usageExamples 필드 존재
 */

import { getToolBySlug } from "../tools";
import type { Tool } from "../tools";

const TOP_10_SLUGS = [
  "subnet-calculator",
  "cron-parser",
  "regex-tester",
  "password-generator",
  "json-formatter",
  "base64",
  "chmod-calculator",
  "hash-generator",
  "cidr-to-range",
  "jwt-decoder",
];

describe("실사용 예시 데이터 (CMP-60)", () => {
  describe("상위 10개 도구에 usageExamples 존재", () => {
    TOP_10_SLUGS.forEach((slug) => {
      it(`${slug}: usageExamples 2-3개 존재`, () => {
        const tool = getToolBySlug(slug) as Tool;
        expect(tool).toBeDefined();
        expect(tool.usageExamples).toBeDefined();
        expect(tool.usageExamples!.length).toBeGreaterThanOrEqual(2);
        expect(tool.usageExamples!.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe("usageExamples 한영 이중 언어 검증", () => {
    TOP_10_SLUGS.forEach((slug) => {
      it(`${slug}: 모든 예시 필드에 ko/en 존재`, () => {
        const tool = getToolBySlug(slug) as Tool;
        expect(tool.usageExamples).toBeDefined();
        for (const example of tool.usageExamples!) {
          expect(example.title.ko).toBeTruthy();
          expect(example.title.en).toBeTruthy();
          expect(example.scenario.ko).toBeTruthy();
          expect(example.scenario.en).toBeTruthy();
          expect(example.steps.length).toBeGreaterThanOrEqual(2);
          for (const step of example.steps) {
            expect(step.ko).toBeTruthy();
            expect(step.en).toBeTruthy();
          }
          expect(example.result.ko).toBeTruthy();
          expect(example.result.en).toBeTruthy();
        }
      });
    });
  });
});
