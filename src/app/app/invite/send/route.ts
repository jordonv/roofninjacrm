import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRoute } from '@lib/supabaseServer';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));

  const form = await req.formData();
  const org_id = String(form.get('org_id'));
  const email = String(form.get('email')).toLowerCase().trim();
  const role = String(form.get('role') || 'tech') as 'tech'|'manager';

  const { data: me } = await supabase.from('memberships').select('role').eq('org_id', org_id).eq('user_id', user.id).maybeSingle();
  if (!me || !['owner','manager'].includes(me.role)) return NextResponse.redirect(new URL('/app', req.url));

  const token = crypto.randomBytes(24).toString('hex');
  await supabase.from('invites').insert({ org_id, email, role, token });

  await supabase.from('audit_logs').insert({ org_id, user_id: user.id, action: 'invite.created', meta: { email, role } });

  return NextResponse.redirect(new URL('/app', req.url));
}
