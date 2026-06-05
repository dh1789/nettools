import { getToolBySlug } from "../tools";

describe("jwt-generator enhancement 병합", () => {
  test("howTo가 존재하고 steps ≥ 2 (CMP-41은 3-5)", () => {
    const tool = getToolBySlug("jwt-generator");
    expect(tool).toBeDefined();
    expect(tool!.howTo).toBeDefined();
    expect(tool!.howTo!.steps.length).toBeGreaterThanOrEqual(2);
  });

  test("relatedTools에 짝 도구 jwt-decoder 포함", () => {
    const tool = getToolBySlug("jwt-generator");
    expect(tool!.relatedTools).toBeDefined();
    expect(tool!.relatedTools).toContain("jwt-decoder");
  });
});
