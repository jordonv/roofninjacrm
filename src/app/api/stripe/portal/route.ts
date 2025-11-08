import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { cookies } from 'next/headers';
import { createSupabaseServer } from '@lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: bc } = await supabase
    .from('memberships').select('org_id').eq('user_id', user.id).maybeSingle();

  if (!bc) return NextResponse.json({ error: 'No org' }, { status: 400 });

  const { data } = await supabase.from('billing_customers').select('*').eq('org_id', bc.org_id).maybeSingle();
  if (!data) return NextResponse.json({ error: 'No billing customer' }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`
  });

  return NextResponse.redirect(portal.url, { status: 303 });
}
