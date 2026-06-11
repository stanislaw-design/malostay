-- Update "Dom na Borówkowym Wzgórzu" with details and price provided by the owner.
update public.properties
set
  description_pl = 'Dom o powierzchni 100 m², w całości do dyspozycji gości — dla maksymalnie 6 osób. Dwie sypialnie (jedna z dużym łóżkiem podwójnym, druga z czterema pojedynczymi łóżkami), salon z rozkładaną sofą i w pełni wyposażona kuchnia ze zmywarką. Balkon z widokiem na ogród, miejsce do grillowania, bezpłatny prywatny parking. Balia ogrodowa dostępna za dodatkową opłatą.',
  description_en = 'A 100 m² house, entirely at your disposal — for up to 6 guests. Two bedrooms (one with a large double bed, the other with four single beds), a living room with a sofa bed and a fully equipped kitchen with a dishwasher. Balcony overlooking the garden, barbecue area, free private parking. A garden hot tub is available for an additional fee.',
  max_guests = 6,
  cover_image = '/domek-borowkowe-wzgorze/domek-front-dzien.webp'
where id = 'b1a10000-0000-0000-0000-000000000005';

update public.pricing_rules
set price_per_night = 350
where property_id = 'b1a10000-0000-0000-0000-000000000005' and label_pl = 'Cena bazowa';
