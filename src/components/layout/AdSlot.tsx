"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AdSlot — Google AdSense 통합 광고 슬롯 (Intersection Observer 지연 로딩)
 *
 * 뷰포트에 진입할 때만 광고 스크립트를 로딩하여 Core Web Vitals를 개선합니다.
 * 고정 크기 placeholder로 레이아웃 시프트(CLS)를 방지합니다.
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
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer로 뷰포트 진입 감지
  useEffect(() => {
    if (!ADSENSE_ID || !adSlotId) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [adSlotId]);

  // 뷰포트 진입 시 광고 로드
  useEffect(() => {
    if (!isVisible || !ADSENSE_ID || !adSlotId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // 광고 로드 실패 시 조용히 무시
    }
  }, [isVisible, adSlotId]);

  // 프로덕션: AdSense ID와 슬롯 ID가 모두 있을 때
  if (ADSENSE_ID && adSlotId) {
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
          overflow: "hidden",
        }}
      >
        {isVisible && (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_ID}
            data-ad-slot={adSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
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
