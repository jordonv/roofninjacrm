create or replace function public.create_org_with_owner(org_name text, owner_id uuid)
returns public.organizations
language plpgsql
security definer
as $$
declare new_org public.organizations;
begin
  insert into public.organizations (name) values (org_name) returning * into new_org;
  insert into public.memberships (org_id, user_id, role) values (new_org.id, owner_id, 'owner');
  return new_org;
end;
$$;
