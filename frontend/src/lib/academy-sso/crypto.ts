import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const PKCE_VERIFIER = /^[A-Za-z0-9\-._~]{43,128}$/;

function key(secret: string, purpose: string) {
  return createHash("sha256")
    .update(purpose)
    .update("\0")
    .update(secret)
    .digest();
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function createPkceVerifier() {
  return randomToken(48);
}

export function createPkceChallenge(verifier: string) {
  if (!PKCE_VERIFIER.test(verifier)) throw new Error("Invalid PKCE verifier.");
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sealJson(value: unknown, secret: string, purpose: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret, purpose), iv);
  cipher.setAAD(Buffer.from(purpose));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString(
    "base64url"
  );
}

export function openJson<T>(
  token: string,
  secret: string,
  purpose: string
): T | null {
  if (!token || token.length > 4096) return null;

  try {
    const packed = Buffer.from(token, "base64url");
    if (packed.length < 29) return null;
    const iv = packed.subarray(0, 12);
    const tag = packed.subarray(12, 28);
    const ciphertext = packed.subarray(28);
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(secret, purpose),
      iv
    );
    decipher.setAAD(Buffer.from(purpose));
    decipher.setAuthTag(tag);
    return JSON.parse(
      Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
        "utf8"
      )
    ) as T;
  } catch {
    return null;
  }
}
