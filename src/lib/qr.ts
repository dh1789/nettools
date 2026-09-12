/**
 * QR Code Encoder
 * ───────────────
 * 입력 문자열을 QR 모듈 행렬(boolean[][])로 인코딩한다.
 *
 * 전부 브라우저에서 실행된다. 이 모듈은 네트워크를 쓰지 않으며,
 * 입력 문자열은 호출자 밖으로 나가지 않는다(docs/ARCHITECTURE.md §9).
 *
 * 이전 구현은 입력을 `api.qrserver.com` 쿼리스트링에 실어 보냈다 —
 * URL·와이파이 비밀번호·연락처가 제3자 서버 로그에 남는 구조였다.
 */

import qrcode from "qrcode-generator";

/**
 * qrcode-generator 의 기본 바이트 인코더는 UTF-8 이 아니다. 빌드별로 다르게 틀린다:
 *   - CJS(dist/qrcode.js)  → Shift_JIS 표. '사무실 비밀번호'(UTF-8 22바이트)가 8바이트로 뭉개진다.
 *   - ESM(dist/qrcode.mjs) → `c & 0xff` latin-1 절단. 한글·이모지가 조용히 깨진다.
 * ESM 빌드엔 `stringToBytesFuncs` 자체가 없어 라이브러리 UTF-8 헬퍼도 못 쓴다
 * (2026-09-12 실측 — Jest 는 CJS, webpack 은 ESM 을 집어 테스트만 통과하고 빌드가 깨졌다).
 *
 * 그래서 인코딩을 라이브러리에 맡기지 않고 TextEncoder 로 직접 넣는다.
 * 내부 Byte 모드는 `qrcode.stringToBytes(data)` 로 호출 시점에 조회하므로 이 교체가 먹는다.
 */
const utf8 = new TextEncoder();
qrcode.stringToBytes = (s: string) => Array.from(utf8.encode(s));

/** 에러 정정 레벨 — 높을수록 훼손에 강하지만 담을 수 있는 양이 준다 */
export type ErrorCorrection = "L" | "M" | "Q" | "H";

export const ERROR_CORRECTION: {
  level: ErrorCorrection;
  /** 복원 가능한 훼손 비율 */
  recovery: string;
  /** Byte 모드 최대 바이트 수 (version 40 기준, 2026-09-12 실측) */
  maxBytes: number;
}[] = [
  { level: "L", recovery: "7%", maxBytes: 2953 },
  { level: "M", recovery: "15%", maxBytes: 2331 },
  { level: "Q", recovery: "25%", maxBytes: 1663 },
  { level: "H", recovery: "30%", maxBytes: 1273 },
];

export interface QrEncodeOk {
  ok: true;
  /** [row][col], true = 검은 모듈 */
  modules: boolean[][];
  /** 한 변의 모듈 수 (quiet zone 제외) */
  count: number;
  level: ErrorCorrection;
  /** UTF-8 인코딩 후 바이트 수 */
  byteLength: number;
  /** 해당 레벨의 최대 바이트 수 */
  maxBytes: number;
}

export type QrErrorReason = "empty" | "too-long";

export interface QrEncodeError {
  ok: false;
  reason: QrErrorReason;
  message: { ko: string; en: string };
  byteLength: number;
  maxBytes: number;
}

export type QrEncodeResult = QrEncodeOk | QrEncodeError;

/** UTF-8 바이트 길이 — 용량 판정과 안내 문구에 쓴다 */
export function utf8ByteLength(text: string): number {
  return utf8.encode(text).length;
}

function maxBytesFor(level: ErrorCorrection): number {
  return ERROR_CORRECTION.find((e) => e.level === level)?.maxBytes ?? 2331;
}

/**
 * 문자열을 QR 모듈 행렬로 인코딩한다.
 * 버전(크기)은 내용 길이에 맞춰 자동 선택된다(typeNumber 0).
 */
export function encodeQr(text: string, level: ErrorCorrection = "M"): QrEncodeResult {
  const maxBytes = maxBytesFor(level);
  const byteLength = utf8ByteLength(text);

  if (!text) {
    return {
      ok: false,
      reason: "empty",
      message: {
        ko: "변환할 내용을 입력하세요.",
        en: "Enter the content to encode.",
      },
      byteLength: 0,
      maxBytes,
    };
  }

  if (byteLength > maxBytes) {
    return {
      ok: false,
      reason: "too-long",
      message: {
        ko: `내용이 너무 깁니다 — ${byteLength}바이트. 에러 정정 ${level} 레벨의 한계는 ${maxBytes}바이트입니다. 레벨을 낮추거나 내용을 줄이세요.`,
        en: `Content too long — ${byteLength} bytes. The limit at error correction level ${level} is ${maxBytes} bytes. Lower the level or shorten the content.`,
      },
      byteLength,
      maxBytes,
    };
  }

  const qr = qrcode(0, level);
  qr.addData(text, "Byte");
  qr.make();

  const count = qr.getModuleCount();
  const modules: boolean[][] = [];
  for (let row = 0; row < count; row++) {
    const line: boolean[] = [];
    for (let col = 0; col < count; col++) line.push(qr.isDark(row, col));
    modules.push(line);
  }

  return { ok: true, modules, count, level, byteLength, maxBytes };
}

/**
 * 모듈 행렬을 SVG 문자열로 만든다.
 * 검은 모듈만 path 로 합쳐 그린다 — 모듈마다 rect 를 찍으면 파일이 수십 배 커진다.
 */
export function toSvg(
  result: QrEncodeOk,
  opts: { size: number; margin?: number; dark?: string; light?: string } = { size: 256 }
): string {
  const margin = opts.margin ?? 4;
  const dark = opts.dark ?? "#000000";
  const light = opts.light ?? "#ffffff";
  const total = result.count + margin * 2;

  let path = "";
  for (let row = 0; row < result.count; row++) {
    for (let col = 0; col < result.count; col++) {
      if (result.modules[row][col]) {
        path += `M${col + margin} ${row + margin}h1v1h-1z`;
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.size}" height="${opts.size}"`,
    ` viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">`,
    `<rect width="${total}" height="${total}" fill="${light}"/>`,
    `<path d="${path}" fill="${dark}"/>`,
    `</svg>`,
  ].join("");
}

/**
 * 요청 크기에 가장 가까우면서 모듈 경계가 정수 픽셀에 떨어지는 변 길이를 고른다.
 * 모듈이 소수점에 걸리면 리샘플링으로 경계가 흐려져 스캐너가 읽기 어려워진다.
 */
export function fitCanvasSize(result: QrEncodeOk, size: number, margin = 4): number {
  const total = result.count + margin * 2;
  return total * Math.max(1, Math.round(size / total));
}

/** 캔버스에 그린다 — 화면 표시 + PNG 다운로드용. 반환값은 실제 변 길이(px) */
export function drawToCanvas(
  canvas: HTMLCanvasElement,
  result: QrEncodeOk,
  opts: { size: number; margin?: number; dark?: string; light?: string } = { size: 256 }
): number {
  const margin = opts.margin ?? 4;
  const dark = opts.dark ?? "#000000";
  const light = opts.light ?? "#ffffff";
  const total = result.count + margin * 2;

  const px = fitCanvasSize(result, opts.size, margin);
  const scale = px / total;

  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) return px;

  ctx.fillStyle = light;
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = dark;
  for (let row = 0; row < result.count; row++) {
    for (let col = 0; col < result.count; col++) {
      if (result.modules[row][col]) {
        ctx.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
      }
    }
  }
  return px;
}
