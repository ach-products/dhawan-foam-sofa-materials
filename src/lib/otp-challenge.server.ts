// Server-only: generates and verifies OTP codes ourselves (instead of relying on BlackSMS's own
// getotp/validateotp, which proved unreliable). The challenge is a stateless, HMAC-signed token —
// {mobile, codeHash, exp} — so no server-side storage is needed between the send and verify steps,
// which matters on a serverless deploy where the two calls may not hit the same instance.
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";

const CODE_TTL_MS = 5 * 60 * 1000;

function getSigningSecret(): string {
  const key = process.env["OTP_SIGNING_SECRET"];
  if (!key) throw new Error("Missing OTP_SIGNING_SECRET environment variable.");
  return key;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

function hashCode(mobile: string, code: string): string {
  return createHash("sha256").update(`${mobile}:${code}`).digest("base64url");
}

export function generateOtpCode(): string {
  return String(randomInt(1000, 10000)); // 4 digits
}

export function createChallenge(mobile: string, code: string): string {
  const payload = JSON.stringify({ mobile, codeHash: hashCode(mobile, code), exp: Date.now() + CODE_TTL_MS });
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyChallenge(mobile: string, code: string, token: string): boolean {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
    mobile: string;
    codeHash: string;
    exp: number;
  };
  if (payload.exp < Date.now()) return false;
  if (payload.mobile !== mobile) return false;
  return payload.codeHash === hashCode(mobile, code);
}
