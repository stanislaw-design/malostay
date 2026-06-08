# Homepage Design System — Domek nad Doliną

> Ten dokument to jedyne źródło prawdy dla wyglądu strony głównej.
> System rezerwacji (booking flow) trzyma się `visual-guidelines.md` i adoptuje tu ustalone tokeny.

---

## Teza

> "Domek nad Doliną to nie nocleg — to poczucie bycia dokładnie tam, gdzie powinno się być."

Strona ma w 10 sekund przekazać trzy rzeczy: **miejsce jest prawdziwe**, **jest wyjątkowe**, **wiem jak to zarezerwować**.
Nie jest to kolejny listing na OLX ani klon szablonu WordPress. To micro-site marki.

---

## Identyfikacja marki

### Nazwa na stronie
**Domek nad Doliną** (pl) / **Above the Valley** (en)

### Tagline
PL: *Cztery domki. Beskidy. Cisza.*
EN: *Four cabins. The Beskids. Silence.*

### Ton głosu
- Ciepły, osobisty — forma "Ty" (nieformalnie)
- Poetycki, nie marketingowy — opisujemy uczucia, nie features
- Konkretny tam gdzie trzeba — ceny, daty, pojemność — bez ukrywania
- PL native, EN naturalne tłumaczenie (nie Google Translate feel)

---

## Paleta kolorów

```
--color-pine       #B87B3A   /* ciepłe drewno — akcent primary */
--color-forest     #1C2320   /* głęboki las — tła dark, text */
--color-fog        #F4EEE4   /* mgła / krem — background light */
--color-sage       #7A8E7E   /* szałwia — secondary akcent, ikony */
--color-bone       #FDFAF5   /* kość słoniowa — biel z ciepłem */
--color-charcoal   #2E3330   /* ciemny grafitowy — text on light */
--color-mist       #C8CEC9   /* mgła — borders, dividers */
```

**Zasady użycia:**
- `--color-forest` jako tło dark sekcji (CTA, footer)
- `--color-fog` jako tło wszystkich light sekcji (nie czysta biel)
- `--color-pine` TYLKO dla CTA buttonów i hover states — nie rozpraszać
- `--color-sage` dla ikon, tagów, subtelnych akcentów
- Nigdy `red` jako informacja — tylko jako błąd walidacji

---

## Typografia

### Czcionki
```
Display:  Cormorant Garamond (Google Fonts) — italic dla emocji, regular dla nagłówków
Body:     DM Sans (Google Fonts) — wszelki UI, body text, etykiety
```

### Skala (px → rem z base 16px)
```
--text-xs    12px / 0.75rem    — labels, badges, legal
--text-sm    14px / 0.875rem   — body secondary, meta
--text-base  16px / 1rem       — body primary
--text-lg    20px / 1.25rem    — leady, card titles
--text-xl    24px / 1.5rem     — section subtitles
--text-2xl   32px / 2rem       — section titles (DM Sans)
--text-3xl   48px / 3rem       — hero subtitle (Cormorant)
--text-hero  72–96px           — hero headline (Cormorant, responsive)
```

### Zasady
- Nagłówki sekcji: DM Sans, semibold, `--text-2xl`, `--color-charcoal`
- Hero headline: Cormorant Garamond, regular/light, `--text-hero`, `--color-bone`
- Ceny: DM Sans bold — nigdy Cormorant
- Daty i techniczne dane: DM Sans — zawsze
- Cormorant używamy TYLKO dla emocjonalnych nagłówków i tagline'ów

---

## Spacing

```
--space-1   4px
--space-2   8px
--space-3   12px
--space-4   16px
--space-6   24px
--space-8   32px
--space-12  48px
--space-16  64px
--space-24  96px
--space-32  128px
```

Sekcje na desktopie: `padding-y: --space-24` (96px)
Sekcje na mobile: `padding-y: --space-16` (64px)
Oddech między elementami nigdy poniżej `--space-6` (24px)

---

## Zdjęcia — stockowe (do zastąpienia)

### Źródło: Unsplash (unsplash.com)

| Slot | Słowa kluczowe do szukania | Format | Nastrój |
|---|---|---|---|
| Hero background | `wooden cabin snow winter mountain forest` lub `a-frame cabin winter` | Landscape, 16:9, ciemny | Cisza, izolacja, magia |
| Domek 1 card | `cozy wooden cabin exterior summer` | Portrait 3:4 | Letni, jasny, zielony |
| Domek 2 card | `mountain cabin balcony view` | Portrait 3:4 | Z perspektywy |
| Domek 3 card | `a-frame cabin forest path` | Portrait 3:4 | Intymny, leśny |
| Domek 4 card | `cabin night lights exterior` | Portrait 3:4 | Ciepły, wieczorny |
| Interior 1 | `cozy cabin interior wooden beams dining` | Landscape | Jak nasze zdjęcie — beamy, stół |
| Interior 2 | `cabin interior large window mountain view` | Landscape | Panoramiczne okno |
| Interior 3 | `wooden cabin bedroom loft` | Landscape | Sypialnia/antresola |
| Atmosphere | `mountain valley aerial fog morning` | Landscape wide | Widok na dolinę |
| Location | `beskid mountains landscape` | Wide landscape | Kontekst geograficzny |

**Ważne przy wyborze stocków:**
- Szukaj zdjęć z `warm tones` lub `warm light` — pasują do naszej palety
- Unikaj zbyt nowoczesnych/minimalistycznych wnętrz — szukamy rustic-warm
- Unikaj zbyt "american cabin" — szukamy środkowoeuropejskiego charakteru

---

## Architektura strony — sekcje

### 0. Sticky Navigation
```
[Logo: "Domek nad Doliną"]                    [Domki] [Galeria] [Kontakt] | [PL/EN] [Zarezerwuj →]
```
- Transparentna na hero, `--color-bone/95` po scrollu z backdrop-blur
- Na mobile: hamburger, drawer z prawej
- CTA button: `--color-pine` fill, `--color-bone` tekst
- Animacja: fade-in background `on scroll > 80px`

---

### 1. HERO — 100vh
**Układ:**
```
[Pełnoekranowe zdjęcie zimowego domku]
[Gradient overlay: transparent → --color-forest 60% opacity, od dołu]

                    Cisza nad doliną.          ← Cormorant 80–96px, --color-bone
              Cztery domki. Beskidy. Cisza.   ← DM Sans 18px, --color-fog, letter-spacing
                                              
     [Sprawdź dostępność]    [Poznaj domki ↓]  ← Dwa CTA obok siebie
```

**CTA Primary:** outline `--color-bone`, hover → fill `--color-bone`, tekst `--color-forest`
**CTA Secondary:** ghost, `--color-fog`, strzałka w dół, onClick → smooth scroll do #domki

**Mobile:** Headline skaluje do 52px, buttony stack pionowo, obraz centrowany na środek kadru

---

### 2. TRUST STRIP
Cienki pasek `--color-fog`, `border-bottom: 1px solid --color-mist`

```
  [🏠] 4 domki    [👤] do 6 osób    [🌄] Widok na dolinę    [🚗] Bezpłatny parking    [⭐] 4.9 · 48 opinii
```
- Ikony: Lucide React (stroke-width 1.5, `--color-sage`)
- Tekst: DM Sans 14px, `--color-charcoal`
- Na mobile: horizontal scroll, no-wrap
- Scroll-triggered fade-in

---

### 3. THE COTTAGES — `#domki`
**Nagłówek sekcji:**
```
Nasze domki                              ← DM Sans semibold 32px
Każdy z charakterem. Każdy z widokiem.  ← Cormorant italic 22px, --color-sage
```

**Grid:** 2 kolumny desktop, 1 kolumna mobile
**Każda karta domku:**
```
[Zdjęcie 3:4, hover → scale 1.03, 400ms ease]
─────────────────────────────────────────
Domek I · "Przy Lesie"           od 350 zł/noc
Do 4 osób · 2 sypialnie · min. 2 noce
[Sprawdź termin →]
```
- Karta: `background: --color-bone`, border-radius 4px, shadow subtelny
- Zdjęcie: `overflow: hidden` dla effect scale
- Nazwy domków: DO UZGODNIENIA Z KLIENTEM
- Cena: DM Sans bold, `--color-charcoal` — widoczna, nie ukryta

---

### 4. ATMOSPHERE — Editorial
Dwa bloki alternating layout (obraz + tekst, tekst + obraz)

**Blok A:**
```
[Zdjęcie wnętrza, 55% width]    |   Widok, który zostaje w pamięci.
                                     ─────────────────────────────────
                                     Panoramiczne okna wychodzą prosto na dolinę.
                                     Budzisz się z kawą w ręku i patrzysz, jak mgła
                                     opada między wzgórza. To tutaj.
```

**Blok B:**
```
  Twój czas, twoje tempo.        |   [Zdjęcie tarasu/wieczór]
  ──────────────────────────────
  Kryty taras, fotel wiszący,
  cisza przerywana tylko wiatrem
  w koronach drzew.
```

- Tekst: Cormorant italic 24px dla tytułu, DM Sans 16px dla body
- Sekcja `--color-fog` background
- Na mobile: obraz pełnej szerokości nad tekstem (nie obok)

---

### 5. AMENITIES
**Nagłówek:** "Co znajdziesz na miejscu"

Grid 4 kolumny desktop / 2 kolumny mobile — max 8 pozycji widocznych

```
[Ikona]          [Ikona]          [Ikona]          [Ikona]
WiFi             BBQ              Kuchnia          Parking

[Ikona]          [Ikona]          [Ikona]          [Ikona]
Smart TV         Pościel          Ręczniki         Ognisko
```

Przycisk "Pokaż wszystko" → ekspanduje do pełnej listy

- Tło: `--color-bone`
- Ikony: Lucide React, `--color-pine`, size 28px

---

### 6. GALLERY
Masonry grid — nie carousel.

- 3 kolumny desktop, 2 mobile
- Click → lightbox (pełny ekran, klawisze ← →)
- Lazy-loaded
- Mix: exterior, interior, widoki, szczegóły (żyrandol z gałęzi!)
- DO ZASTĄPIENIA gdy przyjdą realne zdjęcia

---

### 7. LOCATION
```
[Mapa — Google Maps embed lub Mapbox static]
─────────────────────────────────────────────
Beskid Śląski · gmina [X]

• 15 min od centrum Żywca
• 25 min od Wisły
• 40 min od Bielska-Białej
• Zimą: 20 min od tras narciarskich
```

---

### 8. REVIEWS
**Nagłówek:** "Co mówią goście" / "What our guests say"

Karty, maksymalnie 6 widocznych na raz:
```
"Najbardziej relaksujący weekend od lat. Widok z okna zapiera dech."
— Anna K. · sierpień 2025
⭐⭐⭐⭐⭐  · Zweryfikowane Booking.com
```

- Układ: 3 kolumny desktop, 1 mobile, horizontal scroll
- Bez gwiazdkowego ratingu na poziomie sekcji (nie chcemy agencyjnego feel)
- Opcjonalnie: agregat "4.9 · 48 opinii · Booking.com"

---

### 9. FINAL CTA — Dark Section
Tło: `--color-forest`, pełna szerokość.

```
      Twój urlop zaczyna się od jednej decyzji.
      ─────────────────────────────────────────
      [Sprawdź wolne terminy →]
      
      Masz pytania? Napisz: kontakt@domeknadolina.pl
```

- Headline: Cormorant 52px, `--color-bone`
- Button: outline `--color-pine`, fill on hover
- Email jako plain text link, nie button

---

### 10. FOOTER
Minimalistyczny.
```
© 2025 Domek nad Doliną          [PL] [EN]          Polityka prywatności
```

---

## Animacje i interakcje

| Element | Animacja | Timing |
|---|---|---|
| Sekcje on-scroll | fade-up 24px, opacity 0→1 | 500ms ease-out, threshold 20% |
| Karty domków hover | scale(1.03) na zdjęciu | 400ms ease |
| Nav background | opacity 0→1 backdrop-blur | 200ms linear |
| CTA button hover | fill transition | 150ms ease |
| Gallery lightbox | fade | 200ms |

**Czego NIE robimy:**
- Żadnego parallax scroll na hero (heavy, distracting)
- Żadnego auto-play slideshow
- Żadnych bounce/spring animations — to nie e-commerce

---

## Responsywność

| Breakpoint | Zachowanie |
|---|---|
| `< 640px` mobile | Hero headline 52px, single column, sticky nav hamburger |
| `640–1024px` tablet | Hero 64px, 2-col cards grid |
| `> 1024px` desktop | Full layout jak powyżej |

---

## i18n — dwujęzyczność

- Routing: `next-intl` — `/pl/*` i `/en/*`, `/` redirectuje per Accept-Language
- Przełącznik: `[PL] [EN]` w nav i footer — minimalistyczny, nie flag icons
- Tłumaczenia: klucze w `src/i18n/messages/pl.json` i `en.json`
- Daty: format lokalny (pl: `15 czerwca 2026`, en: `June 15, 2026`)
- Ceny: zawsze PLN — `350 zł / noc` (pl), `350 PLN / night` (en)

---

## Co do ustalenia z klientem

- [ ] Nazwy 4 domków (poetyckie, nie numeryczne)
- [ ] Dokładna lokalizacja (gmina, link do mapy)
- [ ] Kontaktowy email/telefon
- [ ] Liczba i źródło opinii (Booking.com? Google?)
- [ ] Ceny minimalne do wyświetlenia w sekcji domków
- [ ] Czy fotel wiszący / taras / ognisko są przy każdym domku?
- [ ] Real photos timeline

---

## Kolejne kroki implementacji

1. Zbudować `components/landing/` — niezależny od booking flow
2. Zaimplementować `app/page.tsx` jako landing page (aktualnie dev-only mock)
3. Stockowe zdjęcia → `public/images/stock/` — łatwa podmiana
4. Token CSS (`globals.css` lub Tailwind config) jako baza dla spójności z booking flow
