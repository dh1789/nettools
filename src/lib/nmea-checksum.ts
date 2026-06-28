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
