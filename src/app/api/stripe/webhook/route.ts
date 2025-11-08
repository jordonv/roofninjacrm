import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const raw = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = String(sub.customer);

    const { data: bc } = await supabase
      .from('billing_customers').select('org_id').eq('stripe_customer_id', customerId).maybeSingle();

    if (bc) {
      await supabase.from('billing_subscriptions')
        .upsert({
          org_id: bc.org_id,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000)
        });
    }
  }

  return NextResponse.json({ received: true });
}
