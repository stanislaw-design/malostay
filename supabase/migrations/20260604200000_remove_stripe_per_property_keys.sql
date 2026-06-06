alter table public.property_settings
  drop column if exists stripe_publishable_key,
  drop column if exists stripe_secret_key;
