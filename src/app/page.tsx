import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@lib/supabase';

export default async function Home() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? '/app' : '/login');
}