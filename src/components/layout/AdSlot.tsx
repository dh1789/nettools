"use client";

import { useEffect, useRef } from "react";

/**
 * AdSlot — Google AdSense 통합 광고 슬롯.
 * NEXT_PUBLIC_ADSENSE_ID 환경변수가 설정되면 실제 광고를 표시합니다.
 * 미설정 시 개발 환경에서는 플레이스홀더를 표시합니다.
 *
 * 각 슬롯에 AdSense 광고 단위 ID를 adSlotId prop으로 전달하거나,
 * 자동 광고(auto ads)를 사용하는 경우 adSlotId 생략 가능합니다.
 */

interface AdSlotProps {
  position: "top" | "sidebar" | "bottom" | "in-content";
  adSlotId?: string;
  className?: string;
}

const SLOT_SIZES: Record<string, { w: string; h: string }> = {
  top: { w: "728px", h: "90px" },
  sidebar: { w: "300px", h: "250px" },
  bottom: { w: "728px", h: "90px" },
  "in-content": { w: "336px", h: "280px" },
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export function AdSlot({ position, adSlotId, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const size = SLOT_SIZES[position];

  useEffect(() => {
    if (!ADSENSE_ID || !adSlotId) return;
    try {
      // AdSense 광고 단위 로드
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // 광고 로드 실패 시 조용히 무시
    }
  }, [adSlotId]);

  // AdSense ID와 슬롯 ID가 모두 있을 때 실제 광고 표시
  if (ADSENSE_ID && adSlotId) {
    return (
      <div
        className={className}
        data-ad-position={position}
        style={{ width: "100%", maxWidth: size.w, margin: "1rem auto", overflow: "hidden" }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_ID}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 개발 환경 플레이스홀더
  if (process.env.NODE_ENV !== "production") {
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
        {`Ad: ${position}`}
      </div>
    );
  }

  // 프로덕션에서 AdSense ID 미설정 시 렌더링 없음
  return null;
}
