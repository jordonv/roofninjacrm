alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.audit_logs enable row level security;
alter table public.billing_customers enable row level security;
alter table public.billing_subscriptions enable row level security;

create or replace function public.uid() returns uuid
language sql stable as $$ select auth.uid() $$;

create policy "read own profile"
on public.profiles for select
using (id = public.uid());

create policy "update own profile"
on public.profiles for update
using (id = public.uid());

create policy "org member can select"
on public.organizations for select
using (exists (select 1 from public.memberships m where m.org_id = organizations.id and m.user_id = public.uid()));

create policy "select memberships in orgs I belong to"
on public.memberships for select
using (exists (select 1 from public.memberships m where m.org_id = memberships.org_id and m.user_id = public.uid()));

create policy "select invites for my org"
on public.invites for select
using (exists (select 1 from public.memberships m where m.org_id = invites.org_id and m.user_id = public.uid()));

create policy "insert invites (manager+)"
on public.invites for insert
with check (
  exists (select 1 from public.memberships m where m.org_id = org_id and m.user_id = public.uid() and m.role in ('owner','manager'))
);

create policy "read audit logs in my org"
on public.audit_logs for select
using (exists (select 1 from public.memberships m where m.org_id = audit_logs.org_id and m.user_id = public.uid()));

create policy "read billing for my org"
on public.billing_customers for select
using (exists (select 1 from public.memberships m where m.org_id = billing_customers.org_id and m.user_id = public.uid()));

create policy "read billing subs for my org"
on public.billing_subscriptions for select
using (exists (select 1 from public.memberships m where m.org_id = billing_subscriptions.org_id and m.user_id = public.uid()));
