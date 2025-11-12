
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@lib/supabase';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      router.replace(user ? '/hello' : '/login');
    };
    run();
  }, [router]);

  return <main style={{ padding: 24 }}>Loading…</main>;
}
