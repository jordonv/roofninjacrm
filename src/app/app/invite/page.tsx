import { createSupabaseServerComponent } from '@lib/supabase';

export default async function InvitePage() {
  const supabase = createSupabaseServerComponent();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id, role, organizations!inner(id,name)')
    .eq('user_id', user!.id)
    .maybeSingle();

  if (!membership || !['owner','manager'].includes(membership.role)) {
    return <p>Only managers can invite teammates.</p>;
  }

  return (
    <form action="/app/invite/send" method="post" className="grid gap-3 max-w-sm">
      <h1 className="text-2xl font-semibold">Invite teammate</h1>
      <input type="hidden" name="org_id" value={membership.org_id} />
      <input className="border rounded px-3 py-2" name="email" type="email" required placeholder="person@example.com" />
      <select className="border rounded px-3 py-2" name="role" defaultValue="tech">
        <option value="tech">Tech</option>
        <option value="manager">Manager</option>
      </select>
      <button className="px-4 py-2 rounded bg-black text-white">Send invite</button>
    </form>
  );
}
