import {
  encodeQr,
  toSvg,
  fitCanvasSize,
  utf8ByteLength,
  ERROR_CORRECTION,
  type QrEncodeOk,
} from "../qr";

/** 파인더 패턴: 7×7 외곽 검정 테두리 + 3×3 검정 중심 — 세 모서리에 있어야 한다 */
function hasFinderPattern(m: boolean[][], top: number, left: number): boolean {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const edge = r === 0 || r === 6 || c === 0 || c === 6;
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      const expected = edge || core;
      if (m[top + r][left + c] !== expected) return false;
    }
  }
  return true;
}

function ok(text: string, level: "L" | "M" | "Q" | "H" = "M"): QrEncodeOk {
  const r = encodeQr(text, level);
  if (!r.ok) throw new Error(`인코딩 실패: ${r.reason}`);
  return r;
}

describe("utf8ByteLength", () => {
  it("ASCII 는 글자수와 같다", () => {
    expect(utf8ByteLength("hello")).toBe(5);
  });

  it("한글은 글자당 3바이트다", () => {
    expect(utf8ByteLength("사무실")).toBe(9);
  });

  it("이모지(서로게이트 쌍)도 UTF-8 바이트로 센다", () => {
    expect(utf8ByteLength("🔒")).toBe(4);
  });

  it("빈 문자열은 0", () => {
    expect(utf8ByteLength("")).toBe(0);
  });
});

describe("encodeQr — 구조", () => {
  it("모듈 행렬이 정사각이고 count 와 맞는다", () => {
    const r = ok("https://beomanro.com/");
    expect(r.modules.length).toBe(r.count);
    r.modules.forEach((row) => expect(row.length).toBe(r.count));
  });

  it("QR 규격상 크기는 21 + 4n (version 1~40)", () => {
    const r = ok("https://beomanro.com/");
    expect((r.count - 21) % 4).toBe(0);
    expect(r.count).toBeGreaterThanOrEqual(21);
    expect(r.count).toBeLessThanOrEqual(177);
  });

  it("파인더 패턴이 좌상·우상·좌하 세 곳에 있다", () => {
    const r = ok("https://beomanro.com/tools/net/qr-code-generator/");
    expect(hasFinderPattern(r.modules, 0, 0)).toBe(true);
    expect(hasFinderPattern(r.modules, 0, r.count - 7)).toBe(true);
    expect(hasFinderPattern(r.modules, r.count - 7, 0)).toBe(true);
  });

  it("우하단에는 파인더 패턴이 없다", () => {
    const r = ok("https://beomanro.com/tools/net/qr-code-generator/");
    expect(hasFinderPattern(r.modules, r.count - 7, r.count - 7)).toBe(false);
  });

  it("내용이 길수록 버전(크기)이 커진다", () => {
    const short = ok("a");
    const long = ok("a".repeat(500));
    expect(long.count).toBeGreaterThan(short.count);
  });

  it("같은 입력은 같은 행렬을 낸다 (결정적)", () => {
    const a = ok("https://beomanro.com/");
    const b = ok("https://beomanro.com/");
    expect(b.modules).toEqual(a.modules);
  });

  it("다른 입력은 다른 행렬을 낸다", () => {
    const a = ok("https://beomanro.com/");
    const b = ok("https://beomanro.com/x");
    expect(b.modules).not.toEqual(a.modules);
  });
});

describe("encodeQr — UTF-8 인코딩", () => {
  // 기본 인코더는 Shift_JIS 라 한글이 뭉개진다. 모듈 로드 시 UTF-8 로 교체해야 한다.
  it("한글은 UTF-8 바이트 수만큼 담긴다", () => {
    const r = ok("사무실 비밀번호");
    expect(r.byteLength).toBe(22);
  });

  it("한글이 ASCII 와 다른 행렬을 만든다 (SJIS 로 뭉개지지 않음)", () => {
    const ko = ok("가나다라마바사아자차");
    const en = ok("abcdefghij");
    expect(ko.modules).not.toEqual(en.modules);
    expect(ko.byteLength).toBe(30);
    expect(en.byteLength).toBe(10);
  });

  it("한글 QR 이 같은 글자수의 ASCII QR 보다 크거나 같다", () => {
    const ko = ok("가".repeat(100));
    const en = ok("a".repeat(100));
    expect(ko.count).toBeGreaterThanOrEqual(en.count);
  });

  /**
   * 행렬에 실제로 UTF-8 바이트가 들어갔는지 본다.
   * byteLength 만 검사하면 표시값은 맞고 인코딩은 틀린 상태를 놓친다 —
   * 실제로 그렇게 테스트는 통과하고 빌드가 깨졌다(2026-09-12).
   * 한글 n자(3n바이트)는 ASCII 3n자와 같은 버전이어야 한다.
   * latin-1 절단이면 n바이트로 줄어 더 작은 버전이 나온다(한글 100자: 41 vs 69).
   */
  it.each([10, 50, 100, 300])("한글 %i자가 ASCII 3n자와 같은 버전을 만든다", (n) => {
    expect(ok("가".repeat(n)).count).toBe(ok("a".repeat(n * 3)).count);
  });

  it("이모지도 UTF-8 4바이트로 들어간다", () => {
    expect(ok("🔒".repeat(50)).count).toBe(ok("a".repeat(200)).count);
  });

  it("와이파이 문자열(한글 SSID + 특수문자)을 담는다", () => {
    const r = ok("WIFI:T:WPA;S:사무실-5G;P:p@ss w0rd;;");
    expect(r.ok).toBe(true);
    expect(r.byteLength).toBe(utf8ByteLength("WIFI:T:WPA;S:사무실-5G;P:p@ss w0rd;;"));
  });
});

describe("encodeQr — 에러 처리", () => {
  it("빈 문자열은 empty", () => {
    const r = encodeQr("");
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("unreachable");
    expect(r.reason).toBe("empty");
    expect(r.message.ko).toBeTruthy();
    expect(r.message.en).toBeTruthy();
  });

  it("용량 초과는 too-long 이고 라이브러리 예외가 새지 않는다", () => {
    const r = encodeQr("a".repeat(3000), "M");
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("unreachable");
    expect(r.reason).toBe("too-long");
    expect(r.byteLength).toBe(3000);
    expect(r.maxBytes).toBe(2331);
    // 원문 예외("code length overflow. (40020>18672)")가 그대로 나오면 안 된다
    expect(r.message.ko).toContain("2331");
    expect(r.message.ko).not.toContain("overflow");
  });

  it("한글도 바이트 기준으로 한계를 판정한다", () => {
    // 한글 1000자 = 3000바이트 > M 한계 2331
    const r = encodeQr("가".repeat(1000), "M");
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("unreachable");
    expect(r.byteLength).toBe(3000);
  });
});

describe("ERROR_CORRECTION — 레벨별 용량", () => {
  it.each(ERROR_CORRECTION)("$level 은 한계 $maxBytes 바이트까지 인코딩된다", ({ level, maxBytes }) => {
    const at = encodeQr("a".repeat(maxBytes), level);
    expect(at.ok).toBe(true);
    const over = encodeQr("a".repeat(maxBytes + 1), level);
    expect(over.ok).toBe(false);
  });

  it("레벨이 높을수록 담는 양이 준다", () => {
    const caps = ERROR_CORRECTION.map((e) => e.maxBytes);
    expect(caps).toEqual([...caps].sort((a, b) => b - a));
  });

  it("같은 내용이면 H 가 L 보다 크거나 같은 QR 을 만든다", () => {
    const l = ok("https://beomanro.com/tools/net/qr-code-generator/", "L");
    const h = ok("https://beomanro.com/tools/net/qr-code-generator/", "H");
    expect(h.count).toBeGreaterThanOrEqual(l.count);
  });
});

describe("toSvg", () => {
  it("viewBox 가 모듈 수 + 여백 양쪽을 덮는다", () => {
    const r = ok("https://beomanro.com/");
    const svg = toSvg(r, { size: 256, margin: 4 });
    expect(svg).toContain(`viewBox="0 0 ${r.count + 8} ${r.count + 8}"`);
  });

  it("width/height 는 요청 크기를 따른다", () => {
    const svg = toSvg(ok("test"), { size: 512 });
    expect(svg).toContain('width="512"');
    expect(svg).toContain('height="512"');
  });

  it("검은 모듈 수만큼 path 세그먼트가 있다", () => {
    const r = ok("https://beomanro.com/");
    const darkCount = r.modules.flat().filter(Boolean).length;
    const svg = toSvg(r, { size: 256 });
    expect((svg.match(/h1v1h-1z/g) || []).length).toBe(darkCount);
  });

  it("모듈마다 rect 를 찍지 않는다 (path 로 합침)", () => {
    const svg = toSvg(ok("https://beomanro.com/"), { size: 256 });
    // 배경 rect 하나뿐
    expect((svg.match(/<rect/g) || []).length).toBe(1);
  });

  it("외부 리소스를 참조하지 않는다", () => {
    const svg = toSvg(ok("https://beomanro.com/"), { size: 256 });
    expect(svg).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
  });

  it("색을 바꿀 수 있다", () => {
    const svg = toSvg(ok("test"), { size: 256, dark: "#1d4ed8", light: "#f9fafb" });
    expect(svg).toContain('fill="#1d4ed8"');
    expect(svg).toContain('fill="#f9fafb"');
  });
});

describe("fitCanvasSize", () => {
  // 모듈이 소수점 픽셀에 걸리면 리샘플링으로 경계가 흐려져 스캐너가 읽기 어려워진다
  it.each([100, 200, 300, 400, 500])("%ipx 요청 시 모듈당 정수 픽셀이 된다", (size) => {
    const r = ok("https://beomanro.com/tools/net/qr-code-generator/");
    const px = fitCanvasSize(r, size);
    expect(px % (r.count + 8)).toBe(0);
  });

  it("요청 크기에서 모듈 하나 이상 벗어나지 않는다", () => {
    const r = ok("https://beomanro.com/");
    const total = r.count + 8;
    const px = fitCanvasSize(r, 200);
    expect(Math.abs(px - 200)).toBeLessThanOrEqual(total / 2);
  });

  it("요청이 모듈 수보다 작아도 최소 1배율은 지킨다", () => {
    const r = ok("a".repeat(2000), "L");
    const px = fitCanvasSize(r, 100);
    expect(px).toBe(r.count + 8);
  });

  it("요청 크기가 커지면 결과도 단조 증가한다", () => {
    const r = ok("https://beomanro.com/");
    const sizes = [100, 200, 300, 400, 500].map((s) => fitCanvasSize(r, s));
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });
});
