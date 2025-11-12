import { cookies } from 'next/headers';
import { createSupabaseServer } from '@lib/supabase';

export default async function Billing() {
  const supabase = createSupabaseServer(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id, role, organizations!inner(id,name)')
    .eq('user_id', user!.id)
    .maybeSingle();

  if (!membership) return <p>No org</p>;

  return (
    <div className="grid gap-4 max-w-md">
      <h1 className="text-2xl font-semibold">Billing — {membership.organizations.name}</h1>
      <form action="/api/stripe/checkout" method="post">
        <button className="px-4 py-2 rounded bg-black text-white">Start Subscription</button>
      </form>
      <form action="/api/stripe/portal" method="post">
        <button className="px-4 py-2 rounded border">Open Customer Portal</button>
      </form>
    </div>
  );
}
