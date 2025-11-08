'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@lib/supabase';

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirect') ?? '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.push(redirectTo);
  }

  async function handleSignUp() {
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    alert('Check your email to confirm your account, then sign in.');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm grid gap-3">
        <h1 className="text-2xl font-semibold">Sign in to RoofNinjaCRM</h1>
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          onClick={handleSignIn}
          disabled={busy}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {busy ? 'Working…' : 'Sign in'}
        </button>
        <button
          onClick={handleSignUp}
          disabled={busy}
          className="px-4 py-2 rounded border disabled:opacity-50"
        >
          Create account
        </button>
      </div>
    </main>
  );
}
