/**
 * NMEA 0183 체크섬 계산 / 검증
 * ──────────────────────────────
 * 시작 구분자($ 표준 / ! AIS)와 `*` "사이" 모든 문자(구분자 제외)를
 * 8비트 XOR → 2자리 대문자 16진수.
 * 출처: gpsd NMEA(https://gpsd.gitlab.io/gpsd/NMEA.html),
 *       NMEA 0183 / AIVDM Wikipedia.
 *
 * 모든 함수는 입력 기반 순수 함수 (Date/random 미사용 — TR-5 hydration 안전).
 */

export interface NmeaResult {
  input: string; // 원본 줄
  start: '$' | '!' | null; // 시작 구분자 (null = 본문만)
  body: string; // XOR 대상 본문 (구분자~* 사이)
  computed: string; // 계산된 2자리 대문자 hex
  given: string | null; // 입력의 *XX (없으면 null)
  valid: boolean | null; // given 있을 때만 비교, 없으면 null(계산 모드)
  full: string; // 완성 문장 (start+body+"*"+computed)
  error?: string;
}

/** XOR 누적 1단계 */
export interface XorStep {
  char: string;
  code: number;
  acc: number;
}

/**
 * 본문 문자열의 8비트 XOR 체크섬을 2자리 대문자 hex로 반환.
 * @example computeChecksum('A') // '41'
 */
export function computeChecksum(body: string): string {
  let acc = 0;
  for (let i = 0; i < body.length; i++) {
    acc ^= body.charCodeAt(i) & 0xff;
  }
  return acc.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * 본문을 문자 단위로 XOR 누적하는 각 단계를 반환 (교육/디버깅용).
 * 마지막 step.acc 의 hex = computeChecksum(body).
 */
export function xorSteps(body: string): XorStep[] {
  const steps: XorStep[] = [];
  let acc = 0;
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    const code = body.charCodeAt(i) & 0xff;
    acc ^= code;
    steps.push({ char, code, acc });
  }
  return steps;
}

export interface ParsedSentence {
  start: '$' | '!' | null;
  body: string;
  given: string | null;
  error?: string;
}

const HEX2 = /^[0-9A-Fa-f]{2}$/;

/** 에러 메시지 (한/영) */
const ERR = {
  empty: { ko: '빈 입력입니다.', en: 'Empty input.' },
  givenLen: {
    ko: '체크섬은 * 뒤 2자리여야 합니다.',
    en: 'Checksum must be 2 characters after *.',
  },
  givenHex: {
    ko: '체크섬이 16진수(0-9, A-F)가 아닙니다.',
    en: 'Checksum is not valid hexadecimal (0-9, A-F).',
  },
} as const;

type Lang = 'ko' | 'en';

/**
 * 한 줄 NMEA 문장을 시작 구분자 / 본문 / 기존 체크섬으로 분해.
 * - 첫 글자가 `$`/`!` 면 start, 아니면 본문만(start null) 허용 → 계산 모드.
 * - 첫 `*` 까지가 본문, 이후 전부가 given 후보(2자리 hex 아니면 error).
 */
export function parseSentence(line: string, lang: Lang = 'ko'): ParsedSentence {
  const trimmed = line.trim();
  if (trimmed === '') {
    return { start: null, body: '', given: null, error: ERR.empty[lang] };
  }

  let start: '$' | '!' | null = null;
  let rest = trimmed;
  if (trimmed[0] === '$' || trimmed[0] === '!') {
    start = trimmed[0];
    rest = trimmed.slice(1);
  }

  const starIdx = rest.indexOf('*');
  if (starIdx === -1) {
    return { start, body: rest, given: null };
  }

  const body = rest.slice(0, starIdx);
  const givenRaw = rest.slice(starIdx + 1);
  if (givenRaw.length !== 2) {
    return { start, body, given: null, error: ERR.givenLen[lang] };
  }
  if (!HEX2.test(givenRaw)) {
    return { start, body, given: null, error: ERR.givenHex[lang] };
  }

  return { start, body, given: givenRaw };
}

/**
 * 문장을 검증(*XX 있을 때) 또는 계산(*XX 없을 때)하여 NmeaResult 반환.
 * - given 있으면 대소문자 무시 비교 → valid true/false.
 * - given 없으면 계산 모드 → valid null, full 에 완성 문장 제공.
 * - full = (start ?? '') + body + '*' + computed (항상 올바른 체크섬으로 완성).
 */
export function validateSentence(line: string, lang: Lang = 'ko'): NmeaResult {
  const parsed = parseSentence(line, lang);
  const { start, body, given } = parsed;

  if (parsed.error) {
    return {
      input: line,
      start,
      body,
      computed: '',
      given,
      valid: null,
      full: '',
      error: parsed.error,
    };
  }

  const computed = computeChecksum(body);
  const full = (start ?? '') + body + '*' + computed;
  const valid = given === null ? null : given.toUpperCase() === computed;

  return { input: line, start, body, computed, given, valid, full };
}
