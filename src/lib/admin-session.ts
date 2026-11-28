// Client-side storage for the admin session token (src/lib/admin-auth.server.ts signs and
// verifies it). The expiry is stored alongside it purely so the UI can redirect to the login
// page without a round trip; every admin mutation still verifies the token itself server-side.
const TOKEN_KEY = 'dhawan-admin-token';
const EXP_KEY = 'dhawan-admin-token-exp';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const exp = Number(localStorage.getItem(EXP_KEY));
  if (!token || !exp || exp < Date.now()) {
    if (token) setAdminToken(null);
    return null;
  }
  return token;
}

export function setAdminToken(token: string | null, exp?: number) {
  if (token && exp) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(EXP_KEY, String(exp)); }
  else { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(EXP_KEY); }
  window.dispatchEvent(new Event('admin-auth'));
}
