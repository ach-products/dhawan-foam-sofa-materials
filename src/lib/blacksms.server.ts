// Server-only: sends an SMS through BlackSMS with a secret API key.
// Never import this at the top of a route file or a *.functions.ts module — those ship to the
// client bundle. Load it with `await import(...)` inside a server function handler instead.
//
// Uses POST /sms (the "OTP Send API") to deliver a code WE generate (src/lib/otp-challenge.server.ts),
// rather than BlackSMS's own /getotp + /validateotp pair, whose response leg returned a Cloudflare
// 502 in testing even when the SMS was actually delivered (confirmed on the BlackSMS dashboard).
// Per https://blacksms.in/docs, /sms responds {"status": 1 | 0, "message": "..."} and takes the
// raw key in Authorization (no "Bearer" prefix) — a different shape/header than /getotp.
const BLACKSMS_BASE = "https://blacksms.in";

type SmsResponse = { status?: number; message?: string; [key: string]: unknown };

function getApiKey(): string {
  const key = process.env["BLACKSMS_API_KEY"];
  if (!key) throw new Error("Missing BLACKSMS_API_KEY environment variable.");
  return key;
}

function getSenderId(): string {
  const senderId = process.env["BLACKSMS_SENDER_ID"];
  if (!senderId) throw new Error("Missing BLACKSMS_SENDER_ID environment variable.");
  return senderId;
}

export async function sendOtpCodeSms(mobile: string, code: string): Promise<void> {
  const response = await fetch(new URL("/sms", BLACKSMS_BASE), {
    method: "POST",
    headers: { Authorization: getApiKey(), "Content-Type": "application/json" },
    body: JSON.stringify({ sender_id: getSenderId(), variables_values: code, numbers: mobile, route: "1" }),
  });
  const text = await response.text();
  let data: SmsResponse;
  try {
    data = (JSON.parse(text || "{}") as SmsResponse) ?? {};
  } catch {
    console.error(`[blacksms] /sms returned non-JSON (status ${response.status}):`, text.slice(0, 500));
    throw new Error(`BlackSMS returned an unexpected response (status ${response.status}). Please try again shortly.`);
  }
  if (!response.ok || data.status !== 1) {
    console.error(`[blacksms] /sms failed (status ${response.status}):`, data);
    throw new Error(typeof data.message === "string" && data.message ? data.message : "Could not send the OTP. Please try again.");
  }
}
