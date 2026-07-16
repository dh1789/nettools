/**
 * MTU / MSS 계산 (터널·캡슐화 오버헤드)
 * ──────────────────────────────────────
 * 링크 MTU에서 캡슐화 스택의 오버헤드를 차감해 유효 MTU와
 * TCP MSS(IPv4/IPv6)를 계산한다. 전부 순수 계산 (TR-5 안전).
 *
 * 오버헤드 근거:
 * - PPPoE 8 = PPPoE 헤더 6 + PPP 2 (RFC 2516)
 * - GRE 24 = outer IPv4 20 + GRE 기본 헤더 4 (RFC 2784), +key/seq 시 증가
 * - VXLAN 50 = outer IPv4 20 + UDP 8 + VXLAN 8 + inner Ethernet 14 (RFC 7348)
 * - GENEVE 50 = outer IPv4 20 + UDP 8 + GENEVE 기본 8 + inner Ethernet 14 (옵션 시 증가)
 * - WireGuard 60/80 = outer IPv4 20(IPv6 40) + UDP 8 + WG 데이터 헤더 32 (공식 문서)
 * - 6in4/IPIP 20 = outer IPv4 20 (RFC 4213)
 * - IPsec ESP tunnel 73 = worst-case(AES-CBC + HMAC-SHA1: outer 20 + ESP 8 + IV 16
 *   + pad ≤15 + trailer 2 + ICV 12). 스위트에 따라 54~73B 가변 → variable 플래그.
 * - L2TP/IPsec 미포함 순수 L2TP 40 = outer IP 20 + UDP 8 + L2TP 8 + PPP 4 (전형값)
 */

export interface Encapsulation {
  id: string;
  name: { ko: string; en: string };
  overhead: number; // bytes
  variable?: boolean; // 스위트/옵션에 따라 가변 (표기값 = worst-case)
  note?: { ko: string; en: string };
}

export const ENCAPSULATIONS: Encapsulation[] = [
  {
    id: 'pppoe',
    name: { ko: 'PPPoE', en: 'PPPoE' },
    overhead: 8,
  },
  {
    id: 'gre',
    name: { ko: 'GRE (IPv4, 기본)', en: 'GRE (IPv4, base)' },
    overhead: 24,
    note: {
      ko: 'key/sequence 옵션 사용 시 +4~8B',
      en: '+4–8B with key/sequence options',
    },
  },
  {
    id: 'ipip',
    name: { ko: 'IPIP (IPv4-in-IPv4)', en: 'IPIP (IPv4-in-IPv4)' },
    overhead: 20,
  },
  {
    id: 'sit-6in4',
    name: { ko: '6in4 (SIT 터널)', en: '6in4 (SIT tunnel)' },
    overhead: 20,
  },
  {
    id: 'vxlan',
    name: { ko: 'VXLAN', en: 'VXLAN' },
    overhead: 50,
  },
  {
    id: 'geneve',
    name: { ko: 'GENEVE (기본)', en: 'GENEVE (base)' },
    overhead: 50,
    note: {
      ko: 'TLV 옵션 사용 시 증가',
      en: 'Grows with TLV options',
    },
  },
  {
    id: 'wireguard',
    name: { ko: 'WireGuard (IPv4 밖)', en: 'WireGuard (IPv4 outer)' },
    overhead: 60,
  },
  {
    id: 'wireguard-v6',
    name: { ko: 'WireGuard (IPv6 밖)', en: 'WireGuard (IPv6 outer)' },
    overhead: 80,
  },
  {
    id: 'ipsec-esp-tunnel',
    name: { ko: 'IPsec ESP 터널 (worst-case)', en: 'IPsec ESP tunnel (worst-case)' },
    overhead: 73,
    variable: true,
    note: {
      ko: 'AES-CBC+SHA1 최악치. 스위트에 따라 54~73B — 보수적 값 적용',
      en: 'Worst case for AES-CBC+SHA1. 54–73B depending on suite — conservative value used',
    },
  },
  {
    id: 'l2tp',
    name: { ko: 'L2TP (IPsec 제외)', en: 'L2TP (without IPsec)' },
    overhead: 40,
  },
  {
    id: 'openvpn-udp',
    name: { ko: 'OpenVPN (UDP, AES-GCM)', en: 'OpenVPN (UDP, AES-GCM)' },
    overhead: 69,
    variable: true,
    note: {
      ko: '전형값. 암호·압축 설정에 따라 ±수B',
      en: 'Typical. Varies a few bytes with cipher/compression',
    },
  },
];

export function getEncap(id: string): Encapsulation | undefined {
  return ENCAPSULATIONS.find((e) => e.id === id);
}

export interface MtuBreakdownRow {
  id: string;
  name: { ko: string; en: string };
  overhead: number;
  mtuAfter: number;
  variable?: boolean;
}

export interface MtuResult {
  linkMtu: number;
  totalOverhead: number;
  effectiveMtu: number;
  mssV4: number; // effectiveMtu - 20(IPv4) - 20(TCP)
  mssV6: number; // effectiveMtu - 40(IPv6) - 20(TCP)
  breakdown: MtuBreakdownRow[];
  hasVariable: boolean;
  error?: string;
}

const IPV4_MIN_MTU = 68; // RFC 791
const RESULT_MIN = 576; // 실용 하한 경고 기준(IPv4 최소 재조립 크기)

const ERR = {
  linkMtu: {
    ko: '링크 MTU는 68 이상의 정수여야 합니다.',
    en: 'Link MTU must be an integer ≥ 68.',
  },
  unknown: {
    ko: '알 수 없는 캡슐화 ID입니다: ',
    en: 'Unknown encapsulation id: ',
  },
  tooSmall: {
    ko: '유효 MTU가 너무 작습니다(IPv4 최소 68B 미달). 캡슐화 스택을 확인하세요.',
    en: 'Effective MTU is too small (below the IPv4 minimum of 68B). Check the encapsulation stack.',
  },
} as const;

type Lang = 'ko' | 'en';

/**
 * 링크 MTU와 캡슐화 스택(순서대로 중첩)으로 유효 MTU/MSS 계산.
 */
export function computeMtu(
  linkMtu: number,
  encapIds: string[],
  lang: Lang = 'ko'
): MtuResult {
  const fail = (msg: string): MtuResult => ({
    linkMtu,
    totalOverhead: 0,
    effectiveMtu: 0,
    mssV4: 0,
    mssV6: 0,
    breakdown: [],
    hasVariable: false,
    error: msg,
  });

  if (!Number.isInteger(linkMtu) || linkMtu < IPV4_MIN_MTU) {
    return fail(ERR.linkMtu[lang]);
  }

  const breakdown: MtuBreakdownRow[] = [];
  let mtu = linkMtu;
  let total = 0;
  let hasVariable = false;

  for (const id of encapIds) {
    const encap = getEncap(id);
    if (!encap) return fail(ERR.unknown[lang] + id);
    mtu -= encap.overhead;
    total += encap.overhead;
    if (encap.variable) hasVariable = true;
    breakdown.push({
      id: encap.id,
      name: encap.name,
      overhead: encap.overhead,
      mtuAfter: mtu,
      variable: encap.variable,
    });
  }

  if (mtu < IPV4_MIN_MTU) return fail(ERR.tooSmall[lang]);

  return {
    linkMtu,
    totalOverhead: total,
    effectiveMtu: mtu,
    mssV4: mtu - 40,
    mssV6: mtu - 60,
    breakdown,
    hasVariable,
  };
}

/** 실용 하한(576B) 미만이면 경고 대상 */
export function isBelowPractical(mtu: number): boolean {
  return mtu < RESULT_MIN;
}
