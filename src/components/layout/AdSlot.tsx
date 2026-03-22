"use client";

import { useEffect, useRef } from "react";

/**
 * AdSlot — 광고 네트워크 독립적 슬롯.
 * 초기: placeholder → 트래픽 생기면 PropellerAds/Ezoic 코드 삽입.
 * 이 파일 하나만 수정하면 전체 사이트 광고 반영.
 */

interface AdSlotProps {
  position: "top" | "sidebar" | "bottom" | "in-content";
  className?: string;
}

const SLOT_SIZES: Record<string, { w: string; h: string }> = {
  top: { w: "728px", h: "90px" },
  sidebar: { w: "300px", h: "250px" },
  bottom: { w: "728px", h: "90px" },
  "in-content": { w: "336px", h: "280px" },
};

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const size = SLOT_SIZES[position];

  useEffect(() => {
    // TODO: 광고 네트워크 연동 시 여기에 스크립트 삽입
    // 예: PropellerAds, Ezoic, Carbon Ads 등
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-ad-position={position}
      style={{
        width: "100%",
        maxWidth: size.w,
        minHeight: size.h,
        margin: "1rem auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed var(--border-color, #ddd)",
        borderRadius: "8px",
        color: "#999",
        fontSize: "12px",
      }}
    >
      {/* 프로덕션에서는 이 텍스트 제거 */}
      {process.env.NODE_ENV !== "production" && `Ad: ${position}`}
    </div>
  );
}
