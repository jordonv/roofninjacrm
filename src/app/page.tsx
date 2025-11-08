import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerFromCookies } from '@lib/supabase';

export default async function Home() {
  const supabase = createSupabaseServerFromCookies(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  // If the user is authenticated, send them to the app dashboard.
  // Otherwise, send them to the login screen.
  redirect(user ? '/app' : '/login');
}
