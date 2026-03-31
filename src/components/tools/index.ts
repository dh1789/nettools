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
import { UrlEncoder } from "./UrlEncoder";
import { UnixTimestamp } from "./UnixTimestamp";
import { RegexTester } from "./RegexTester";
import { HashGenerator } from "./HashGenerator";
import { TextCaseConverter } from "./TextCaseConverter";
import { NumberBaseConverter } from "./NumberBaseConverter";
import { ColorConverter } from "./ColorConverter";
import { TextDiff } from "./TextDiff";
import { LoremIpsumGenerator } from "./LoremIpsumGenerator";
import { TextCounter } from "./TextCounter";
import { QrCodeGenerator } from "./QrCodeGenerator";
import { JwtDecoder } from "./JwtDecoder";
import { UuidGenerator } from "./UuidGenerator";
import { YamlJsonConverter } from "./YamlJsonConverter";
import { SqlFormatter } from "./SqlFormatter";
import { MarkdownPreview } from "./MarkdownPreview";
import { HtmlEntityEncoder } from "./HtmlEntityEncoder";
import { ByteUnitConverter } from "./ByteUnitConverter";
import { TotpGenerator } from "./TotpGenerator";
import { ImageBase64Converter } from "./ImageBase64Converter";
import { HttpStatusDictionary } from "./HttpStatusDictionary";
import { CspGenerator } from "./CspGenerator";
import { SshConfigGenerator } from "./SshConfigGenerator";
import { VlsmCalculator } from "./VlsmCalculator";
import { JsonSchemaValidator } from "./JsonSchemaValidator";
import { AsciiUnicodeTable } from "./AsciiUnicodeTable";
import { WhoisLookup } from "./WhoisLookup";
import { HttpHeadersChecker } from "./HttpHeadersChecker";
import { BcryptGenerator } from "./BcryptGenerator";
import { UfwRulesBuilder } from "./UfwRulesBuilder";
import { CodeMinifier } from "./CodeMinifier";
import { JsonCsvConverter } from "./JsonCsvConverter";

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
  UrlEncoder,
  UnixTimestamp,
  RegexTester,
  HashGenerator,
  TextCaseConverter,
  NumberBaseConverter,
  ColorConverter,
  TextDiff,
  LoremIpsumGenerator,
  TextCounter,
  QrCodeGenerator,
  JwtDecoder,
  UuidGenerator,
  YamlJsonConverter,
  SqlFormatter,
  MarkdownPreview,
  HtmlEntityEncoder,
  ByteUnitConverter,
  TotpGenerator,
  ImageBase64Converter,
  HttpStatusDictionary,
  CspGenerator,
  SshConfigGenerator,
  VlsmCalculator,
  JsonSchemaValidator,
  AsciiUnicodeTable,
  WhoisLookup,
  HttpHeadersChecker,
  BcryptGenerator,
  UfwRulesBuilder,
  CodeMinifier,
  JsonCsvConverter,
};
