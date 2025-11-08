import { cookies } from 'next/headers';
import { createSupabaseServer } from '@lib/supabase';
import Link from 'next/link';

export default async function AppHome() {
  const supabase = createSupabaseServer(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id, role, organizations!inner(id,name)')
    .eq('user_id', user!.id)
    .maybeSingle();

  if (!membership) {
    return (
      <div className="grid gap-4 max-w-xl">
        <h1 className="text-2xl font-semibold">Create your organization</h1>
        <form action="/app/create-org" method="post" className="grid gap-3">
          <input name="name" required placeholder="Organization name" className="border rounded px-3 py-2" />
          <button className="px-4 py-2 rounded bg-black text-white">Create</button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Dashboard — {membership.organizations.name}</h1>
      <div className="flex gap-3">
        <Link className="px-3 py-2 rounded border" href="/app/invite">Invite teammate</Link>
        <Link className="px-3 py-2 rounded border" href="/app/billing">Billing</Link>
      </div>
      <p className="text-neutral-600">You are <b>{membership.role}</b> in this org.</p>
    </div>
  );
}
