-- ============================================================
-- Update "Domek nad Doliną" listing with details and pricing
-- supplied by the owner (2026-06-11): 70 m², 1 bedroom (3 single
-- beds + 1 double bed), living room sofa bed, up to 5-6 guests,
-- jacuzzi, sauna (2-3h included), 500 zl/night base rate.
-- ============================================================

update public.properties
set
  description_pl = 'Cały dom (70 m²) do wyłącznej dyspozycji gości. Jedna sypialnia z trzema pojedynczymi łóżkami i jednym dużym łóżkiem podwójnym, salon z rozkładaną sofą, w pełni wyposażona kuchnia. Balkon i taras z widokiem na rzekę i ogród, jacuzzi z hydromasażem. W cenie pobytu 2-3 godziny korzystania z sauny. Do 5-6 osób.',
  description_en = 'The whole house (70 sqm) for the exclusive use of guests. One bedroom with three single beds and one large double bed, a living room with a sofa bed, and a fully equipped kitchen. Balcony and terrace facing the river and garden, hydromassage jacuzzi. Stay includes 2-3 hours of sauna access. Up to 5-6 guests.',
  cover_image = '/nad-dolina-dunajca/domek-front-dzien.webp'
where slug = 'domek-nad-dolina';

update public.pricing_rules
set price_per_night = 500
where property_id = 'b1a10000-0000-0000-0000-000000000001'
  and label_pl = 'Cena bazowa';
