// Server-only: real admin credential check plus a stateless, HMAC-signed session token (same
// shape as src/lib/otp-challenge.server.ts) so no server-side session storage is needed on a
// serverless deploy. Protects every admin mutation in products.functions.ts/categories.functions.ts.
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_TTL_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

function getSigningSecret(): string {
  const key = process.env["OTP_SIGNING_SECRET"];
  if (!key) throw new Error("Missing OTP_SIGNING_SECRET environment variable.");
  return key;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env["ADMIN_USERNAME"];
  const expectedPassword = process.env["ADMIN_PASSWORD"];
  if (!expectedUsername || !expectedPassword) throw new Error("Admin login is not configured.");
  return timingSafeEqualStrings(username, expectedUsername) && timingSafeEqualStrings(password, expectedPassword);
}

export function createAdminSessionToken(): { token: string; exp: number } {
  const exp = Date.now() + SESSION_TTL_MS;
  const encodedPayload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  return { token: `${encodedPayload}.${sign(encodedPayload)}`, exp };
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = sign(encodedPayload);
  if (!timingSafeEqualStrings(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(token: string | undefined | null): void {
  if (!verifyAdminSessionToken(token)) throw new Error("Your admin session has expired. Please log in again.");
}
