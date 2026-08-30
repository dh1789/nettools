"use client";

import { useLocale } from "@/lib/LocaleProvider";
import type { Tool } from "@/data/tools";
import type { GuideLink } from "@/lib/blog";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolLayout } from "./ToolLayout";

interface ToolPageContentProps {
  tool: Tool;
  /** 서버(page.tsx)에서 getGuidesForTool 로 계산해 넘긴 로케일별 관련 가이드 */
  relatedGuides?: Record<"ko" | "en", GuideLink[]>;
}

export function ToolPageContent({ tool, relatedGuides }: ToolPageContentProps) {
  const { locale } = useLocale();
  const Component = TOOL_COMPONENTS[tool.component];
  if (!Component) return null;

  return (
    <ToolLayout
      title={tool.title[locale]}
      description={tool.description[locale]}
      longDescription={tool.longDescription?.[locale]}
      faqs={tool.faqs}
      howTo={tool.howTo}
      relatedConcepts={tool.relatedConcepts}
      relatedTools={tool.relatedTools}
      relatedGuides={relatedGuides?.[locale]}
      usageExamples={tool.usageExamples}
      locale={locale}
    >
      <Component />
    </ToolLayout>
  );
}
