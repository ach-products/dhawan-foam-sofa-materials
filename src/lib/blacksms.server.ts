// Server-only: calls the BlackSMS gateway with a secret API key.
// Never import this at the top of a route file or a *.functions.ts module — those ship to the
// client bundle. Load it with `await import(...)` inside a server function handler instead.
const BLACKSMS_BASE = "https://blacksms.in";

type BlackSmsResponse = { status?: number; message?: string; [key: string]: unknown };

function getApiKey(): string {
  const key = process.env["BLACKSMS_API_KEY"];
  if (!key) throw new Error("Missing BLACKSMS_API_KEY environment variable.");
  return key;
}

async function callBlackSms(path: string, params: Record<string, string>) {
  const url = new URL(path, BLACKSMS_BASE);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, { headers: { Authorization: getApiKey() } });
  const text = await response.text();
  let data: BlackSmsResponse;
  try {
    data = (JSON.parse(text || "{}") as BlackSmsResponse) ?? {};
  } catch {
    console.error(`[blacksms] ${path} returned non-JSON (status ${response.status}):`, text.slice(0, 500));
    throw new Error(`BlackSMS returned an unexpected response (status ${response.status}). Please try again shortly.`);
  }
  const ok = response.ok && data.status !== 0;
  if (!ok) console.error(`[blacksms] ${path} failed (status ${response.status}):`, data);
  return { ok, message: typeof data.message === "string" ? data.message : undefined };
}

export async function sendOtpSms(mobile: string) {
  const { ok, message } = await callBlackSms("/getotp", { mobileno: mobile });
  if (!ok) throw new Error(message ?? "Could not send the OTP. Please try again.");
}

export async function verifyOtpSms(mobile: string, otp: string) {
  const { ok, message } = await callBlackSms("/validateotp", { otp, mobileno: mobile });
  if (!ok) throw new Error(message ?? "Incorrect OTP. Please try again.");
}
