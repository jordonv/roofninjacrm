import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseBrowser() {
  return createClient(supabaseUrl, supabaseAnon);
}

export function createSupabaseServer() {
  const c = nextCookies();
  return createServerClient(supabaseUrl, supabaseAnon, { cookies: c as any });
}

export function createSupabaseRouteFromRequest(req: NextRequest, res: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        const v = req.cookies.get(name)?.value;
        return v ? { name, value: v } : undefined;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: '', ...options });
      }
    }
  });
}