import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseRoute } from '@lib/supabaseServer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRoute();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: membership } = await supabase
    .from('memberships').select('org_id, profiles: user_id ( email )').eq('user_id', user.id).maybeSingle();

  if (!membership) return NextResponse.json({ error: 'No org' }, { status: 400 });

  let { data: bc } = await supabase.from('billing_customers').select('*').eq('org_id', membership.org_id).maybeSingle();
  let customerId = bc?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: membership.profiles?.email ?? undefined });
    customerId = customer.id;
    await supabase.from('billing_customers').insert({ org_id: membership.org_id, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
    customer: customerId
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
