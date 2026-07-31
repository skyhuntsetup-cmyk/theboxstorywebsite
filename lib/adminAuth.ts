import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "tbs_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return secret;
}

function sign(expiry: string): string {
  return crypto.createHmac("sha256", getSecret()).update(expiry).digest("hex");
}

/** Build a signed "<expiryMs>.<signature>" session token. */
export function createSessionToken(): string {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  return `${expiry}.${sign(expiry)}`;
}

/** Verify a session token's signature and expiry. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (Date.now() > Number(expiry)) return false;
  try {
    const expected = sign(expiry);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkPassword(candidate: string): boolean {
  const secret = getSecret();
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
