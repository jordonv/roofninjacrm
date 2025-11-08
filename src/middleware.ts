import { NextRequest, NextResponse } from 'next/server';
import { supabaseFromMiddleware } from '@lib/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/app')) {
    const supabase = supabaseFromMiddleware(req, res);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = { matcher: ['/app/:path*'] };
