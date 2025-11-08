'use client';
import { useState } from 'react';
import { createSupabaseBrowser } from '@lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Login() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const sp = useSearchParams();
  const router = useRouter();
  const redirect = sp.get('redirect') ?? '/app';

  const onSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert('Check your email to confirm your account, then sign in.');
  };

  const onLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.push(redirect);
  };

  return (
    <div className="max-w-sm mx-auto grid gap-3">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <input className="border rounded px-3 py-2" placeholder="Email"
        value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Password" type="password"
        value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={onLogin} className="px-4 py-2 rounded bg-black text-white">Sign in</button>
      <button onClick={onSignup} className="px-4 py-2 rounded border">Create account</button>
    </div>
  );
}
