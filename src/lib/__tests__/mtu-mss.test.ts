import {
  ENCAPSULATIONS,
  computeMtu,
  getEncap,
  isBelowPractical,
} from '../mtu-mss';

// 검증 근거: PPPoE=RFC2516(6+2), GRE=RFC2784(outer IPv4 20+GRE 4),
// VXLAN=RFC7348(20+8+8+14=50), WireGuard 공식문서(IPv4 60 / IPv6 80),
// 6in4=RFC4213(outer IPv4 20), IPsec ESP tunnel = worst-case 73(AES-CBC+SHA1)

describe('ENCAPSULATIONS 데이터', () => {
  test('핵심 캡슐화 오버헤드 값 (스펙 일치)', () => {
    expect(getEncap('pppoe')!.overhead).toBe(8);
    expect(getEncap('gre')!.overhead).toBe(24);
    expect(getEncap('vxlan')!.overhead).toBe(50);
    expect(getEncap('wireguard')!.overhead).toBe(60);
    expect(getEncap('wireguard-v6')!.overhead).toBe(80);
    expect(getEncap('sit-6in4')!.overhead).toBe(20);
    expect(getEncap('ipip')!.overhead).toBe(20);
    expect(getEncap('geneve')!.overhead).toBe(50);
  });

  test('IPsec은 가변 플래그', () => {
    const ipsec = getEncap('ipsec-esp-tunnel')!;
    expect(ipsec.variable).toBe(true);
    expect(ipsec.overhead).toBe(73); // worst-case
  });

  test('모든 항목 id 유일 + 양수 오버헤드', () => {
    const ids = ENCAPSULATIONS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of ENCAPSULATIONS) expect(e.overhead).toBeGreaterThan(0);
  });
});

describe('computeMtu', () => {
  // Happy — 실무 대표 벡터
  test('1500 + WireGuard(IPv4) → MTU 1440 / MSS4 1400 / MSS6 1380', () => {
    const r = computeMtu(1500, ['wireguard']);
    expect(r.error).toBeUndefined();
    expect(r.effectiveMtu).toBe(1440);
    expect(r.mssV4).toBe(1400);
    expect(r.mssV6).toBe(1380);
  });

  test('1500 + PPPoE → 1492 / MSS4 1452', () => {
    const r = computeMtu(1500, ['pppoe']);
    expect(r.effectiveMtu).toBe(1492);
    expect(r.mssV4).toBe(1452);
  });

  test('1500 + GRE → 1476 / MSS4 1436', () => {
    const r = computeMtu(1500, ['gre']);
    expect(r.effectiveMtu).toBe(1476);
    expect(r.mssV4).toBe(1436);
  });

  test('1500 + VXLAN → 1450', () => {
    expect(computeMtu(1500, ['vxlan']).effectiveMtu).toBe(1450);
  });

  // 스택 중첩 (실무: 가정 PPPoE 위에 WireGuard)
  test('중첩: PPPoE + WireGuard → 1500-8-60=1432 / MSS4 1392', () => {
    const r = computeMtu(1500, ['pppoe', 'wireguard']);
    expect(r.effectiveMtu).toBe(1432);
    expect(r.mssV4).toBe(1392);
    expect(r.breakdown).toHaveLength(2);
    expect(r.totalOverhead).toBe(68);
  });

  // 점보 프레임
  test('9000 + VXLAN → 8950', () => {
    expect(computeMtu(9000, ['vxlan']).effectiveMtu).toBe(8950);
  });

  // 캡슐화 없음
  test('캡슐화 없음 → MTU 그대로, MSS만', () => {
    const r = computeMtu(1500, []);
    expect(r.effectiveMtu).toBe(1500);
    expect(r.mssV4).toBe(1460);
    expect(r.mssV6).toBe(1440);
  });

  // 가변(IPsec) 포함 시 플래그 전파
  test('IPsec 포함 → hasVariable true', () => {
    const r = computeMtu(1500, ['ipsec-esp-tunnel']);
    expect(r.hasVariable).toBe(true);
    expect(r.effectiveMtu).toBe(1427);
  });

  // Exception
  test('알 수 없는 id → error', () => {
    expect(computeMtu(1500, ['nope']).error).toBeDefined();
  });

  test('MTU 범위 밖(<576 결과 or 링크 MTU 68 미만) → error', () => {
    expect(computeMtu(60, []).error).toBeDefined();
    expect(computeMtu(100, ['wireguard']).error).toBeDefined(); // 결과 40 — IPv4 최소 미달
  });

  test('링크 MTU 비정수/음수 → error', () => {
    expect(computeMtu(-1, []).error).toBeDefined();
    expect(computeMtu(1500.5 as unknown as number, []).error).toBeDefined();
  });
});

describe('isBelowPractical', () => {
  test('576 미만 true / 이상 false', () => {
    expect(isBelowPractical(575)).toBe(true);
    expect(isBelowPractical(576)).toBe(false);
    expect(isBelowPractical(1500)).toBe(false);
  });
});
