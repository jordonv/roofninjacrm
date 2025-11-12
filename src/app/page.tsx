import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerFromCookies } from '@lib/supabase';

export default async function Home() {
  const supabase = createSupabaseServerFromCookies(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? '/app' : '/login');}