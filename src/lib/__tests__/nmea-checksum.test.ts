import {
  computeChecksum,
  xorSteps,
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
