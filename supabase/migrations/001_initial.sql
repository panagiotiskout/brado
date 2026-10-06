-- Brado Training Center — initial schema

create extension if not exists "pgcrypto";

create type public.approval_status as enum ('pending', 'approved', 'rejected');
create type public.user_role as enum ('member', 'admin');
create type public.booking_status as enum ('confirmed', 'cancelled');
create type public.subscription_status as enum ('active', 'expired', 'cancelled');
create type public.payment_method as enum ('cash', 'bank', 'iris', 'stripe', 'other');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text not null default '',
  avatar_path text,
  doctor_doc_path text,
  approval_status public.approval_status not null default 'pending',
  role public.user_role not null default 'member',
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_el text not null,
  name_en text not null,
  price_cents integer not null default 0,
  duration_days integer not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid references public.plans (id) on delete set null,
  starts_on date not null,
  ends_on date not null,
  status public.subscription_status not null default 'active',
  amount_cents integer,
  payment_method public.payment_method,
  notes text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

create index subscriptions_user_status_idx on public.subscriptions (user_id, status);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  starts_at timestamptz not null,
  status public.booking_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index bookings_starts_at_idx on public.bookings (starts_at) where status = 'confirmed';
create index bookings_user_idx on public.bookings (user_id, starts_at);

create table public.closed_days (
  date date primary key,
  reason text
);

create table public.gym_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

insert into public.gym_settings (key, value) values
  ('capacity', '8'::jsonb),
  ('cancel_cutoff_hours', '2'::jsonb),
  ('require_active_subscription', 'true'::jsonb)
on conflict (key) do nothing;

insert into public.plans (slug, name_el, name_en, price_cents, duration_days) values
  ('manual', 'Χειροκίνητο πλάνο', 'Manual plan', 0, 30)
on conflict (slug) do nothing;

-- Profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Booking capacity (30-minute buckets, max 8 concurrent)
create or replace function public.booking_bucket_keys(p_starts_at timestamptz)
returns text[]
language sql
immutable
as $$
  select array[
    to_char(p_starts_at at time zone 'Europe/Athens', 'YYYY-MM-DD"T"HH24:MI'),
    to_char((p_starts_at + interval '30 minutes') at time zone 'Europe/Athens', 'YYYY-MM-DD"T"HH24:MI')
  ];
$$;

create or replace function public.count_bookings_in_bucket(p_bucket text)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.bookings b
  where b.status = 'confirmed'
    and p_bucket = any (public.booking_bucket_keys(b.starts_at));
$$;

create or replace function public.create_booking(p_user_id uuid, p_starts_at timestamptz)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
  v_capacity integer := 8;
  v_buckets text[];
  v_bucket text;
  v_count integer;
  v_booking_id uuid;
  v_has_sub boolean;
  v_require_sub boolean := true;
begin
  select * into v_profile from public.profiles where id = p_user_id;
  if v_profile is null then
    raise exception 'PROFILE_NOT_FOUND';
  end if;
  if v_profile.approval_status <> 'approved' then
    raise exception 'NOT_APPROVED';
  end if;

  select coalesce((value #>> '{}')::integer, 8) into v_capacity
  from public.gym_settings where key = 'capacity';

  select coalesce((value #>> '{}')::boolean, true) into v_require_sub
  from public.gym_settings where key = 'require_active_subscription';

  if v_require_sub then
    select exists (
      select 1 from public.subscriptions s
      where s.user_id = p_user_id
        and s.status = 'active'
        and current_date between s.starts_on and s.ends_on
    ) into v_has_sub;
    if not v_has_sub then
      raise exception 'NO_ACTIVE_SUBSCRIPTION';
    end if;
  end if;

  if exists (
    select 1 from public.bookings b
    where b.user_id = p_user_id
      and b.status = 'confirmed'
      and tstzrange(b.starts_at, b.starts_at + interval '1 hour', '[)') &&
          tstzrange(p_starts_at, p_starts_at + interval '1 hour', '[)')
  ) then
    raise exception 'OVERLAPPING_BOOKING';
  end if;

  v_buckets := public.booking_bucket_keys(p_starts_at);
  foreach v_bucket in array v_buckets loop
    v_count := public.count_bookings_in_bucket(v_bucket);
    if v_count >= v_capacity then
      raise exception 'SLOT_FULL';
    end if;
  end loop;

  insert into public.bookings (user_id, starts_at, status)
  values (p_user_id, p_starts_at, 'confirmed')
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bookings enable row level security;
alter table public.closed_days enable row level security;
alter table public.gym_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Plans: readable by authenticated users
create policy "plans_select_authenticated"
  on public.plans for select
  to authenticated
  using (true);

create policy "plans_admin_all"
  on public.plans for all
  using (public.is_admin());

-- Subscriptions
create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "subscriptions_admin_insert"
  on public.subscriptions for insert
  with check (public.is_admin());

create policy "subscriptions_admin_update"
  on public.subscriptions for update
  using (public.is_admin());

-- Bookings
create policy "bookings_select_own_or_admin"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

create policy "bookings_insert_own"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "bookings_update_own_or_admin"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_admin());

-- Closed days & settings: read all authenticated, write admin
create policy "closed_days_select_auth"
  on public.closed_days for select
  to authenticated
  using (true);

create policy "closed_days_admin"
  on public.closed_days for all
  using (public.is_admin());

create policy "gym_settings_select_auth"
  on public.gym_settings for select
  to authenticated
  using (true);

create policy "gym_settings_admin"
  on public.gym_settings for all
  using (public.is_admin());

-- Storage buckets (run in dashboard or via storage API):
-- avatars: public read
-- medical-docs: private, user folder
