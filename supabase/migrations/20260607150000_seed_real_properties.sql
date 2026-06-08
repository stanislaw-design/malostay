-- ============================================================
-- Real cottages — replaces template/mock content from cottages-data.ts
-- Contact email and prices are placeholders; owner should confirm
-- real values (deposit %, pricing, contact address) before launch.
-- ============================================================

insert into public.properties
  (id, slug, name_pl, name_en, description_pl, description_en, max_guests, min_nights, check_in_time, check_out_time, cover_image, active, contact_email)
values
  ('b1a10000-0000-0000-0000-000000000001', 'domek-nad-dolina',
   'Domek nad Doliną', 'Cottage by the Valley',
   'Panoramiczne okna, jacuzzi i sauna nad Doliną Dunajca. Do 6 osób.',
   'Floor-to-ceiling windows, a jacuzzi and a sauna above the Dunajca Valley. Up to 6 guests.',
   6, 2, '15:00', '11:00', '/nad-dolina-dunajca/domek-blisko.webp', true, 'kontakt@malostay.pl'),

  ('b1a10000-0000-0000-0000-000000000002', 'drewniany-domek',
   'Drewniany Domek', 'The Wooden Cottage',
   'Surowe drewno, dwie sypialnie, kominek, sauna i jacuzzi — ten sam widok na dolinę. Do 6 osób.',
   'Raw timber, two bedrooms, a fireplace, sauna and jacuzzi — the same valley view. Up to 6 guests.',
   6, 2, '15:00', '11:00', '/drewniany-nad-dolina-dunajca/domek.webp', true, 'kontakt@malostay.pl'),

  ('b1a10000-0000-0000-0000-000000000003', 'dom-w-zawadzie-a',
   'Dom w Zawadzie A', 'House in Zawada A',
   'Spokojny wariant domu w Zawadzie z własnym wejściem i ogrodem. Dla czterech osób.',
   'A calmer variant of the Zawada house with a private entrance and garden. For four guests.',
   4, 2, '15:00', '11:00', '/zawada-lancronska/domek1.webp', true, 'kontakt@malostay.pl'),

  ('b1a10000-0000-0000-0000-000000000004', 'dom-w-zawadzie-b',
   'Dom w Zawadzie B', 'House in Zawada B',
   'Większy wariant domu w Zawadzie — trzy sypialnie i ten sam ogród. Do 6 osób.',
   'The larger Zawada house — three bedrooms and the same garden. Up to 6 guests.',
   6, 2, '15:00', '11:00', '/zawada-lancronska/sypialnia2.webp', true, 'kontakt@malostay.pl'),

  ('b1a10000-0000-0000-0000-000000000005', 'dom-na-wzgorzu',
   'Dom na Wzgórzu', 'House on the Hill',
   'Największy z domków — dwie sypialnie, ogrodzony teren i plac zabaw w Paleśnicy. Do 8 osób.',
   'The largest cottage — two bedrooms, a fenced plot and a playground in Paleśnica. Up to 8 guests.',
   8, 2, '15:00', '11:00', '/zawada-lancronska/domek2.webp', true, 'kontakt@malostay.pl');

insert into public.property_settings (property_id, deposit_percent) values
  ('b1a10000-0000-0000-0000-000000000001', 30),
  ('b1a10000-0000-0000-0000-000000000002', 30),
  ('b1a10000-0000-0000-0000-000000000003', 30),
  ('b1a10000-0000-0000-0000-000000000004', 30),
  ('b1a10000-0000-0000-0000-000000000005', 30);

-- Placeholder base rates (PLN/night) — owner should review before launch.
insert into public.pricing_rules (property_id, label_pl, label_en, price_per_night, priority, active) values
  ('b1a10000-0000-0000-0000-000000000001', 'Cena bazowa', 'Base rate', 590, 0, true),
  ('b1a10000-0000-0000-0000-000000000002', 'Cena bazowa', 'Base rate', 550, 0, true),
  ('b1a10000-0000-0000-0000-000000000003', 'Cena bazowa', 'Base rate', 420, 0, true),
  ('b1a10000-0000-0000-0000-000000000004', 'Cena bazowa', 'Base rate', 520, 0, true),
  ('b1a10000-0000-0000-0000-000000000005', 'Cena bazowa', 'Base rate', 650, 0, true);
