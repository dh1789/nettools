"use client";

import { useLocale } from "@/lib/LocaleProvider";
import type { Tool } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { ToolLayout } from "./ToolLayout";

interface ToolPageContentProps {
  tool: Tool;
}

export function ToolPageContent({ tool }: ToolPageContentProps) {
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
      locale={locale}
    >
      <Component />
    </ToolLayout>
  );
}
