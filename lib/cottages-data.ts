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
    heroImage: '/nad-dolina-dunajca/domek-blisko.webp',
    description: {
      pl: 'Panoramiczne okna wychodzą prosto na dolinę — od rana do zmierzchu światło zmienia się na ścianach salonu. W środku: jedna duża sypialnia, w pełni wyposażona kuchnia i przestrzeń, która zachęca, żeby zostać dłużej niż planowano. Na zewnątrz: prywatny taras i jacuzzi z widokiem na zachód słońca nad rzeką.\n\nTo miejsce dla dwojga, które chce ciszy, albo małej grupy, która umie ją docenić — do 6 osób, z dala od zgiełku, ale 8 km od Zakliczynia.',
      en: 'Floor-to-ceiling windows open straight onto the valley — the light shifts across the living-room walls from morning to dusk. Inside: one generous bedroom, a fully equipped kitchen, and a layout that quietly invites you to stay longer than planned. Outside: a private terrace and a jacuzzi facing the sunset over the river.\n\nIt suits a couple after silence, or a small group that knows how to enjoy it — up to 6 guests, far from the noise, yet 8 km from Zakliczyn.',
    },
    amenities: [
      { pl: 'Jacuzzi z widokiem na dolinę', en: 'Jacuzzi facing the valley' },
      { pl: 'Sauna fińska', en: 'Finnish sauna' },
      { pl: 'Prywatny taras i balkon nad rzeką', en: 'Private terrace and riverside balcony' },
      { pl: 'Kuchnia w pełni wyposażona', en: 'Fully equipped kitchen' },
      { pl: 'Kominek w salonie', en: 'Fireplace in the living room' },
      { pl: 'Smart TV i szybkie WiFi', en: 'Smart TV and fast WiFi' },
      { pl: 'Bezpłatny parking prywatny', en: 'Free private parking' },
      { pl: 'Pościel, ręczniki, kosmetyki', en: 'Linens, towels, toiletries' },
    ],
    gallery: [
      { src: '/nad-dolina-dunajca/widok.webp', alt: { pl: 'Panorama Doliny Dunajca z tarasu', en: 'Panorama of the Dunajca Valley from the terrace' }, wide: true },
      { src: '/nad-dolina-dunajca/jaccuzi-zachod.webp', alt: { pl: 'Jacuzzi o zachodzie słońca', en: 'Jacuzzi at sunset' } },
      { src: '/nad-dolina-dunajca/wnetrze-dzienny.webp', alt: { pl: 'Salon w świetle dnia', en: 'Living room in daylight' } },
      { src: '/nad-dolina-dunajca/widok-jadalnie.webp', alt: { pl: 'Jadalnia z widokiem na dolinę', en: 'Dining area overlooking the valley' }, wide: true },
      { src: '/nad-dolina-dunajca/wnetrze-sypialnia.webp', alt: { pl: 'Sypialnia z widokiem na rzekę', en: 'Bedroom with a river view' } },
      { src: '/nad-dolina-dunajca/jaccuzi-dzien.webp', alt: { pl: 'Taras i jacuzzi w ciągu dnia', en: 'Terrace and jacuzzi during the day' } },
      { src: '/nad-dolina-dunajca/domek-blisko.webp', alt: { pl: 'Domek z bliska, drewniana elewacja', en: 'The cottage up close, timber facade' } },
      { src: '/nad-dolina-dunajca/domek-noc.webp', alt: { pl: 'Domek oświetlony nocą', en: 'The cottage lit up at night' }, wide: true },
      { src: '/nad-dolina-dunajca/jaccuzi-domek.webp', alt: { pl: 'Jacuzzi tuż przy domku', en: 'Jacuzzi right by the cottage' } },
      { src: '/nad-dolina-dunajca/domek-daleko.webp', alt: { pl: 'Domek na tle wzgórz', en: 'The cottage against the hills' } },
    ],
    location: {
      coords: { lat: 49.863, lng: 20.519 },
      name: { pl: 'Dolina Dunajca, Małopolska', en: 'Dunajca Valley, Małopolska' },
      description: {
        pl: 'Domek leży na wzgórzu nad Doliną Dunajca, kilka minut od Zakliczynia. Cisza, zieleń i widok na rzekę — daleko od tras turystycznych, blisko wszystkiego, co warto zobaczyć w Małopolsce.',
        en: 'The cottage sits on a hillside above the Dunajca Valley, minutes from Zakliczyn. Quiet, green, with the river always in view — far from the tourist routes, close to everything worth seeing in Małopolska.',
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
      pl: 'Ciepło drewna, ten sam widok na dolinę.',
      en: 'The warmth of timber, the same view of the valley.',
    },
    heroImage: '/drewniany-nad-dolina-dunajca/domek.webp',
    description: {
      pl: 'Bliźniaczy widok co u sąsiada, zupełnie inny charakter. Ten domek to surowe drewno, dwie osobne sypialnie i kominek, przy którym wieczory same się wydłużają. Sauna i jacuzzi czekają na zewnątrz — tak jak w pierwszym domku, tylko otoczone żywicznym zapachem świerkowej konstrukcji.\n\nWiększa przestrzeń sypialna sprawia, że to dobry wybór dla dwóch par albo rodziny z dziećmi, która chce mieć trochę więcej miejsca dla siebie.',
      en: 'The same view as next door, an entirely different character. This cottage is raw timber, two separate bedrooms, and a fireplace that makes evenings stretch on their own. Sauna and jacuzzi wait outside — just like at the first cottage, only wrapped in the resin scent of spruce construction.\n\nThe extra bedroom makes it a good fit for two couples, or a family with children who want a little more room of their own.',
    },
    amenities: [
      { pl: 'Sauna i jacuzzi na zewnątrz', en: 'Outdoor sauna and jacuzzi' },
      { pl: 'Kominek w salonie', en: 'Fireplace in the living room' },
      { pl: 'Dwie osobne sypialnie', en: 'Two separate bedrooms' },
      { pl: 'Kuchnia w pełni wyposażona', en: 'Fully equipped kitchen' },
      { pl: 'Drewniana konstrukcja i wykończenia', en: 'Timber construction and finishes' },
      { pl: 'Taras z widokiem na dolinę', en: 'Terrace overlooking the valley' },
      { pl: 'Bezpłatny parking prywatny', en: 'Free private parking' },
      { pl: 'Pościel, ręczniki, kosmetyki', en: 'Linens, towels, toiletries' },
    ],
    gallery: [
      { src: '/drewniany-nad-dolina-dunajca/domek.webp', alt: { pl: 'Drewniany domek z zewnątrz', en: 'The wooden cottage from outside' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/jaccuzi.webp', alt: { pl: 'Jacuzzi przy drewnianej elewacji', en: 'Jacuzzi by the timber facade' } },
      { src: '/drewniany-nad-dolina-dunajca/wnetrze1.webp', alt: { pl: 'Salon z surowym drewnem i kominkiem', en: 'Living room with raw timber and fireplace' } },
      { src: '/drewniany-nad-dolina-dunajca/sauna.webp', alt: { pl: 'Sauna fińska', en: 'Finnish sauna' }, wide: true },
      { src: '/drewniany-nad-dolina-dunajca/wnetrze2.webp', alt: { pl: 'Jedna z dwóch sypialni', en: 'One of the two bedrooms' } },
      { src: '/drewniany-nad-dolina-dunajca/sauna2.webp', alt: { pl: 'Wnętrze sauny', en: 'Inside the sauna' } },
      { src: '/drewniany-nad-dolina-dunajca/wnetrze3.webp', alt: { pl: 'Aneks kuchenny', en: 'Kitchen corner' } },
      { src: '/drewniany-nad-dolina-dunajca/domek2.webp', alt: { pl: 'Domek o zmierzchu', en: 'The cottage at dusk' }, wide: true },
    ],
    location: {
      coords: { lat: 49.8636, lng: 20.5205 },
      name: { pl: 'Dolina Dunajca, Małopolska', en: 'Dunajca Valley, Małopolska' },
      description: {
        pl: 'Tuż obok swojego bliźniaka, na tym samym wzgórzu nad Doliną Dunajca. Ten sam dostęp do ciszy i widoków, kilka minut od Zakliczynia i głównych atrakcji regionu.',
        en: 'Right beside its twin, on the same hillside above the Dunajca Valley. The same access to quiet and views, minutes from Zakliczyn and the region’s main attractions.',
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
          pl: 'Dwie sypialnie to był strzał w dziesiątkę dla naszych dwóch rodzin. Każdy miał swoją przestrzeń, a wieczorami spotykaliśmy się przy ognisku.',
          en: 'Two bedrooms was exactly right for our two families. Everyone had their own space, and we met by the fire in the evenings.',
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
    heroImage: '/domek4/dom-zewnatrz.webp',
    description: {
      pl: 'Największy z naszych domków, schowany na wzgórzu w Paleśnicy — z dala od wszystkiego, w otoczeniu, które robi wrażenie już przy pierwszym wjeździe na podwórze. Dwie sypialnie, ogrodzony teren, plac zabaw dla dzieci i altana z grillem, przy której wieczory ciągną się długo.\n\nIdealny dla rodzin i większych grup — do 8 osób — które chcą mieć dla siebie całe wzgórze.',
      en: 'The largest of our cottages, tucked away on a hillside in Paleśnica — far from everything, in surroundings that make an impression the moment you drive up. Two bedrooms, a fenced plot, a playground for the kids, and a gazebo with a grill where evenings stretch on.\n\nIt’s the right choice for families and larger groups — up to 8 guests — who want a whole hillside to themselves.',
    },
    amenities: [
      { pl: 'Plac zabaw dla dzieci', en: 'Playground for children' },
      { pl: 'Ogrodzony teren', en: 'Fenced grounds' },
      { pl: 'Altana z grillem', en: 'Gazebo with a grill' },
      { pl: 'Dwie przestronne sypialnie', en: 'Two spacious bedrooms' },
      { pl: 'Kuchnia w pełni wyposażona', en: 'Fully equipped kitchen' },
      { pl: 'Smart TV i szybkie WiFi', en: 'Smart TV and fast WiFi' },
      { pl: 'Bezpłatny parking na miejscu', en: 'Free on-site parking' },
      { pl: 'Pościel, ręczniki, kosmetyki', en: 'Linens, towels, toiletries' },
    ],
    gallery: [
      { src: '/domek4/dom-zewnatrz.webp', alt: { pl: 'Dom na wzgórzu w otoczeniu zieleni', en: 'The hillside house surrounded by greenery' }, wide: true },
      { src: '/domek4/kuchnia.webp', alt: { pl: 'Aneks kuchenny', en: 'Kitchen corner' } },
      { src: '/domek4/sypialnia-dwa-lozka.webp', alt: { pl: 'Przestronna sypialnia z dwoma łóżkami', en: 'Spacious bedroom with two beds' } },
      { src: '/domek4/sypialnia-duze-lozko.webp', alt: { pl: 'Sypialnia z dużym łóżkiem', en: 'Bedroom with a large bed' }, wide: true },
      { src: '/domek4/altana.webp', alt: { pl: 'Altana z miejscem do wypoczynku', en: 'Gazebo with a seating area' } },
    ],
    location: {
      coords: { lat: 49.83, lng: 20.62 },
      name: { pl: 'Paleśnica, Małopolska', en: 'Paleśnica, Małopolska' },
      description: {
        pl: 'Paleśnica to niewielka wieś w Beskidzie Wyspowym, kilka kilometrów od Zakliczynia. Domek stoi na uboczu, otoczony lasem i łąkami — totalna cisza, a mimo to blisko atrakcji Doliny Dunajca.',
        en: 'Paleśnica is a small village in the Beskid Wyspowy range, a few kilometres from Zakliczyn. The cottage stands apart, surrounded by forest and meadows — total quiet, yet close to everything the Dunajca Valley has to offer.',
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
