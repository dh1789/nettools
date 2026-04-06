/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ComparisonTable } from "../ComparisonTable";
import type { ComparisonFeature } from "../ComparisonTable";

const SAMPLE_FEATURES: ComparisonFeature[] = [
  { name: "무료", ours: true, theirs: true },
  { name: "오프라인 사용", ours: true, theirs: false },
  { name: "한글 지원", ours: true, theirs: false },
  { name: "광고 없음", ours: true, theirs: false },
  { name: "빠른 속도", ours: true, theirs: "부분" },
];

describe("ComparisonTable", () => {
  it("테이블 헤더에 도구 이름이 표시된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="경쟁 도구"
        features={SAMPLE_FEATURES}
      />,
    );
    expect(screen.getByText("beomanro")).toBeInTheDocument();
    expect(screen.getByText("경쟁 도구")).toBeInTheDocument();
  });

  it("모든 기능 이름이 행에 렌더링된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="경쟁 도구"
        features={SAMPLE_FEATURES}
      />,
    );
    for (const f of SAMPLE_FEATURES) {
      expect(screen.getByText(f.name)).toBeInTheDocument();
    }
  });

  it("boolean true 값은 체크마크(✓)로 표시된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={[{ name: "기능A", ours: true, theirs: true }]}
      />,
    );
    const checks = screen.getAllByText("✓");
    expect(checks).toHaveLength(2);
  });

  it("boolean false 값은 X 마크(✗)로 표시된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={[{ name: "기능A", ours: false, theirs: false }]}
      />,
    );
    const crosses = screen.getAllByText("✗");
    expect(crosses).toHaveLength(2);
  });

  it("문자열 값은 그대로 표시된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={[{ name: "속도", ours: "빠름", theirs: "보통" }]}
      />,
    );
    expect(screen.getByText("빠름")).toBeInTheDocument();
    expect(screen.getByText("보통")).toBeInTheDocument();
  });

  it("기능 헤더 컬럼이 존재한다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={SAMPLE_FEATURES}
      />,
    );
    expect(screen.getByText("기능")).toBeInTheDocument();
  });

  it("빈 기능 배열일 때도 테이블 헤더는 렌더링된다", () => {
    render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={[]}
      />,
    );
    expect(screen.getByText("beomanro")).toBeInTheDocument();
    expect(screen.getByText("other")).toBeInTheDocument();
  });

  it("table 요소가 렌더링된다", () => {
    const { container } = render(
      <ComparisonTable
        ourName="beomanro"
        theirName="other"
        features={SAMPLE_FEATURES}
      />,
    );
    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
