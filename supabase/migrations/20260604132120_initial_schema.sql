-- ============================================================
-- HELPER: updated_at auto-trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- TABLES
-- ============================================================

create table public.properties (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name_pl         text not null,
  name_en         text not null,
  description_pl  text,
  description_en  text,
  max_guests      integer not null default 2,
  min_nights      integer not null default 1,
  check_in_time   text not null default '15:00',
  check_out_time  text not null default '11:00',
  cover_image     text,
  active          boolean not null default true,
  contact_email   text not null,
  created_at      timestamptz not null default now()
);

-- stripe_secret_key ideally stored in Supabase Vault in production
create table public.property_settings (
  property_id            uuid primary key references public.properties(id) on delete cascade,
  deposit_percent        integer check (deposit_percent between 1 and 99),
  stripe_publishable_key text,
  stripe_secret_key      text
);

create table public.pricing_rules (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  label_pl        text not null,
  label_en        text not null,
  price_per_night numeric(10,2) not null check (price_per_night > 0),
  valid_from      date,
  valid_to        date,
  days_of_week    integer[],
  priority        integer not null default 0,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  constraint valid_date_range check (valid_from is null or valid_to is null or valid_from <= valid_to)
);

create table public.ical_feeds (
  id             uuid primary key default gen_random_uuid(),
  property_id    uuid not null references public.properties(id) on delete cascade,
  url            text not null,
  source_name    text not null,
  last_synced_at timestamptz,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create table public.external_bookings (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  start_date   date not null,
  end_date     date not null,
  source       text not null,
  external_uid text,
  synced_at    timestamptz not null default now(),
  constraint no_duplicate_uid unique (property_id, external_uid)
);

create table public.reservations (
  id                       uuid primary key default gen_random_uuid(),
  property_id              uuid not null references public.properties(id) on delete cascade,
  guest_name               text not null,
  guest_email              text not null,
  guest_phone              text not null,
  guest_count              integer not null check (guest_count >= 1),
  notes                    text,
  check_in                 date not null,
  check_out                date not null,
  total_nights             integer not null check (total_nights >= 1),
  total_price              numeric(10,2) not null check (total_price > 0),
  deposit_amount           numeric(10,2) check (deposit_amount > 0),
  status                   text not null default 'pending'
                             check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_payment_intent_id text,
  language                 text not null default 'pl' check (language in ('pl', 'en')),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  constraint check_out_after_check_in check (check_out > check_in)
);

create trigger reservations_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index on public.reservations (property_id, check_in, check_out);
create index on public.reservations (status);
create index on public.external_bookings (property_id, start_date, end_date);
create index on public.pricing_rules (property_id, valid_from, valid_to, priority desc);

-- ============================================================
-- RLS
-- ============================================================

alter table public.properties        enable row level security;
alter table public.property_settings enable row level security;
alter table public.pricing_rules     enable row level security;
alter table public.ical_feeds        enable row level security;
alter table public.external_bookings enable row level security;
alter table public.reservations      enable row level security;

-- properties: public read active, admin full access
create policy "properties_public_read"
  on public.properties for select
  using (active = true);

create policy "properties_admin_all"
  on public.properties for all
  using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- property_settings: admin only (contains Stripe keys)
create policy "property_settings_admin_all"
  on public.property_settings for all
  using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- pricing_rules: public read active, admin full access
create policy "pricing_rules_public_read"
  on public.pricing_rules for select
  using (active = true);

create policy "pricing_rules_admin_all"
  on public.pricing_rules for all
  using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- ical_feeds: admin only
create policy "ical_feeds_admin_all"
  on public.ical_feeds for all
  using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- external_bookings: public read (availability calendar), no write from client
create policy "external_bookings_public_read"
  on public.external_bookings for select
  using (true);

-- reservations: anon insert (booking flow), admin full access
create policy "reservations_anon_insert"
  on public.reservations for insert
  with check (status = 'pending');

create policy "reservations_admin_all"
  on public.reservations for all
  using ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- ============================================================
-- GRANT DATA API ACCESS (required since 2026-04-28)
-- ============================================================

grant select on public.properties        to anon, authenticated;
grant select on public.pricing_rules     to anon, authenticated;
grant select on public.external_bookings to anon, authenticated;
grant insert on public.reservations      to anon;
grant all    on public.reservations      to authenticated;
grant all    on public.properties        to authenticated;
grant all    on public.property_settings to authenticated;
grant all    on public.pricing_rules     to authenticated;
grant all    on public.ical_feeds        to authenticated;
grant all    on public.external_bookings to authenticated;
