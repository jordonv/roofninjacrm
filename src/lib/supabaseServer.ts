import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createSupabaseServerComponent() {
  return createServerComponentClient({ cookies });
}

export function createSupabaseRoute() {
  return createRouteHandlerClient({ cookies });
}
