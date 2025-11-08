create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  created_at timestamptz default now()
);

create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now()
);

create type if not exists public.role as enum ('owner','manager','tech');
create table if not exists public.memberships (
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role public.role not null default 'tech',
  created_at timestamptz default now(),
  primary key (org_id, user_id)
);

create table if not exists public.invites (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  role public.role not null default 'tech',
  token text not null unique,
  accepted boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id bigserial primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists public.billing_customers (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  stripe_customer_id text not null unique
);

create table if not exists public.billing_subscriptions (
  org_id uuid references public.organizations(id) on delete cascade,
  stripe_subscription_id text primary key,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do update set email=excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
