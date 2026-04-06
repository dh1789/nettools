/**
 * 카테고리별 OG 이미지 설정 및 경로 헬퍼
 */
import type { ToolCategory } from "@/data/tools";

export interface CategoryOgConfig {
  label: string;
  icon: string;
  bgColor: string;
  accentColor: string;
}

export const CATEGORY_OG_CONFIG: Record<ToolCategory, CategoryOgConfig> = {
  network: {
    label: "Network Tools",
    icon: "🌐",
    bgColor: "#0f172a",
    accentColor: "#38bdf8",
  },
  security: {
    label: "Security Tools",
    icon: "🔒",
    bgColor: "#0f172a",
    accentColor: "#4ade80",
  },
  linux: {
    label: "Linux Tools",
    icon: "🐧",
    bgColor: "#1a1a2e",
    accentColor: "#fb923c",
  },
  developer: {
    label: "Developer Tools",
    icon: "💻",
    bgColor: "#1e1b4b",
    accentColor: "#a78bfa",
  },
  general: {
    label: "General Tools",
    icon: "🔧",
    bgColor: "#18181b",
    accentColor: "#60a5fa",
  },
};

/**
 * 카테고리 ID에 해당하는 OG 이미지 경로를 반환
 * 알 수 없는 카테고리는 기본 이미지 경로 반환
 */
export function getCategoryOgImagePath(category: string): string {
  if (category in CATEGORY_OG_CONFIG) {
    return `/og/${category}.png`;
  }
  return "/og-image.png";
}
