/**
 * Tool Component Registry (Dynamic Import)
 * ──────────────────────────────────────────
 * 모든 도구 컴포넌트를 next/dynamic으로 지연 로딩하여
 * 초기 번들 크기를 줄이고 Core Web Vitals를 개선합니다.
 *
 * 새 도구 추가 시:
 * 1. src/components/tools/ 에 컴포넌트 파일 생성
 * 2. 여기에 dynamic import + TOOL_COMPONENTS 에 등록
 * 3. src/data/tools.ts 의 TOOLS 배열에 항목 추가
 */

import dynamic from "next/dynamic";
import { ToolLoadingSkeleton } from "./ToolLoadingSkeleton";

const loading = () => ToolLoadingSkeleton();

export const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  SubnetCalculator: dynamic(() => import("./SubnetCalculator").then(m => ({ default: m.SubnetCalculator })), { loading }),
  MacOuiLookup: dynamic(() => import("./MacOuiLookup").then(m => ({ default: m.MacOuiLookup })), { loading }),
  CidrToRange: dynamic(() => import("./CidrToRange").then(m => ({ default: m.CidrToRange })), { loading }),
  IpLookup: dynamic(() => import("./IpLookup").then(m => ({ default: m.IpLookup })), { loading }),
  DnsLookup: dynamic(() => import("./DnsLookup").then(m => ({ default: m.DnsLookup })), { loading }),
  PortDictionary: dynamic(() => import("./PortDictionary").then(m => ({ default: m.PortDictionary })), { loading }),
  PasswordGenerator: dynamic(() => import("./PasswordGenerator").then(m => ({ default: m.PasswordGenerator })), { loading }),
  Base64Tool: dynamic(() => import("./Base64Tool").then(m => ({ default: m.Base64Tool })), { loading }),
  JsonFormatter: dynamic(() => import("./JsonFormatter").then(m => ({ default: m.JsonFormatter })), { loading }),
  CronParser: dynamic(() => import("./CronParser").then(m => ({ default: m.CronParser })), { loading }),
  ChmodCalculator: dynamic(() => import("./ChmodCalculator").then(m => ({ default: m.ChmodCalculator })), { loading }),
  SslChecker: dynamic(() => import("./SslChecker").then(m => ({ default: m.SslChecker })), { loading }),
  UrlEncoder: dynamic(() => import("./UrlEncoder").then(m => ({ default: m.UrlEncoder })), { loading }),
  UnixTimestamp: dynamic(() => import("./UnixTimestamp").then(m => ({ default: m.UnixTimestamp })), { loading }),
  RegexTester: dynamic(() => import("./RegexTester").then(m => ({ default: m.RegexTester })), { loading }),
  HashGenerator: dynamic(() => import("./HashGenerator").then(m => ({ default: m.HashGenerator })), { loading }),
  TextCaseConverter: dynamic(() => import("./TextCaseConverter").then(m => ({ default: m.TextCaseConverter })), { loading }),
  NumberBaseConverter: dynamic(() => import("./NumberBaseConverter").then(m => ({ default: m.NumberBaseConverter })), { loading }),
  ColorConverter: dynamic(() => import("./ColorConverter").then(m => ({ default: m.ColorConverter })), { loading }),
  TextDiff: dynamic(() => import("./TextDiff").then(m => ({ default: m.TextDiff })), { loading }),
  LoremIpsumGenerator: dynamic(() => import("./LoremIpsumGenerator").then(m => ({ default: m.LoremIpsumGenerator })), { loading }),
  TextCounter: dynamic(() => import("./TextCounter").then(m => ({ default: m.TextCounter })), { loading }),
  QrCodeGenerator: dynamic(() => import("./QrCodeGenerator").then(m => ({ default: m.QrCodeGenerator })), { loading }),
  JwtDecoder: dynamic(() => import("./JwtDecoder").then(m => ({ default: m.JwtDecoder })), { loading }),
  JwtGenerator: dynamic(() => import("./JwtGenerator").then(m => ({ default: m.JwtGenerator })), { loading }),
  UuidGenerator: dynamic(() => import("./UuidGenerator").then(m => ({ default: m.UuidGenerator })), { loading }),
  YamlJsonConverter: dynamic(() => import("./YamlJsonConverter").then(m => ({ default: m.YamlJsonConverter })), { loading }),
  SqlFormatter: dynamic(() => import("./SqlFormatter").then(m => ({ default: m.SqlFormatter })), { loading }),
  MarkdownPreview: dynamic(() => import("./MarkdownPreview").then(m => ({ default: m.MarkdownPreview })), { loading }),
  HtmlEntityEncoder: dynamic(() => import("./HtmlEntityEncoder").then(m => ({ default: m.HtmlEntityEncoder })), { loading }),
  ByteUnitConverter: dynamic(() => import("./ByteUnitConverter").then(m => ({ default: m.ByteUnitConverter })), { loading }),
  TotpGenerator: dynamic(() => import("./TotpGenerator").then(m => ({ default: m.TotpGenerator })), { loading }),
  ImageBase64Converter: dynamic(() => import("./ImageBase64Converter").then(m => ({ default: m.ImageBase64Converter })), { loading }),
  HttpStatusDictionary: dynamic(() => import("./HttpStatusDictionary").then(m => ({ default: m.HttpStatusDictionary })), { loading }),
  CspGenerator: dynamic(() => import("./CspGenerator").then(m => ({ default: m.CspGenerator })), { loading }),
  SshConfigGenerator: dynamic(() => import("./SshConfigGenerator").then(m => ({ default: m.SshConfigGenerator })), { loading }),
  VlsmCalculator: dynamic(() => import("./VlsmCalculator").then(m => ({ default: m.VlsmCalculator })), { loading }),
  JsonSchemaValidator: dynamic(() => import("./JsonSchemaValidator").then(m => ({ default: m.JsonSchemaValidator })), { loading }),
  AsciiUnicodeTable: dynamic(() => import("./AsciiUnicodeTable").then(m => ({ default: m.AsciiUnicodeTable })), { loading }),
  WhoisLookup: dynamic(() => import("./WhoisLookup").then(m => ({ default: m.WhoisLookup })), { loading }),
  HttpHeadersChecker: dynamic(() => import("./HttpHeadersChecker").then(m => ({ default: m.HttpHeadersChecker })), { loading }),
  BcryptGenerator: dynamic(() => import("./BcryptGenerator").then(m => ({ default: m.BcryptGenerator })), { loading }),
  UfwRulesBuilder: dynamic(() => import("./UfwRulesBuilder").then(m => ({ default: m.UfwRulesBuilder })), { loading }),
  CodeMinifier: dynamic(() => import("./CodeMinifier").then(m => ({ default: m.CodeMinifier })), { loading }),
  JsonCsvConverter: dynamic(() => import("./JsonCsvConverter").then(m => ({ default: m.JsonCsvConverter })), { loading }),
  NmeaChecksum: dynamic(() => import("./NmeaChecksum").then(m => ({ default: m.NmeaChecksum })), { loading }),
};
