// Session storage only: the OTP itself is sent and checked by BlackSMS (src/lib/otp.functions.ts).
const KEY = 'dhawan-demo-phone';
export const isValidMobile = (m: string) => /^[6-9]\d{9}$/.test(m);
export const getDemoPhone = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export function setDemoPhone(phone: string | null) {
  if (phone) localStorage.setItem(KEY, phone); else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('demo-auth'));
}
