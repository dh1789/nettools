/**
 * JWT 서명 (HMAC)
 * ───────────────
 * Web Crypto API 기반 HS256/HS384/HS512 서명. 외부 의존성 0.
 * 모든 처리는 클라이언트(또는 테스트 런타임)에서 수행되며 secret은 전송되지 않는다.
 */

export type JwtAlg = "HS256" | "HS384" | "HS512";

export interface JwtSignResult {
  token: string | null;
  error: string;
}

const ALG_HASH: Record<JwtAlg, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

/** 바이트 배열 → base64url (패딩 제거, URL-safe) */
function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** UTF-8 문자열 → base64url */
export function base64UrlEncode(input: string): string {
  return bytesToBase64Url(new TextEncoder().encode(input));
}

/**
 * Header/Payload JSON + secret으로 HMAC 서명된 JWT를 생성한다.
 * - header.alg는 alg 인자로 강제 동기화, typ 누락 시 "JWT" 기본값.
 * - JSON 파싱 실패 / 빈 secret이면 error를 반환하고 token은 null.
 */
export async function signJwt(
  headerJson: string,
  payloadJson: string,
  secret: string,
  alg: JwtAlg
): Promise<JwtSignResult> {
  if (!secret) {
    return { token: null, error: "Secret은 비어 있을 수 없습니다 (Secret cannot be empty)" };
  }

  let header: Record<string, unknown>;
  try {
    header = JSON.parse(headerJson);
  } catch {
    return { token: null, error: "Header가 올바른 JSON이 아닙니다 (Invalid JSON in Header)" };
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(payloadJson);
  } catch {
    return { token: null, error: "Payload가 올바른 JSON이 아닙니다 (Invalid JSON in Payload)" };
  }

  header.alg = alg;
  if (header.typ === undefined) header.typ = "JWT";

  const signingInput =
    base64UrlEncode(JSON.stringify(header)) +
    "." +
    base64UrlEncode(JSON.stringify(payload));

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: ALG_HASH[alg] },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signingInput)
    );
    const token = signingInput + "." + bytesToBase64Url(new Uint8Array(sigBuf));
    return { token, error: "" };
  } catch (e) {
    return {
      token: null,
      error: `서명 실패 (Signing failed): ${e instanceof Error ? e.message : "unknown"}`,
    };
  }
}
