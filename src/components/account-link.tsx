import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { getDemoPhone, setDemoPhone } from '@/lib/mock-auth';

export function AccountLink() {
  const [phone, setPhone] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setPhone(getDemoPhone());
    sync();
    window.addEventListener('demo-auth', sync);
    return () => window.removeEventListener('demo-auth', sync);
  }, []);
  if (phone) return <Button variant="ghost" onClick={() => setDemoPhone(null)}>{phone} · Logout</Button>;
  return <Link to="/login">Login</Link>;
}
