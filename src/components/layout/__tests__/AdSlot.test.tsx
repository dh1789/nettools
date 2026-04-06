/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import { AdSlot } from "../AdSlot";

describe("AdSlot — 레이아웃 시프트 방지 및 지연 로딩", () => {
  test("개발 환경에서 placeholder를 표시한다", () => {
    const { container } = render(<AdSlot position="top" />);
    expect(container.textContent).toContain("Ad: top");
  });

  test("placeholder에 data-ad-position 속성이 설정된다", () => {
    const { container } = render(<AdSlot position="sidebar" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-ad-position")).toBe("sidebar");
  });

  test("sidebar 포지션의 고정 최소 높이가 적용된다", () => {
    const { container } = render(<AdSlot position="sidebar" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.minHeight).toBe("250px");
  });

  test("top 포지션의 고정 최소 높이가 적용된다", () => {
    const { container } = render(<AdSlot position="top" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.minHeight).toBe("90px");
  });

  test("in-content 포지션의 고정 최소 높이가 적용된다", () => {
    const { container } = render(<AdSlot position="in-content" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.minHeight).toBe("280px");
  });

  test("className prop이 적용된다", () => {
    const { container } = render(<AdSlot position="bottom" className="my-ad" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains("my-ad")).toBe(true);
  });
});
