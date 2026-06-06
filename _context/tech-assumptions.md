# Założenia techniczne

## Stack

| Warstwa | Technologia | Uwagi |
|---|---|---|
| Framework | Next.js App Router | Przed pisaniem kodu czytamy `node_modules/next/dist/docs/` |
| Baza danych | Supabase (PostgreSQL) | Auth, Edge Functions, realtime jeśli potrzeba |
| Płatności | Stripe – Payment Element | BLIK, Apple Pay, Google Pay, karta |
| i18n | next-intl | Routing `/pl/` i `/en/`, pliki `messages/pl.json` i `messages/en.json` |
| Styling | Tailwind CSS | Utility-first, bez CSS-in-JS |
| Język | TypeScript (strict) | Brak `any`, brak `as unknown` |
| iCal parsing | ical.js lub node-ical | Do ustalenia przy implementacji |
| Cron | Supabase Edge Function | `*/5 * * * *` — sync iCal co 5 minut |

## Konfiguracja Stripe

Jeden globalny klucz Stripe dla całej instalacji — przechowywany w zmiennych środowiskowych:
- `STRIPE_SECRET_KEY` — server-only
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — dostępny w przeglądarce
- `STRIPE_WEBHOOK_SECRET` — server-only, do weryfikacji webhooków

Nie używamy Stripe Connect ani kluczy per-domek.

## Autoryzacja admina

Supabase Auth — email + hasło. Jedna rola: `admin`. Middleware Next.js chroni wszystkie ścieżki `/admin/*`.

## Środowiska

- **Development** — lokalna baza Supabase (`supabase start`), mockowy serwer iCal, Stripe test keys
- **Production** — Supabase cloud, Stripe live keys

## Synchronizacja kalendarza

- Booking.com i inne źródła: iCal (`.ics`) — polling co 5 minut przez Edge Function
- Dwukierunkowość: system eksportuje własny feed iCal pod `/api/ical/[propertySlug]`, który Booking.com może importować
- API Connectivity Booking.com: planowane w późniejszej fazie, wymaga certyfikacji partnera
- Testowanie: mockowy serwer iCal lokalnie serwujący `.ics` z przykładowymi danymi

## Model dostępności

Termin jest zajęty gdy istnieje rekord w:
- `reservations` o statusie `confirmed` pokrywający daty, LUB
- `external_bookings` pokrywający daty (źródło: iCal)

Przy składaniu rezerwacji — pessimistic locking: sprawdzamy dostępność tuż przed utworzeniem PaymentIntent.
