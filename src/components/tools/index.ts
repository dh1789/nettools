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
import { CidrToRange } from "./CidrToRange";
import { IpLookup } from "./IpLookup";
import { DnsLookup } from "./DnsLookup";
import { PortDictionary } from "./PortDictionary";
import { PasswordGenerator } from "./PasswordGenerator";
import { Base64Tool } from "./Base64Tool";
import { JsonFormatter } from "./JsonFormatter";
import { CronParser } from "./CronParser";
import { ChmodCalculator } from "./ChmodCalculator";
import { SslChecker } from "./SslChecker";

export const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  SubnetCalculator,
  MacOuiLookup,
  CidrToRange,
  IpLookup,
  DnsLookup,
  PortDictionary,
  PasswordGenerator,
  Base64Tool,
  JsonFormatter,
  CronParser,
  ChmodCalculator,
  SslChecker,
};
