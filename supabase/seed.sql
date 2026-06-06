-- =============================================================
-- SEED — dane testowe do lokalnego developmentu
-- Uruchom: supabase db reset  (resetuje bazę i aplikuje seed)
-- =============================================================

-- Property
insert into public.properties (
  id,
  slug,
  name_pl,
  name_en,
  description_pl,
  description_en,
  max_guests,
  min_nights,
  check_in_time,
  check_out_time,
  cover_image,
  active,
  contact_email
) values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'domek-lanckorona',
  'Domek w Lanckoronie',
  'Cottage in Lanckorona',
  'Przytulny domek z widokiem na Tatry w historycznej Lanckoronie. Idealne miejsce na odpoczynek dla rodzin i par.',
  'A cozy cottage with a view of the Tatras in historic Lanckorona. Perfect for families and couples.',
  6,
  2,
  '15:00',
  '11:00',
  null,
  true,
  'kontakt@domek-lanckorona.pl'
);

-- Property settings (zadatek 30%)
insert into public.property_settings (
  property_id,
  deposit_percent
) values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  30
);

-- Pricing rules
insert into public.pricing_rules (
  property_id,
  label_pl,
  label_en,
  price_per_night,
  valid_from,
  valid_to,
  days_of_week,
  priority,
  active
) values
  -- Cena sezonowa (lipiec–sierpień) — najwyższy priorytet
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Sezon letni',
    'Summer season',
    550.00,
    '2026-07-01',
    '2026-08-31',
    null,
    20,
    true
  ),
  -- Weekendy (piątek + sobota) — priorytet 10
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Weekend',
    'Weekend',
    500.00,
    null,
    null,
    '{5,6}',
    10,
    true
  ),
  -- Cena bazowa — najniższy priorytet, zawsze aktywna
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Cena standardowa',
    'Standard price',
    450.00,
    null,
    null,
    null,
    0,
    true
  );
