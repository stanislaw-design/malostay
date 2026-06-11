-- ============================================================
-- Update "Drewniany Domek" listing with details supplied by the
-- owner (2026-06-11): 170 m², 4 bedrooms (2 double beds + 4 single
-- beds), 2 bathrooms, up to 8 guests, dishwasher, wardrobes,
-- new address Zawada Lanckorońska 101.
-- ============================================================

update public.properties
set
  description_pl = 'Cały dom (170 m²) do wyłącznej dyspozycji gości. Cztery sypialnie — dwie z dużym łóżkiem podwójnym i dwie z dwoma pojedynczymi łóżkami — oraz dwie łazienki. W pełni wyposażona kuchnia ze zmywarką, szafy w sypialniach, bezpłatne Wi-Fi. Taras i altana z widokiem na ogród i rzekę, jacuzzi i sauna (2-3 godziny w cenie pobytu). Do 8 osób.',
  description_en = 'The whole house (170 sqm) for the exclusive use of guests. Four bedrooms — two with a large double bed and two with two single beds — plus two bathrooms. Fully equipped kitchen with a dishwasher, wardrobes in the bedrooms, free Wi-Fi. Terrace and gazebo facing the garden and river, jacuzzi and sauna (2-3 hours included). Up to 8 guests.',
  max_guests = 8,
  cover_image = '/drewniany-nad-dolina-dunajca/domek-front-dzien.webp'
where slug = 'drewniany-domek';
