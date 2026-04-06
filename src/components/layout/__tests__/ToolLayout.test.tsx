/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ToolLayout } from "../ToolLayout";

// AdSlot mock
jest.mock("../AdSlot", () => ({
  AdSlot: () => null,
}));

// next/link mock
jest.mock("next/link", () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// tools data mock
jest.mock("@/data/tools", () => ({
  getToolBySlug: (slug: string) => {
    const mockTools: Record<string, { slug: string; title: { ko: string; en: string }; category: string }> = {
      "cidr-to-range": {
        slug: "cidr-to-range",
        title: { ko: "CIDR to IP 범위 변환", en: "CIDR to IP Range" },
        category: "network",
      },
      "vlsm-calculator": {
        slug: "vlsm-calculator",
        title: { ko: "VLSM 계산기", en: "VLSM Calculator" },
        category: "network",
      },
    };
    return mockTools[slug] || null;
  },
}));

const sampleHowTo = {
  steps: [
    { ko: "1단계: 입력값을 입력합니다.", en: "Step 1: Enter your input." },
    { ko: "2단계: 변환 버튼을 클릭합니다.", en: "Step 2: Click the convert button." },
    { ko: "3단계: 결과를 확인합니다.", en: "Step 3: Check the result." },
  ],
};

const sampleRelatedConcepts = [
  {
    title: { ko: "서브넷 마스크", en: "Subnet Mask" },
    description: {
      ko: "네트워크를 분할하는 데 사용되는 32비트 숫자입니다.",
      en: "A 32-bit number used to divide networks.",
    },
  },
  {
    title: { ko: "CIDR 표기법", en: "CIDR Notation" },
    description: {
      ko: "IP 주소와 접두사 길이를 표현하는 방법입니다.",
      en: "A method of representing IP addresses with prefix length.",
    },
  },
];

const sampleUsageExamples = [
  {
    title: { ko: "회사 네트워크 서브넷 분할", en: "Corporate Network Subnet Division" },
    scenario: {
      ko: "팀별로 네트워크를 분리해야 하는 상황",
      en: "Need to separate networks by team",
    },
    steps: [
      { ko: "IP 대역 입력", en: "Enter IP range" },
      { ko: "서브넷 크기 설정", en: "Set subnet size" },
      { ko: "결과 확인", en: "Check results" },
    ],
    result: {
      ko: "각 팀에 독립된 서브넷이 할당됩니다.",
      en: "Each team gets an independent subnet.",
    },
  },
  {
    title: { ko: "서버실 IP 할당 계획", en: "Server Room IP Allocation Plan" },
    scenario: {
      ko: "서버실에 새로운 장비를 추가할 때",
      en: "When adding new equipment to the server room",
    },
    steps: [
      { ko: "현재 서브넷 확인", en: "Check current subnet" },
      { ko: "필요한 호스트 수 입력", en: "Enter required host count" },
    ],
    result: {
      ko: "최적의 서브넷 크기를 확인할 수 있습니다.",
      en: "You can find the optimal subnet size.",
    },
  },
];

const sampleRelatedTools = ["cidr-to-range", "vlsm-calculator"];

describe("ToolLayout", () => {
  test("기본 렌더링: 제목, 설명, 자식 표시", () => {
    render(
      <ToolLayout title="테스트 도구" description="테스트 설명">
        <div data-testid="tool-body">도구 본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("테스트 도구")).toBeInTheDocument();
    expect(screen.getByText("테스트 설명")).toBeInTheDocument();
    expect(screen.getByTestId("tool-body")).toBeInTheDocument();
  });

  test("longDescription 전달 시 '도구 소개' 섹션 표시", () => {
    render(
      <ToolLayout
        title="도구"
        description="설명"
        longDescription="상세한 설명 텍스트"
      >
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("도구 소개")).toBeInTheDocument();
    expect(screen.getByText("상세한 설명 텍스트")).toBeInTheDocument();
  });

  test("howTo 전달 시 '사용 방법' 섹션과 단계 표시", () => {
    render(
      <ToolLayout title="도구" description="설명" howTo={sampleHowTo} locale="ko">
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("사용 방법")).toBeInTheDocument();
    expect(screen.getByText("1단계: 입력값을 입력합니다.")).toBeInTheDocument();
    expect(screen.getByText("2단계: 변환 버튼을 클릭합니다.")).toBeInTheDocument();
    expect(screen.getByText("3단계: 결과를 확인합니다.")).toBeInTheDocument();
  });

  test("howTo 미전달 시 '사용 방법' 섹션 미표시", () => {
    render(
      <ToolLayout title="도구" description="설명">
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.queryByText("사용 방법")).not.toBeInTheDocument();
  });

  test("relatedConcepts 전달 시 '관련 개념' 섹션 표시", () => {
    render(
      <ToolLayout
        title="도구"
        description="설명"
        relatedConcepts={sampleRelatedConcepts}
        locale="ko"
      >
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("관련 개념")).toBeInTheDocument();
    expect(screen.getByText("서브넷 마스크")).toBeInTheDocument();
    expect(
      screen.getByText("네트워크를 분할하는 데 사용되는 32비트 숫자입니다.")
    ).toBeInTheDocument();
    expect(screen.getByText("CIDR 표기법")).toBeInTheDocument();
  });

  test("relatedConcepts 미전달 시 '관련 개념' 섹션 미표시", () => {
    render(
      <ToolLayout title="도구" description="설명">
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.queryByText("관련 개념")).not.toBeInTheDocument();
  });

  test("relatedTools 전달 시 '관련 도구' 섹션과 링크 표시", () => {
    render(
      <ToolLayout
        title="도구"
        description="설명"
        relatedTools={sampleRelatedTools}
        locale="ko"
      >
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("관련 도구")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);
  });

  test("relatedTools 미전달 시 '관련 도구' 섹션 미표시", () => {
    render(
      <ToolLayout title="도구" description="설명">
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.queryByText("관련 도구")).not.toBeInTheDocument();
  });

  test("usageExamples 전달 시 '실사용 예시' 섹션과 시나리오 카드 표시", () => {
    render(
      <ToolLayout
        title="도구"
        description="설명"
        usageExamples={sampleUsageExamples}
        locale="ko"
      >
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.getByText("실사용 예시")).toBeInTheDocument();
    expect(screen.getByText("회사 네트워크 서브넷 분할")).toBeInTheDocument();
    expect(screen.getByText("팀별로 네트워크를 분리해야 하는 상황")).toBeInTheDocument();
    expect(screen.getByText("IP 대역 입력")).toBeInTheDocument();
    expect(screen.getByText("각 팀에 독립된 서브넷이 할당됩니다.")).toBeInTheDocument();
    expect(screen.getByText("서버실 IP 할당 계획")).toBeInTheDocument();
  });

  test("usageExamples 미전달 시 '실사용 예시' 섹션 미표시", () => {
    render(
      <ToolLayout title="도구" description="설명">
        <div>본체</div>
      </ToolLayout>
    );
    expect(screen.queryByText("실사용 예시")).not.toBeInTheDocument();
  });

  test("usageExamples 영어 locale 적용 시 영문 표시", () => {
    render(
      <ToolLayout
        title="Tool"
        description="Desc"
        usageExamples={sampleUsageExamples}
        locale="en"
      >
        <div>body</div>
      </ToolLayout>
    );
    expect(screen.getByText("Usage Examples")).toBeInTheDocument();
    expect(screen.getByText("Corporate Network Subnet Division")).toBeInTheDocument();
    expect(screen.getByText("Need to separate networks by team")).toBeInTheDocument();
    expect(screen.getByText("Enter IP range")).toBeInTheDocument();
    expect(screen.getByText("Each team gets an independent subnet.")).toBeInTheDocument();
  });

  test("영어 locale 적용 시 영문 섹션 제목 표시", () => {
    render(
      <ToolLayout
        title="Tool"
        description="Desc"
        howTo={sampleHowTo}
        relatedConcepts={sampleRelatedConcepts}
        relatedTools={sampleRelatedTools}
        locale="en"
      >
        <div>body</div>
      </ToolLayout>
    );
    expect(screen.getByText("How to Use")).toBeInTheDocument();
    expect(screen.getByText("Related Concepts")).toBeInTheDocument();
    expect(screen.getByText("Related Tools")).toBeInTheDocument();
    expect(screen.getByText("Step 1: Enter your input.")).toBeInTheDocument();
    expect(screen.getByText("Subnet Mask")).toBeInTheDocument();
  });
});
