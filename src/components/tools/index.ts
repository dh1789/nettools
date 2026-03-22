/**
 * Tool Component Registry
 * ───────────────────────
 * 새 도구 추가 시:
 * 1. src/components/tools/ 에 컴포넌트 파일 생성
 * 2. 여기에 import + TOOL_COMPONENTS 에 등록
 * 3. src/data/tools.ts 의 TOOLS 배열에 항목 추가
 */

import { SubnetCalculator } from "./SubnetCalculator";
import { MacOuiLookup } from "./MacOuiLookup";

export const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  SubnetCalculator,
  MacOuiLookup,
  // CidrToRange,       ← 그 다음
};
