export interface LocalizedText {
  pl: string
  en: string
}

export interface CottagePhoto {
  src: string
  alt: LocalizedText
  wide?: boolean
}

export interface CottageReview {
  text: LocalizedText
  author: string
  location: string
  month: LocalizedText
}

export interface CottageContent {
  slug: string
  /** Small uppercase line above the hero title — usually the region */
  eyebrow: LocalizedText
  /** One-line emotional hook shown under the hero title */
  tagline: LocalizedText
  heroImage: string
  /** Longer narrative paragraph(s) shown next to the booking widget */
  description: LocalizedText
  amenities: LocalizedText[]
  gallery: CottagePhoto[]
  location: {
    coords: { lat: number; lng: number }
    name: LocalizedText
    description: LocalizedText
    distances: { place: string; dist: string }[]
  }
  bookingScore: string
  bookingReviewCount: number
  reviews: CottageReview[]
}

export function pickText(locale: 'pl' | 'en', text: LocalizedText): string {
  return locale === 'en' ? text.en : text.pl
}

const dunajcaDistances = [
  { place: 'Zakliczyn', dist: '8 km' },
  { place: 'Zamek Wiśnicz', dist: '30 km' },
  { place: 'Kopalnia Soli Bochnia', dist: '39 km' },
  { place: 'Tarnów', dist: '40 km' },
  { place: 'Kraków', dist: '90 km' },
  { place: 'Lotnisko KRK', dist: '93 km' },
]

const zawadaDistances = [
  { place: 'Lanckorona', dist: '5 km' },
  { place: 'Kalwaria Zebrzydowska', dist: '10 km' },
  { place: 'Wadowice', dist: '15 km' },
  { place: 'Kraków', dist: '50 km' },
  { place: 'Zakopane', dist: '80 km' },
  { place: 'Lotnisko KRK', dist: '55 km' },
]

const palesnicaDistances = [
  { place: 'Zakliczyn', dist: '6 km' },
  { place: 'Tuchów', dist: '20 km' },
  { place: 'Tarnów', dist: '30 km' },
  { place: 'Zamek Wiśnicz', dist: '34 km' },
  { place: 'Kraków', dist: '95 km' },
  { place: 'Lotnisko KRK', dist: '98 km' },
]

export const cottages: Record<string, CottageContent> = {
  'domek-nad-dolina': {
    slug: 'domek-nad-dolina',
    eyebrow: { pl: 'Dolina Dunajca · Małopolska', en: 'Dunajca Valley · Małopolska' },
    tagline: {
      pl: 'Budzisz się z kawą i widokiem na rzekę.',
      en: 'You wake up to coffee and a view of the river.',
    },
    heroImage: '/nad-dolina-dunajca/domek-front-dzien.webp',
    description: {
      pl: 'Panoramiczne okna wychodzą prosto na dolinę — od rana do zmierzchu światło zmienia się na ścianach salonu. Cały dom (70 m²) jest do wyłącznej dyspozycji gości: jedna sypialnia z trzema pojedynczymi łóżkami i jednym dużym łóżkiem podwójnym, w pełni wyposażona kuchnia oraz salon z rozkładaną sofą.\n\nNa zewnątrz: balkon, prywatny taras i jacuzzi z widokiem na rzekę i ogród. W cenie pobytu — 2–3 godziny korzystania z sauny.\n\nTo miejsce dla dwojga, które chce ciszy, albo małej grupy do 5–6 osób, z dala od zgiełku, ale 8 km od Zakliczynia.',
      en: 'Floor-to-ceiling windows open straight onto the valley — the light shifts across the living-room walls from morning to dusk. The whole house (70 m²) is yours alone: one bedroom with three single beds and one large double bed, a fully equipped kitchen, and a living room with a sofa bed.\n\nOutside: a balcony, a private terrace and a jacuzzi facing the river and garden. Your stay includes 2–3 hours of sauna access.\n\nIt suits a couple after silence, or a small group of up to 5–6, far from the noise, yet 8 km from Zakliczyn.',
    },
    amenities: [
      { pl: 'Jacuzzi z hydromasażem', en: 'Hydromassage jacuzzi' },
      { pl: 'Sauna fińska (2–3 godz. w cenie pobytu)', en: 'Finnish sauna (2–3 hours included)' },
      { pl: 'Balkon i taras z widokiem na rzekę', en: 'Balcony and terrace facing the river' },
      { pl: 'Widok na ogród', en: 'Garden view' },
      { pl: 'Prywatna łazienka z prysznicem', en: 'Private bathroom with shower' },
      { pl: 'Kuchnia w pełni wyposażona', en: 'Fully equipped kitchen' },
      { pl: 'Telewizor z płaskim ekranem i szybkie WiFi', en: 'Flat-screen TV and fast WiFi' },
      { pl: 'Grill i bezpłatny parking prywatny', en: 'Grill and free private parking' },
    ],
    gallery: [
      { src: '/nad-dolina-dunajca/domek-front-dzien.webp', alt: { pl: 'Domek od frontu w ciągu dnia', en: 'The cottage front in daylight' }, wide: true },
      { src: '/nad-dolina-dunajca/taras-dzien.webp', alt: { pl: 'Taras w ciągu dnia', en: 'The terrace during the day' } },
      { src: '/nad-dolina-dunajca/jacuzzi-dzien.webp', alt: { pl: 'Jacuzzi w ciągu dnia', en: 'The jacuzzi during the day' } },
      { src: '/nad-dolina-dunajca/jadalnia.webp', alt: { pl: 'Jadalnia', en: 'The dining area' }, wide: true },
      { src: '/nad-dolina-dunajca/kuchnia.webp', alt: { pl: 'W pełni wyposażona kuchnia', en: 'The fully equipped kitchen' } },
      { src: '/nad-dolina-dunajca/sypialnia1.webp', alt: { pl: 'Sypialnia', en: 'The bedroom' } },
      { src: '/nad-dolina-dunajca/sypialnia2.webp', alt: { pl: 'Sypialnia, inne ujęcie', en: 'The bedroom, another angle' } },
      { src: '/nad-dolina-dunajca/lazienka1.webp', alt: { pl: 'Łazienka', en: 'The bathroom' } },
      { src: '/nad-dolina-dunajca/lazienka2.webp', alt: { pl: 'Łazienka, inne ujęcie', en: 'The bathroom, another angle' } },
      { src: '/nad-dolina-dunajca/sauna1.webp', alt: { pl: 'Sauna fińska', en: 'The Finnish sauna' }, wide: true },
      { src: '/nad-dolina-dunajca/jadalnia2.webp', alt: { pl: 'Jadalnia, inne ujęcie', en: 'The dining area, another angle' } },
      { src: '/nad-dolina-dunajca/jadalnia3.webp', alt: { pl: 'Jadalnia, widok z boku', en: 'The dining area, side view' } },
      { src: '/nad-dolina-dunajca/domek-blisko-dzien.webp', alt: { pl: 'Domek z bliska w ciągu dnia', en: 'The cottage up close in daylight' } },
      { src: '/nad-dolina-dunajca/domek-ukos-dzien.webp', alt: { pl: 'Domek z ukosa w ciągu dnia', en: 'The cottage at an angle, daytime' } },
      { src: '/nad-dolina-dunajca/domek-bokiem-wieczor.webp', alt: { pl: 'Domek bokiem o zmierzchu', en: 'The cottage from the side at dusk' }, wide: true },
      { src: '/nad-dolina-dunajca/jacuzzi-noc1.webp', alt: { pl: 'Jacuzzi nocą', en: 'The jacuzzi at night' } },
      { src: '/nad-dolina-dunajca/jacuzzi-noc2.webp', alt: { pl: 'Jacuzzi nocą, inne ujęcie', en: 'The jacuzzi at night, another angle' } },
      { src: '/nad-dolina-dunajca/domek-front-noca.webp', alt: { pl: 'Domek od frontu nocą', en: 'The cottage front at night' }, wide: true },
      { src: '/nad-dolina-dunajca/domek-ukos-noc.webp', alt: { pl: 'Domek z ukosa nocą', en: 'The cottage at an angle, at night' } },
      { src: '/nad-dolina-dunajca/dom-daleko-noc.webp', alt: { pl: 'Domek na tle wzgórz nocą', en: 'The cottage against the hills at night' }, wide: true },
    ],
    location: {
      coords: { lat: 49.863, lng: 20.519 },
      name: { pl: 'Dolina Dunajca, Małopolska', en: 'Dunajca Valley, Małopolska' },
      description: {
        pl: 'Domek leży na wzgórzu nad Doliną Dunajca, pod adresem Zawada Lanckorońska 118A, 32-840 Zakliczyn — kilka minut od Zakliczynia. Cisza, zieleń i widok na rzekę — daleko od tras turystycznych, blisko wszystkiego, co warto zobaczyć w Małopolsce.',
        en: 'The cottage sits on a hillside above the Dunajca Valley, at Zawada Lanckorońska 118A, 32-840 Zakliczyn, Poland — minutes from Zakliczyn. Quiet, green, with the river always in view — far from the tourist routes, close to everything worth seeing in Małopolska.',
      },
      distances: dunajcaDistances,
    },
    bookingScore: '9.8',
    bookingReviewCount: 129,
    reviews: [
      {
        text: {
          pl: 'Magiczne miejsce. Widok z okna salonu sprawia, że nie chce się wychodzić. Wrócimy na pewno — może już zimą.',
          en: 'A magical place. The view from the living-room window makes you not want to leave. We will be back — maybe already this winter.',
        },
        author: 'Katarzyna M.',
        location: 'Kraków',
        month: { pl: 'lipiec 2025', en: 'July 2025' },
      },
      {
        text: {
          pl: 'Jacuzzi o zachodzie słońca to było coś, czego nie zapomnimy. Domek czysty, cichy, dokładnie taki jak na zdjęciach.',
          en: 'The jacuzzi at sunset is something we will not forget. The cottage was spotless, quiet, exactly like in the photos.',
        },
        author: 'Paweł i Ania',
        location: 'Warszawa',
        month: { pl: 'grudzień 2025', en: 'December 2025' },
      },
      {
        text: {
          pl: 'Idealne miejsce na reset. Rano kawa na tarasie, wieczorem sauna. Gospodarze odpowiadali błyskawicznie na każdą wiadomość.',
          en: 'The perfect place to reset. Coffee on the terrace in the morning, sauna in the evening. The hosts replied to every message in minutes.',
        },
        author: 'Marta K.',
        location: 'Wrocław',
        month: { pl: 'wrzesień 2025', en: 'September 2025' },
      },
    ],
  },

  'drewniany-domek': {
    slug: 'drewniany-domek',
    eyebrow: { pl: 'Dolina Dunajca · Małopolska', en: 'Dunajca Valley · Małopolska' },
    tagline: {
      pl: 'Ciepło drewna, miejsce dla całej grupy.',
      en: 'The warmth of timber, room for the whole group.',
    },
    heroImage: '/drewniany-nad-dolina-dunajca/domek-front-dzien.webp',
    description: {
      pl: 'Cały drewniany dom (170 m²) jest do wyłącznej dyspozycji gości. Cztery sypialnie — dwie z dużym łóżkiem podwójnym i dwie z dwoma pojedynczymi łóżkami — oraz dwie łazienki dają wygodne miejsce dla 8 osób.\n\nNa zewnątrz: taras i altana z widokiem na ogród i rzekę, a w cenie pobytu 2–3 godziny w jacuzzi i saunie, rezerwowane w prywatnych godzinach tylko dla Was. W środku w pełni wyposażona kuchnia ze zmywarką, szafy w sypialniach i bezpłatne Wi-Fi w całym domu.\n\nTo dobry wybór dla rodziny z dziećmi, czterech par albo grupy przyjaciół, którzy chcą mieć dom tylko dla siebie, z dala od zgiełku — pod adresem Zawada Lanckorońska 101, 8 km od Zakliczynia.',
      en: 'The whole wooden house (170 m²) is yours alone. Four bedrooms — two with a large double bed and two with two single beds — plus two bathrooms make comfortable room for 8 people.\n\nOutside: a terrace and a gazebo facing the garden and the river, and your stay includes 2–3 hours of jacuzzi and sauna access, booked in a private time slot just for you. Inside, a fully equipped kitchen with a dishwasher, wardrobes in the bedrooms, and free Wi-Fi throughout the house.\n\nA great choice for a family with children, four couples, or a group of friends who want a house to themselves, away from the noise — at Zawada Lanckorońska 101, 8 km from Zakliczyn.',
    },
    amenities: [
      { pl: 'Cały dom (170 m²) do wyłącznej dyspozycji', en: 'The whole house (170 m²) for exclusive use' },
      { pl: '4 sypialnie i 2 łazienki dla 8 osób', en: '4 bedrooms and 2 bathrooms for 8 guests' },
      { pl: 'Jacuzzi i sauna (2–3 godz. w prywatnych godzinach)', en: 'Jacuzzi and sauna (2–3 hours, private slot)' },
      { pl: 'W pełni wyposażona kuchnia ze zmywarką', en: 'Fully equipped kitchen with a dishwasher' },
      { pl: 'Widok na ogród i rzekę', en: 'Garden and river view' },
      { pl: 'Szafy w sypialniach', en: 'Wardrobes in the bedrooms' },
      { pl: 'Bezpłatne Wi-Fi', en: 'Free Wi-Fi' },
      { pl: 'Bezpłatny prywatny parking', en: 'Free private parking' },
    ],
    gallery: [
      { src: '/drewniany-nad-dolina-dunajca/domek-front-dzien.webp', alt: { pl: 'Dom od frontu w ciągu dnia', en: 'The house front in daylight' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/domek-ukos-dzien.webp', alt: { pl: 'Dom z ukosa w ciągu dnia', en: 'The house at an angle in daylight' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-bok-dzien.webp', alt: { pl: 'Dom z boku w ciągu dnia', en: 'The house from the side in daylight' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-daleko-dzien.webp', alt: { pl: 'Dom z daleka, na tle wzgórz', en: 'The house seen from a distance, against the hills' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/e6201786-1d92-4bdf-bfe5-a1aaae7703db.webp', alt: { pl: 'Dom wśród zieleni i ogrodu', en: 'The house surrounded by greenery and garden' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/taras-dzien.webp', alt: { pl: 'Taras z widokiem na dolinę', en: 'The terrace with a valley view' } },
      { src: '/drewniany-nad-dolina-dunajca/taras-kwiaty-dzien.webp', alt: { pl: 'Taras z kwiatami w ciągu dnia', en: 'The terrace with flowers in daylight' } },
      { src: '/drewniany-nad-dolina-dunajca/altana-dzien.webp', alt: { pl: 'Zadaszona altana z grillem', en: 'Covered gazebo with a grill' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/jacuzzi1.webp', alt: { pl: 'Jacuzzi z telewizorem', en: 'The jacuzzi with a TV' } },
      { src: '/drewniany-nad-dolina-dunajca/jacuzzi2.webp', alt: { pl: 'Jacuzzi, inne ujęcie', en: 'The jacuzzi, another view' } },
      { src: '/drewniany-nad-dolina-dunajca/salon1.webp', alt: { pl: 'Salon z drewnianymi schodami i kominkiem', en: 'Living room with wooden stairs and fireplace' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/salon2.webp', alt: { pl: 'Salon, inne ujęcie', en: 'Living room, another view' } },
      { src: '/drewniany-nad-dolina-dunajca/salon3.webp', alt: { pl: 'Salon, widok z innej strony', en: 'Living room, viewed from another angle' } },
      { src: '/drewniany-nad-dolina-dunajca/salon-schody.webp', alt: { pl: 'Salon ze schodami na piętro', en: 'Living room with stairs to the upper floor' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/kuchnia.webp', alt: { pl: 'W pełni wyposażona kuchnia', en: 'The fully equipped kitchen' } },
      { src: '/drewniany-nad-dolina-dunajca/kuchnia2.webp', alt: { pl: 'Kuchnia, inne ujęcie', en: 'The kitchen, another view' } },
      { src: '/drewniany-nad-dolina-dunajca/sypialnia1.webp', alt: { pl: 'Sypialnia z łóżkiem podwójnym', en: 'Bedroom with a double bed' } },
      { src: '/drewniany-nad-dolina-dunajca/sypialnia2.webp', alt: { pl: 'Sypialnia z łóżkiem podwójnym', en: 'Bedroom with a double bed' } },
      { src: '/drewniany-nad-dolina-dunajca/sypialnia3.webp', alt: { pl: 'Sypialnia z dwoma łóżkami pojedynczymi', en: 'Bedroom with two single beds' } },
      { src: '/drewniany-nad-dolina-dunajca/sypialnia4.webp', alt: { pl: 'Sypialnia z dwoma łóżkami pojedynczymi', en: 'Bedroom with two single beds' } },
      { src: '/drewniany-nad-dolina-dunajca/taras-noc.webp', alt: { pl: 'Taras wieczorem', en: 'The terrace in the evening' } },
      { src: '/drewniany-nad-dolina-dunajca/jacuzzi-noc1.webp', alt: { pl: 'Jacuzzi wieczorem', en: 'The jacuzzi in the evening' } },
      { src: '/drewniany-nad-dolina-dunajca/jacuzzi-noc2.webp', alt: { pl: 'Jacuzzi wieczorem, inne ujęcie', en: 'The jacuzzi in the evening, another view' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-front-noc.webp', alt: { pl: 'Dom od frontu nocą', en: 'The house front at night' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/domek-bok-noc.webp', alt: { pl: 'Dom z boku nocą', en: 'The house from the side at night' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-ukos-noc.webp', alt: { pl: 'Dom z ukosa nocą', en: 'The house at an angle at night' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-wiosna.webp', alt: { pl: 'Dom wiosną', en: 'The house in spring' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/domek-bok-zima.webp', alt: { pl: 'Dom z boku zimą', en: 'The house from the side in winter' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-ukos-zima.webp', alt: { pl: 'Dom z ukosa zimą', en: 'The house at an angle in winter' } },
      { src: '/drewniany-nad-dolina-dunajca/domek-zima-daleko.webp', alt: { pl: 'Dom zimą, widok z daleka', en: 'The house in winter, seen from a distance' }, wide: true },
    ],
    location: {
      coords: { lat: 49.8636, lng: 20.5205 },
      name: { pl: 'Dolina Dunajca, Małopolska', en: 'Dunajca Valley, Małopolska' },
      description: {
        pl: 'Dom stoi na wzgórzu nad Doliną Dunajca, pod adresem Zawada Lanckorońska 101, 32-840 Zakliczyn — kilka minut od Zakliczynia. Cisza, zieleń i widok na rzekę, a mimo to blisko wszystkiego, co warto zobaczyć w Małopolsce.',
        en: 'The house stands on a hillside above the Dunajca Valley, at Zawada Lanckorońska 101, 32-840 Zakliczyn, Poland — minutes from Zakliczyn. Quiet, green, with the river in view, yet close to everything worth seeing in Małopolska.',
      },
      distances: dunajcaDistances,
    },
    bookingScore: '9.7',
    bookingReviewCount: 78,
    reviews: [
      {
        text: {
          pl: 'Domek pachnie świeżym drewnem, a kominek robi robotę każdego wieczoru. Sauna po całym dniu na szlaku to było coś.',
          en: 'The cottage smells of fresh timber and the fireplace earns its keep every evening. The sauna after a day on the trail was something else.',
        },
        author: 'Tomek W.',
        location: 'Poznań',
        month: { pl: 'październik 2025', en: 'October 2025' },
      },
      {
        text: {
          pl: 'Cztery sypialnie to był strzał w dziesiątkę dla naszych dwóch rodzin. Każdy miał swoją przestrzeń, a wieczorami spotykaliśmy się przy ognisku.',
          en: 'Four bedrooms was exactly right for our two families. Everyone had their own space, and we met by the fire in the evenings.',
        },
        author: 'Rodzina Nowaków',
        location: 'Gdańsk',
        month: { pl: 'sierpień 2025', en: 'August 2025' },
      },
      {
        text: {
          pl: 'Wszystko dokładnie umówione, klucze, wskazówki, kontakt — zero stresu. A widok z jacuzzi wynagradza każdą długą podróż.',
          en: 'Everything was arranged precisely — keys, directions, contact, zero stress. And the view from the jacuzzi makes up for any long drive.',
        },
        author: 'Joanna i Marcin',
        location: 'Łódź',
        month: { pl: 'czerwiec 2025', en: 'June 2025' },
      },
    ],
  },

  'dom-w-zawadzie-a': {
    slug: 'dom-w-zawadzie-a',
    eyebrow: { pl: 'Zawada Lanckorońska · Małopolska', en: 'Zawada Lanckorońska · Małopolska' },
    tagline: {
      pl: 'Własne wejście, własne tempo — dla czterech.',
      en: 'Your own entrance, your own pace — for four.',
    },
    heroImage: '/zawada-lancronska/domek1.webp',
    description: {
      pl: 'Spokojny wariant domu w Zawadzie, pomyślany dla czterech osób, które chcą mieć wszystko, czego potrzebują, i nic więcej. Własne wejście, pełna kuchnia i ogród, w którym poranna kawa smakuje inaczej.\n\nTo dom dla par, które jadą we dwie, albo rodziny z jednym dzieckiem — bez kompromisów co do wygody, za to z całą ciszą Zawady w zasięgu ręki.',
      en: 'A calmer variant of the Zawada house, designed for four people who want everything they need and nothing more. A private entrance, a full kitchen, and a garden where morning coffee tastes different.\n\nIt suits two couples travelling together, or a family with one child — no compromise on comfort, with all of Zawada’s quiet within reach.',
    },
    amenities: [
      { pl: 'Własne wejście i prywatność', en: 'Private entrance and privacy' },
      { pl: 'Pełna, w pełni wyposażona kuchnia', en: 'Full, fully equipped kitchen' },
      { pl: 'Ogród z miejscem na wypoczynek', en: 'Garden with space to unwind' },
      { pl: 'Dwie sypialnie', en: 'Two bedrooms' },
      { pl: 'Smart TV i szybkie WiFi', en: 'Smart TV and fast WiFi' },
      { pl: 'Pralka i suszarka', en: 'Washing machine and dryer' },
      { pl: 'Bezpłatny parking na miejscu', en: 'Free on-site parking' },
      { pl: 'Pościel, ręczniki, kosmetyki', en: 'Linens, towels, toiletries' },
    ],
    gallery: [
      { src: '/zawada-lancronska/domek1.webp', alt: { pl: 'Dom w Zawadzie z zewnątrz', en: 'The Zawada house from outside' }, wide: true },
      { src: '/zawada-lancronska/sypialnia1.jpeg', alt: { pl: 'Sypialnia główna', en: 'Main bedroom' } },
      { src: '/zawada-lancronska/kuchnia.webp', alt: { pl: 'Pełna kuchnia', en: 'Full kitchen' } },
      { src: '/zawada-lancronska/jadalnia.jpeg', alt: { pl: 'Jadalnia', en: 'Dining area' }, wide: true },
      { src: '/zawada-lancronska/lazienka.webp', alt: { pl: 'Łazienka', en: 'Bathroom' } },
      { src: '/zawada-lancronska/sypialnia3.webp', alt: { pl: 'Druga sypialnia', en: 'Second bedroom' } },
      { src: '/zawada-lancronska/jadalnia2.webp', alt: { pl: 'Jadalnia z innej strony', en: 'Dining area, another angle' }, wide: true },
      { src: '/zawada-lancronska/domek2.webp', alt: { pl: 'Ogród przy domu', en: 'The garden by the house' } },
    ],
    location: {
      coords: { lat: 49.855, lng: 19.745 },
      name: { pl: 'Zawada Lanckorońska, Małopolska', en: 'Zawada Lanckorońska, Małopolska' },
      description: {
        pl: 'Zawada Lanckorońska leży w spokojnej części Małopolski, blisko Lanckorony i Kalwarii Zebrzydowskiej. Idealny punkt wypadowy w Beskid Mały i okolice Krakowa — a wieczorem znów cisza i własny ogród.',
        en: 'Zawada Lanckorońska sits in a quiet part of Małopolska, close to Lanckorona and Kalwaria Zebrzydowska. A great base for exploring the Beskid Mały range and the Kraków area — and in the evening, quiet and your own garden again.',
      },
      distances: zawadaDistances,
    },
    bookingScore: '9.7',
    bookingReviewCount: 36,
    reviews: [
      {
        text: {
          pl: 'Dom dokładnie tak przytulny, jak wyglądał na zdjęciach. Własne wejście dało nam pełne poczucie prywatności.',
          en: 'The house was just as cosy as it looked in the photos. The private entrance gave us a real sense of privacy.',
        },
        author: 'Agnieszka P.',
        location: 'Katowice',
        month: { pl: 'maj 2025', en: 'May 2025' },
      },
      {
        text: {
          pl: 'Ogród i kuchnia w pełni wyposażona — ugotowaliśmy sobie sami obiad pierwszy raz od miesięcy bez pośpiechu.',
          en: 'The garden and the fully equipped kitchen — we cooked our own dinner for the first time in months, without rushing.',
        },
        author: 'Bartek i Kasia',
        location: 'Bielsko-Biała',
        month: { pl: 'wrzesień 2025', en: 'September 2025' },
      },
      {
        text: {
          pl: 'Blisko Lanckorony, a jednocześnie totalna cisza wieczorem. Wrócimy z pewnością, tym razem na dłużej.',
          en: 'Close to Lanckorona, yet completely quiet in the evenings. We will be back for sure, this time for longer.',
        },
        author: 'Ula W.',
        location: 'Kraków',
        month: { pl: 'lipiec 2025', en: 'July 2025' },
      },
    ],
  },

  'dom-w-zawadzie-b': {
    slug: 'dom-w-zawadzie-b',
    eyebrow: { pl: 'Zawada Lanckorońska · Małopolska', en: 'Zawada Lanckorońska · Małopolska' },
    tagline: {
      pl: 'Więcej przestrzeni, ta sama spokojność.',
      en: 'More room, the same calm.',
    },
    heroImage: '/zawada-lancronska/sypialnia2.webp',
    description: {
      pl: 'Większy wariant domu w Zawadzie — trzy sypialnie, własne wejście i ten sam ogród, w którym czas płynie wolniej. Dobry wybór dla rodziny z dziećmi albo dwóch par, które chcą mieć osobne kąty, ale wspólny stół na wieczór.\n\nWszystko, co w mniejszym wariancie, plus jedna sypialnia więcej — żeby nikt nie musiał spać na rozkładanej kanapie.',
      en: 'The larger variant of the Zawada house — three bedrooms, a private entrance, and the same garden where time slows down. A good fit for a family with children, or two couples who want separate corners but one table for the evening.\n\nEverything the smaller variant offers, plus one more bedroom — so no one has to sleep on a fold-out couch.',
    },
    amenities: [
      { pl: 'Trzy sypialnie', en: 'Three bedrooms' },
      { pl: 'Własne wejście i prywatność', en: 'Private entrance and privacy' },
      { pl: 'Pełna, w pełni wyposażona kuchnia', en: 'Full, fully equipped kitchen' },
      { pl: 'Ogród z miejscem na wypoczynek', en: 'Garden with space to unwind' },
      { pl: 'Smart TV i szybkie WiFi', en: 'Smart TV and fast WiFi' },
      { pl: 'Pralka i suszarka', en: 'Washing machine and dryer' },
      { pl: 'Bezpłatny parking na miejscu', en: 'Free on-site parking' },
      { pl: 'Pościel, ręczniki, kosmetyki', en: 'Linens, towels, toiletries' },
    ],
    gallery: [
      { src: '/zawada-lancronska/sypialnia2.webp', alt: { pl: 'Główna sypialnia', en: 'Main bedroom' }, wide: true },
      { src: '/zawada-lancronska/domek2.webp', alt: { pl: 'Dom w Zawadzie z ogrodu', en: 'The Zawada house from the garden' } },
      { src: '/zawada-lancronska/sypialnia3.webp', alt: { pl: 'Druga sypialnia', en: 'Second bedroom' } },
      { src: '/zawada-lancronska/kuchnia.webp', alt: { pl: 'Pełna kuchnia', en: 'Full kitchen' }, wide: true },
      { src: '/zawada-lancronska/sypialnia1.jpeg', alt: { pl: 'Trzecia sypialnia', en: 'Third bedroom' } },
      { src: '/zawada-lancronska/jadalnia2.webp', alt: { pl: 'Jadalnia', en: 'Dining area' } },
      { src: '/zawada-lancronska/lazienka.webp', alt: { pl: 'Łazienka', en: 'Bathroom' }, wide: true },
      { src: '/zawada-lancronska/jadalnia.jpeg', alt: { pl: 'Wspólny stół na wieczór', en: 'The shared table for the evening' } },
    ],
    location: {
      coords: { lat: 49.8552, lng: 19.7455 },
      name: { pl: 'Zawada Lanckorońska, Małopolska', en: 'Zawada Lanckorońska, Małopolska' },
      description: {
        pl: 'Ten sam spokojny zakątek Małopolski co mniejszy wariant — blisko Lanckorony i Kalwarii Zebrzydowskiej, z łatwym dojazdem w Beskid Mały i do Krakowa.',
        en: 'The same quiet corner of Małopolska as the smaller variant — close to Lanckorona and Kalwaria Zebrzydowska, with easy access to the Beskid Mały range and Kraków.',
      },
      distances: zawadaDistances,
    },
    bookingScore: '9.7',
    bookingReviewCount: 36,
    reviews: [
      {
        text: {
          pl: 'Pojechaliśmy w 6 osób — dwie rodziny. Trzy sypialnie zrobiły różnicę, każdy miał swój kąt, a wieczory spędzaliśmy razem w ogrodzie.',
          en: 'We went as six — two families. Three bedrooms made the difference: everyone had their own corner, and we spent evenings together in the garden.',
        },
        author: 'Rodzina Wiśniewskich',
        location: 'Rzeszów',
        month: { pl: 'sierpień 2025', en: 'August 2025' },
      },
      {
        text: {
          pl: 'Dom przestronny i naprawdę cichy. Dzieci miały gdzie się wyszaleć w ogrodzie, my odpoczęliśmy pierwszy raz od dawna.',
          en: 'Spacious and genuinely quiet. The kids had room to run wild in the garden, and we finally got to rest.',
        },
        author: 'Ola i Grzegorz',
        location: 'Kielce',
        month: { pl: 'czerwiec 2025', en: 'June 2025' },
      },
      {
        text: {
          pl: 'Wszystko dopięte na ostatni guzik — od komunikacji po wyposażenie kuchni. Wrócimy z pewnością w większym gronie.',
          en: 'Everything was sorted down to the last detail — from communication to the kitchen equipment. We will be back with an even bigger group.',
        },
        author: 'Krzysztof L.',
        location: 'Lublin',
        month: { pl: 'październik 2025', en: 'October 2025' },
      },
    ],
  },

  'dom-na-wzgorzu': {
    slug: 'dom-na-wzgorzu',
    eyebrow: { pl: 'Paleśnica · Małopolska', en: 'Paleśnica · Małopolska' },
    tagline: {
      pl: 'Najwięcej miejsca, najwięcej ciszy.',
      en: 'The most room, the most quiet.',
    },
    heroImage: '/domek-borowkowe-wzgorze/domek-front-dzien.webp',
    description: {
      pl: 'Dom o powierzchni 100 m², w całości do dyspozycji gości — dla maksymalnie 6 osób. Dwie sypialnie (jedna z dużym łóżkiem podwójnym, druga z czterema pojedynczymi łóżkami), przestronny salon z rozkładaną sofą i w pełni wyposażona kuchnia ze zmywarką czekają po długiej podróży. Balkon z widokiem na ogród, miejsce do grillowania i bezpłatny prywatny parking dopełniają komfortu.\n\nDom stoi w spokojnej okolicy Paleśnicy i cieszy się bardzo dobrymi opiniami gości. Na życzenie, za dodatkową opłatą, można skorzystać z balii ogrodowej.',
      en: 'A 100 m² house, entirely at your disposal — for up to 6 guests. Two bedrooms (one with a large double bed, the other with four single beds), a spacious living room with a sofa bed, and a fully equipped kitchen with a dishwasher are waiting after a long journey. A balcony overlooking the garden, a barbecue spot, and free private parking complete the comfort.\n\nThe house stands in a quiet part of Paleśnica and enjoys excellent guest reviews. A garden hot tub is available on request for an additional fee.',
    },
    amenities: [
      { pl: 'Cały dom na wyłączność', en: 'The whole house for your exclusive use' },
      { pl: 'Dwie sypialnie — łóżko podwójne i cztery pojedyncze', en: 'Two bedrooms — one double bed and four single beds' },
      { pl: 'Balia ogrodowa (dodatkowo płatna)', en: 'Garden hot tub (extra charge)' },
      { pl: 'Salon z rozkładaną sofą', en: 'Living room with a sofa bed' },
      { pl: 'W pełni wyposażona kuchnia ze zmywarką', en: 'Fully equipped kitchen with a dishwasher' },
      { pl: 'Bezpłatne Wi-Fi i telewizor z płaskim ekranem', en: 'Free Wi-Fi and a flat-screen TV' },
      { pl: 'Balkon z widokiem na ogród', en: 'Balcony overlooking the garden' },
      { pl: 'Miejsce do grillowania', en: 'Barbecue area' },
      { pl: 'Bezpłatny prywatny parking', en: 'Free private parking' },
    ],
    gallery: [
      { src: '/domek-borowkowe-wzgorze/domek-front-dzien.webp', alt: { pl: 'Dom na Borówkowym Wzgórzu od frontu', en: 'The house on Borówkowe Wzgórze from the front' }, wide: true },
      { src: '/domek-borowkowe-wzgorze/salon1.webp', alt: { pl: 'Salon z rozkładaną sofą', en: 'Living room with a sofa bed' } },
      { src: '/domek-borowkowe-wzgorze/kuchnia1.webp', alt: { pl: 'W pełni wyposażona kuchnia', en: 'Fully equipped kitchen' } },
      { src: '/domek-borowkowe-wzgorze/sypialnia2.webp', alt: { pl: 'Sypialnia z dużym łóżkiem podwójnym', en: 'Bedroom with a large double bed' }, wide: true },
      { src: '/domek-borowkowe-wzgorze/sypialnia-dwa-lozka.webp', alt: { pl: 'Sypialnia z czterema pojedynczymi łóżkami', en: 'Bedroom with four single beds' } },
      { src: '/domek-borowkowe-wzgorze/jadalnia1.webp', alt: { pl: 'Jadalnia', en: 'Dining area' } },
      { src: '/domek-borowkowe-wzgorze/lazienka.webp', alt: { pl: 'Łazienka z prysznicem', en: 'Bathroom with a shower' } },
      { src: '/domek-borowkowe-wzgorze/balia2.webp', alt: { pl: 'Balia ogrodowa wieczorem', en: 'Garden hot tub in the evening' }, wide: true },
      { src: '/domek-borowkowe-wzgorze/domek-bok-dzien.webp', alt: { pl: 'Ogród z placem zabaw', en: 'Garden with a playground' } },
    ],
    location: {
      coords: { lat: 49.83, lng: 20.62 },
      name: { pl: 'Paleśnica, Małopolska', en: 'Paleśnica, Małopolska' },
      description: {
        pl: 'Dom znajduje się przy ul. Olszowej 171 w Paleśnicy — niewielkiej wsi w Beskidzie Wyspowym, kilka kilometrów od Zakliczynia. Stoi na uboczu, otoczony lasem i łąkami — totalna cisza, a mimo to blisko atrakcji Doliny Dunajca.',
        en: 'The house is located at Olszowa 171 in Paleśnica — a small village in the Beskid Wyspowy range, a few kilometres from Zakliczyn. It stands apart, surrounded by forest and meadows — total quiet, yet close to everything the Dunajca Valley has to offer.',
      },
      distances: palesnicaDistances,
    },
    bookingScore: '10.0',
    bookingReviewCount: 31,
    reviews: [
      {
        text: {
          pl: 'Przyjechaliśmy z całą rodziną — 6 osób, wszyscy zachwyceni. Dzieci bawiły się na placu zabaw, my odpoczywaliśmy w altanie. Nic więcej nie potrzeba.',
          en: 'We came as a whole family — six of us, everyone delighted. The kids played on the playground, we relaxed in the gazebo. Nothing more was needed.',
        },
        author: 'Rodzina Kowalskich',
        location: 'Wrocław',
        month: { pl: 'sierpień 2025', en: 'August 2025' },
      },
      {
        text: {
          pl: 'Najciszej jak dotąd było. Ogrodzony teren dał nam spokój — dzieci mogły biegać same, a my pierwszy raz od dawna usiedliśmy bez pilnowania.',
          en: 'The quietest place we have stayed yet. The fenced grounds gave us peace of mind — the kids could run free, and for once we sat down without watching them every second.',
        },
        author: 'Ewa i Robert',
        location: 'Poznań',
        month: { pl: 'lipiec 2025', en: 'July 2025' },
      },
      {
        text: {
          pl: 'Grill w altanie i wieczory pod gwiazdami — to jest dokładnie to, czego szukaliśmy z dala od miasta. Wrócimy na pewno.',
          en: 'The grill in the gazebo, evenings under the stars — exactly what we were looking for, far from the city. We will be back for sure.',
        },
        author: 'Damian S.',
        location: 'Kraków',
        month: { pl: 'maj 2025', en: 'May 2025' },
      },
    ],
  },
}

export function getCottageContent(slug: string): CottageContent | null {
  return cottages[slug] ?? null
}
