// Demo-only login: no SMS is sent and nothing is verified on a server.
export const DEMO_OTP = '123456';
const KEY = 'dhawan-demo-phone';
export const isValidMobile = (m: string) => /^[6-9]\d{9}$/.test(m);
export const checkOtp = (code: string) => code === DEMO_OTP;
export const getDemoPhone = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export function setDemoPhone(phone: string | null) {
  if (phone) localStorage.setItem(KEY, phone); else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('demo-auth'));
}
