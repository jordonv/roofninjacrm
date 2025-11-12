
'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@lib/supabase';

export default function Login() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');

  async function signIn() {
    await supabase.auth.signInWithOtp({ email });
    alert('Magic link sent (check console in dev)');
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Login</h1>
      <p>Enter your email to receive a magic link.</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ padding: 8, width: '100%', marginTop: 8 }}
      />
      <button onClick={signIn} style={{ marginTop: 12, padding: 10 }}>Send Link</button>
    </main>
  );
}
