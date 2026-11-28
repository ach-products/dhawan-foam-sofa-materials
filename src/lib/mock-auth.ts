// Session storage only: the OTP itself is sent and checked by BlackSMS (src/lib/otp.functions.ts).
const KEY = 'dhawan-demo-phone';
const EXP_KEY = 'dhawan-demo-phone-exp';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const isValidMobile = (m: string) => /^[6-9]\d{9}$/.test(m);
export function getDemoPhone(): string | null {
  if (typeof window === 'undefined') return null;
  const phone = localStorage.getItem(KEY);
  const exp = Number(localStorage.getItem(EXP_KEY));
  if (!phone || !exp || exp < Date.now()) {
    if (phone) setDemoPhone(null);
    return null;
  }
  return phone;
}
export function setDemoPhone(phone: string | null) {
  if (phone) { localStorage.setItem(KEY, phone); localStorage.setItem(EXP_KEY, String(Date.now() + SESSION_TTL_MS)); }
  else { localStorage.removeItem(KEY); localStorage.removeItem(EXP_KEY); }
  window.dispatchEvent(new Event('demo-auth'));
}
