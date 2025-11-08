import { createClient } from '@supabase/supabase-js';
import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createSupabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createSupabaseServerComponent() {
  return createServerComponentClient({ cookies });
}

export function createSupabaseRoute() {
  return createRouteHandlerClient({ cookies });
}
