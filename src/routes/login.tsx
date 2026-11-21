import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { isValidMobile, setDemoPhone } from '@/lib/mock-auth';
import { sendOtp, verifyOtp } from '@/lib/otp.functions';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [
    { title: 'Login with mobile | Dhawan Foam & Sofa Materials' },
    { name: 'description', content: 'Sign in to Dhawan Foam & Sofa Materials with your mobile number and a one-time code.' },
    { property: 'og:title', content: 'Mobile login | Dhawan Foam' },
    { property: 'og:description', content: 'Sign in with your mobile number and OTP.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const phone = `+91${mobile}`;

  async function handleSendOtp() {
    if (!isValidMobile(mobile)) return setError('Enter a valid 10-digit mobile number.');
    setBusy(true); setError('');
    const result = await sendOtp({ data: { mobile } });
    setBusy(false);
    if (!result.sent) return setError(result.error ?? 'Could not send the OTP. Please try again.');
    setSent(true);
  }
  async function verify() {
    setBusy(true); setError('');
    const result = await verifyOtp({ data: { mobile, otp: code } });
    setBusy(false);
    if (!result.verified) return setError(result.error ?? 'Incorrect OTP. Please try again.');
    setDemoPhone(phone); navigate({ to: '/' });
  }

  return <div className="page-width login-page">
    <h1>Login</h1>
    <p className="text-muted-foreground">{sent ? `Enter the 6-digit code sent to ${phone}.` : 'Enter your mobile number. We will send you a one-time code.'}</p>
    {!sent ? <>
      <div className="phone-row"><span>+91</span><input inputMode="numeric" maxLength={10} aria-label="Mobile number" placeholder="98765 43210" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} /></div>
      <Button disabled={busy} onClick={handleSendOtp}>{busy ? 'Sending…' : 'Send OTP'}</Button>
    </> : <>
      <input inputMode="numeric" maxLength={6} aria-label="OTP code" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
      <Button disabled={busy || code.length !== 6} onClick={verify}>{busy ? 'Verifying…' : 'Verify & login'}</Button>
      <Button variant="link" onClick={() => { setSent(false); setCode(''); }}>Change number</Button>
    </>}
    {error && <p className="login-error">{error}</p>}
  </div>;
}
