import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Layers3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminLogin } from '@/lib/admin-auth.functions';
import { setAdminToken } from '@/lib/admin-session';

export const Route = createFileRoute('/admin-login')({
  head: () => ({ meta: [{ title: 'Admin login | Dhawan Foam & Sofa Materials' }, { name: 'robots', content: 'noindex' }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    const result = await adminLogin({ data: { username, password } });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setAdminToken(result.token, result.exp);
    navigate({ to: '/admin' });
  }

  return <div className="page-width login-page admin-login-page">
    <div className="admin-login-brand"><Layers3 strokeWidth={1.5} /><span>dhawan<span className="brand-small">FOAM & SOFA MATERIALS</span></span></div>
    <h1><ShieldCheck size={22} /> Admin login</h1>
    <p className="text-muted-foreground">Sign in with your admin username and password.</p>
    <form onSubmit={submit} className="admin-login-form">
      <label>Username<Input required autoFocus value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label>Password<Input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <Button type="submit" disabled={busy || !username || !password}>{busy ? 'Signing in…' : 'Sign in'}</Button>
    </form>
    {error && <p className="login-error">{error}</p>}
  </div>;
}
