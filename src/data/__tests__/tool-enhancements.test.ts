/**
 * 도구 콘텐츠 강화 검증 테스트
 * CMP-41: 도구 페이지 텍스트 깊이 확대
 *
 * 완료 기준:
 * - 도구 페이지당 순 텍스트 500자 이상 (한국어 기준)
 * - FAQ 6개 이상
 * - 관련 도구 내부 링크 존재
 */

import { TOOLS, CATEGORIES, getToolBySlug } from "../tools";
import type { Tool } from "../tools";

describe("도구 콘텐츠 강화 (CMP-41)", () => {
  // 텍스트 길이 계산 헬퍼: 도구 페이지에 렌더링되는 순 텍스트 합산
  function getToolTextLength(tool: Tool): number {
    let total = 0;
    // 제목
    total += tool.title.ko.length;
    // 짧은 설명
    total += tool.description.ko.length;
    // 상세 설명
    if (tool.longDescription) {
      total += tool.longDescription.ko.length;
    }
    // 사용 방법 (howTo steps)
    if (tool.howTo) {
      for (const step of tool.howTo.steps) {
        total += step.ko.length;
      }
    }
    // FAQ
    if (tool.faqs) {
      for (const faq of tool.faqs) {
        total += faq.question.ko.length;
        total += faq.answer.ko.length;
      }
    }
    // 관련 개념
    if (tool.relatedConcepts) {
      for (const concept of tool.relatedConcepts) {
        total += concept.title.ko.length;
        total += concept.description.ko.length;
      }
    }
    return total;
  }

  describe("모든 도구에 사용 방법(howTo) 가이드 존재", () => {
    TOOLS.forEach((tool) => {
      it(`${tool.slug}: howTo 3-5단계 존재`, () => {
        expect(tool.howTo).toBeDefined();
        expect(tool.howTo!.steps.length).toBeGreaterThanOrEqual(3);
        expect(tool.howTo!.steps.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("모든 도구에 FAQ 6개 이상 존재", () => {
    TOOLS.forEach((tool) => {
      it(`${tool.slug}: FAQ ${tool.faqs?.length ?? 0}개 → 6개 이상`, () => {
        expect(tool.faqs).toBeDefined();
        expect(tool.faqs!.length).toBeGreaterThanOrEqual(6);
      });
    });
  });

  describe("모든 도구에 관련 개념(relatedConcepts) 존재", () => {
    TOOLS.forEach((tool) => {
      it(`${tool.slug}: relatedConcepts 존재`, () => {
        expect(tool.relatedConcepts).toBeDefined();
        expect(tool.relatedConcepts!.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("모든 도구에 관련 도구(relatedTools) 내부 링크 존재", () => {
    TOOLS.forEach((tool) => {
      it(`${tool.slug}: relatedTools 존재하며 유효한 slug 참조`, () => {
        expect(tool.relatedTools).toBeDefined();
        expect(tool.relatedTools!.length).toBeGreaterThanOrEqual(2);
        // 참조된 slug가 실제 도구에 존재하는지 검증
        for (const relSlug of tool.relatedTools!) {
          expect(getToolBySlug(relSlug)).toBeDefined();
        }
      });
    });
  });

  describe("도구 페이지당 순 텍스트 500자 이상", () => {
    TOOLS.forEach((tool) => {
      it(`${tool.slug}: 순 텍스트 ≥ 500자`, () => {
        const length = getToolTextLength(tool);
        expect(length).toBeGreaterThanOrEqual(500);
      });
    });
  });

  describe("카테고리 랜딩 페이지 소개 텍스트 강화", () => {
    CATEGORIES.forEach((cat) => {
      it(`${cat.id}: 카테고리 설명 80자 이상`, () => {
        expect(cat.description.ko.length).toBeGreaterThanOrEqual(80);
        expect(cat.description.en.length).toBeGreaterThanOrEqual(80);
      });
    });
  });
});
