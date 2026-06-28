import {
  computeChecksum,
  xorSteps,
  parseSentence,
  validateSentence,
} from '../nmea-checksum';

// 검증된 테스트 벡터 (node XOR 자체 재현 + 발표 출처 일치)
//   gpsd NMEA / NMEA 0183 Wikipedia / Wikipedia AIVDM(*5C)
const GPGGA = 'GPGGA,092750.000,5321.6802,N,00630.3372,W,1,8,1.03,61.7,M,55.2,M,,';
const GPRMC = 'GPRMC,092751.000,A,5321.6802,N,00630.3371,W,0.06,31.66,280511,,,A';
const GNGGA = 'GNGGA,062735.00,3150.788156,N,11711.922383,E,1,12,2.0,90.0,M,,M,,';

describe('computeChecksum', () => {
  // Happy Path — 발표 벡터 (최우선 정확성)
  test('GPGGA 벡터 → 76', () => {
    expect(computeChecksum(GPGGA)).toBe('76');
  });

  test('GPRMC 벡터 → 45', () => {
    expect(computeChecksum(GPRMC)).toBe('45');
  });

  test('GNGGA 벡터 → 55', () => {
    expect(computeChecksum(GNGGA)).toBe('55');
  });

  // Boundary
  test('빈 본문 → 00', () => {
    expect(computeChecksum('')).toBe('00');
  });

  test('단일 문자 A → 41', () => {
    expect(computeChecksum('A')).toBe('41');
  });

  // 출력은 항상 2자리 대문자 hex (소문자 금지) — "=" (0x3D)
  test('대문자 hex 보장 (= → 3D, 소문자 아님)', () => {
    expect(computeChecksum('=')).toBe('3D');
    expect(computeChecksum('=')).not.toBe('3d');
  });

  test('결과는 항상 /^[0-9A-F]{2}$/', () => {
    for (const b of [GPGGA, GPRMC, GNGGA, '', 'A', '=', 'hello world']) {
      expect(computeChecksum(b)).toMatch(/^[0-9A-F]{2}$/);
    }
  });
});

describe('xorSteps', () => {
  test('단계 개수 = 본문 길이', () => {
    expect(xorSteps(GPGGA)).toHaveLength(GPGGA.length);
    expect(xorSteps('A')).toHaveLength(1);
    expect(xorSteps('')).toHaveLength(0);
  });

  test('마지막 acc(hex) = computeChecksum 결과', () => {
    const steps = xorSteps(GPGGA);
    const last = steps[steps.length - 1];
    expect(last.acc.toString(16).toUpperCase().padStart(2, '0')).toBe(
      computeChecksum(GPGGA)
    );
  });

  test('각 단계 char/code/acc 일관성 (수동 XOR 누적)', () => {
    const steps = xorSteps('AB');
    expect(steps[0]).toEqual({ char: 'A', code: 65, acc: 65 });
    expect(steps[1]).toEqual({ char: 'B', code: 66, acc: 65 ^ 66 });
  });
});

// AIS 벡터 (Wikipedia AIVDM, *5C 일치)
const AIS_BODY = 'AIVDM,1,1,,B,177KQJ5000G?tO`K>RA1wUbN0TKH,0';
const AIS_FULL = '!' + AIS_BODY + '*5C';

describe('parseSentence', () => {
  // Happy
  test('$ 문장 분해 (start/body/given)', () => {
    const r = parseSentence('$' + GPGGA + '*76');
    expect(r.error).toBeUndefined();
    expect(r.start).toBe('$');
    expect(r.body).toBe(GPGGA);
    expect(r.given).toBe('76');
  });

  test('! AIS 문장 분해', () => {
    const r = parseSentence(AIS_FULL);
    expect(r.error).toBeUndefined();
    expect(r.start).toBe('!');
    expect(r.body).toBe(AIS_BODY);
    expect(r.given).toBe('5C');
  });

  // Boundary
  test('* 없는 본문만 → given null', () => {
    const r = parseSentence('$' + GPGGA);
    expect(r.error).toBeUndefined();
    expect(r.start).toBe('$');
    expect(r.body).toBe(GPGGA);
    expect(r.given).toBeNull();
  });

  test('구분자 없는 순수 본문 허용 (start null)', () => {
    const r = parseSentence(GPGGA);
    expect(r.error).toBeUndefined();
    expect(r.start).toBeNull();
    expect(r.body).toBe(GPGGA);
    expect(r.given).toBeNull();
  });

  // Exception
  test('비-hex given → error', () => {
    const r = parseSentence('$GPGGA,x*ZZ');
    expect(r.error).toBeDefined();
  });

  test('길이≠2 given → error (1자/3자)', () => {
    expect(parseSentence('$GPGGA,x*4').error).toBeDefined();
    expect(parseSentence('$GPGGA,x*456').error).toBeDefined();
  });
});

describe('validateSentence', () => {
  // Happy
  test('유효 문장 → valid true', () => {
    const r = validateSentence('$' + GPGGA + '*76');
    expect(r.error).toBeUndefined();
    expect(r.valid).toBe(true);
    expect(r.computed).toBe('76');
    expect(r.given).toBe('76');
    expect(r.full).toBe('$' + GPGGA + '*76');
  });

  // Boundary
  test('틀린 체크섬 → valid false + computed 제시', () => {
    const r = validateSentence('$' + GPGGA + '*99');
    expect(r.valid).toBe(false);
    expect(r.computed).toBe('76');
    expect(r.given).toBe('99');
    expect(r.full).toBe('$' + GPGGA + '*76'); // 올바른 체크섬으로 완성
  });

  test('소문자 given normalize 비교 (*5c == 5C)', () => {
    const r = validateSentence('!' + AIS_BODY + '*5c');
    expect(r.valid).toBe(true);
    expect(r.computed).toBe('5C');
  });

  test('* 없음 → 계산 모드 (valid null, full 제공)', () => {
    const r = validateSentence('$' + GPGGA);
    expect(r.error).toBeUndefined();
    expect(r.valid).toBeNull();
    expect(r.given).toBeNull();
    expect(r.computed).toBe('76');
    expect(r.full).toBe('$' + GPGGA + '*76');
  });

  test('! AIS 검증 → valid true', () => {
    const r = validateSentence(AIS_FULL);
    expect(r.valid).toBe(true);
    expect(r.computed).toBe('5C');
  });

  test('구분자 없는 본문 계산 모드 (start null, full에 구분자 없음)', () => {
    const r = validateSentence(GPGGA);
    expect(r.error).toBeUndefined();
    expect(r.start).toBeNull();
    expect(r.valid).toBeNull();
    expect(r.full).toBe(GPGGA + '*76');
  });

  // Exception
  test('형식 오류 (비-hex given) → error, valid null', () => {
    const r = validateSentence('$GP*ZZ');
    expect(r.error).toBeDefined();
    expect(r.valid).toBeNull();
  });

  test('빈 입력 → error', () => {
    expect(validateSentence('   ').error).toBeDefined();
  });
});
