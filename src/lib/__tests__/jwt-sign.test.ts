import { base64UrlEncode, signJwt } from "../jwt-sign";

// 표준 벡터 (jwt.io HS256, secret "your-256-bit-secret")
const STD_HEADER = '{"alg":"HS256","typ":"JWT"}';
const STD_PAYLOAD = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';
const STD_SECRET = "your-256-bit-secret";
const STD_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("base64UrlEncode", () => {
  test("ASCII 인코딩 정확성", () => {
    expect(base64UrlEncode("{}")).toBe("e30");
    expect(base64UrlEncode(STD_HEADER)).toBe(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    );
  });

  test("패딩 제거 및 URL-safe 문자 (=, +, / 없음)", () => {
    const out = base64UrlEncode(STD_PAYLOAD);
    expect(out).not.toMatch(/[=+/]/);
    expect(out).toBe(
      "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
    );
  });

  test("UTF-8 한글 멀티바이트 인코딩", () => {
    expect(base64UrlEncode("한글")).toBe("7ZWc6riA");
  });
});

describe("signJwt", () => {
  test("HS256 표준벡터가 jwt.io SAMPLE과 바이트 일치", async () => {
    const r = await signJwt(STD_HEADER, STD_PAYLOAD, STD_SECRET, "HS256");
    expect(r.error).toBe("");
    expect(r.token).toBe(STD_JWT);
  });

  test("HS384/HS512는 서로 다른 signature 생성", async () => {
    const r256 = await signJwt(STD_HEADER, STD_PAYLOAD, STD_SECRET, "HS256");
    const r384 = await signJwt(STD_HEADER, STD_PAYLOAD, STD_SECRET, "HS384");
    const r512 = await signJwt(STD_HEADER, STD_PAYLOAD, STD_SECRET, "HS512");
    const sig = (t: string | null) => t!.split(".")[2];
    expect(sig(r384.token)).not.toBe(sig(r256.token));
    expect(sig(r512.token)).not.toBe(sig(r384.token));
    // alg가 header에 반영
    expect(r512.token!.split(".").length).toBe(3);
  });

  test("alg 인자가 header.alg를 덮어씀", async () => {
    const r = await signJwt('{"alg":"none","typ":"JWT"}', "{}", STD_SECRET, "HS256");
    expect(r.error).toBe("");
    // 첫 파트 디코드 → alg가 HS256
    const headerStr = Buffer.from(
      r.token!.split(".")[0].replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    expect(JSON.parse(headerStr).alg).toBe("HS256");
  });

  test("typ 누락 시 JWT 기본값 추가", async () => {
    const r = await signJwt('{"alg":"HS256"}', "{}", STD_SECRET, "HS256");
    const headerStr = Buffer.from(
      r.token!.split(".")[0].replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    expect(JSON.parse(headerStr).typ).toBe("JWT");
  });

  test("잘못된 JSON payload → error 반환, token null", async () => {
    const r = await signJwt(STD_HEADER, "{invalid", STD_SECRET, "HS256");
    expect(r.token).toBeNull();
    expect(r.error).not.toBe("");
  });

  test("빈 secret → error 반환", async () => {
    const r = await signJwt(STD_HEADER, STD_PAYLOAD, "", "HS256");
    expect(r.token).toBeNull();
    expect(r.error).not.toBe("");
  });
});
