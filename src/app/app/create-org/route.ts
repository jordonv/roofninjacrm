import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServer } from '@lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));

  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  if (!name) return NextResponse.redirect(new URL('/app', req.url));

  const { data: org, error } = await supabase.rpc('create_org_with_owner', { org_name: name, owner_id: user.id });
  if (error) throw error;

  await supabase.from('audit_logs')
    .insert({ org_id: org.id, user_id: user.id, action: 'org.created', meta: { name } });

  return NextResponse.redirect(new URL('/app', req.url));
}
