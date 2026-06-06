# Postęp projektu

Ostatnia aktualizacja: 2026-06-04 (Faza 3)

## Status ogólny

✅ **Fazy 1 i 2 ukończone — Faza 3 ukończona**

---

## Faza 1 — Fundament

| Zadanie | Status | Uwagi |
|---|---|---|
| Inicjalizacja Supabase (projekt, local dev) | ✅ done | Docker, `supabase start` działa |
| Schemat bazy danych — migracje | ✅ done | `20260604132120_initial_schema.sql` |
| Generowanie typów TypeScript z Supabase | ✅ done | `types/database.ts` |
| Supabase Auth — logowanie admina | ⬜ todo | |
| Middleware Next.js — ochrona `/admin/*` | ✅ done | `middleware.ts` + `lib/supabase/middleware.ts` |
| Konfiguracja next-intl (pl/en routing) | ⬜ todo | |
| Struktura folderów projektu | ✅ done | |
| Podłączenie Supabase cloud (prod) | 🚫 blocked | Do zrobienia później — `supabase login` + `supabase link` |

## Faza 2 — Silnik kalendarza

| Zadanie | Status | Uwagi |
|---|---|---|
| Model dostępności (łączenie reservations + external_bookings) | ✅ done | `lib/availability.ts` |
| Edge Function: ical-sync (cron */5) | ✅ done | `supabase/functions/ical-sync/index.ts` |
| Parser iCal | ✅ done | `lib/ical/parser.ts` + `supabase/functions/_shared/ical-parser.ts` |
| Mockowy serwer iCal do testów lokalnych | ✅ done | `app/api/ical-mock/route.ts` |
| API route: eksport własnego feedu iCal | ✅ done | `app/api/ical/[slug]/route.ts` |
| Komponent kalendarza UI | ✅ done | `components/booking/Calendar.tsx` (react-day-picker v10) |
| Logika pessimistic locking przy tworzeniu rezerwacji | ✅ done | W `create-intent`: check confirmed + external przed insertem |

## Faza 3 — Publiczny flow rezerwacji

| Zadanie | Status | Uwagi |
|---|---|---|
| Strona domku (`/[locale]/domki/[slug]`) | ✅ done | `app/[locale]/domki/[slug]/page.tsx` |
| Komponent kalendarza dostępności | ✅ done | `components/booking/Calendar.tsx` (z Fazy 2) |
| Walidacja minimalnej liczby nocy w UI | ✅ done | W Calendar + BookingWidget |
| Formularz danych gościa | ✅ done | `components/booking/GuestForm.tsx` (react-hook-form + zod) |
| Podsumowanie rezerwacji | ✅ done | `components/booking/BookingSummary.tsx` |
| Integracja Stripe Payment Element | ✅ done | `components/booking/PaymentForm.tsx` — BLIK, P24, karta |
| Webhook Stripe — potwierdzenie płatności | ✅ done | `app/api/webhooks/stripe/route.ts` |
| Strona potwierdzenia rezerwacji | ✅ done | `app/[locale]/domki/[slug]/potwierdzenie/page.tsx` |
| Email potwierdzający (Supabase/Resend) | ✅ done | `lib/email/send-booking-emails.ts` — gość (pl/en) + admin; trigger: webhook Stripe |

## Faza 4 — Panel admina

| Zadanie | Status | Uwagi |
|---|---|---|
| Layout admina (sidebar, nawigacja) | ⬜ todo | |
| Lista domków + dodawanie/edycja | ⬜ todo | |
| Konfiguracja per domek (min. noce, check-in/out, zadatek) | ⬜ todo | |
| Konfiguracja kluczy Stripe per domek | 🚫 n/a | Jeden globalny klucz w env vars |
| Zarządzanie regułami cenowymi | ⬜ todo | |
| Lista rezerwacji z filtrowaniem | ⬜ todo | |
| Szczegóły rezerwacji + akcje (potwierdź, anuluj) | ⬜ todo | |
| Kalendarz admina z widokiem wszystkich rezerwacji | ⬜ todo | |
| Ręczne blokowanie terminów | ⬜ todo | |
| Zarządzanie feedami iCal (dodaj/usuń/odśwież) | ⬜ todo | |

## Faza 5 — i18n

| Zadanie | Status | Uwagi |
|---|---|---|
| Tłumaczenia flow rezerwacji (pl/en) | ⬜ todo | |
| Tłumaczenia strony domku (pl/en) | ⬜ todo | |
| Formatowanie dat (locale-aware) | ⬜ todo | |
| Formatowanie kwot (PLN) | ⬜ todo | |
| Przełącznik języka w UI | ⬜ todo | |

## Faza 6 — Testy i szlif

| Zadanie | Status | Uwagi |
|---|---|---|
| E2E: pełny flow rezerwacji (Stripe test mode) | ⬜ todo | |
| Testy edge cases kalendarza (min. noce, granice, zajęte daty) | ⬜ todo | |
| Testy sync iCal (mockowy serwer) | ⬜ todo | |
| Responsywność na mobile | ⬜ todo | |
| Accessibility podstawowa (focus, aria-labels) | ⬜ todo | |
| Wydajność — lazy loading kalendarza | ⬜ todo | |

---

## Decyzje i ustalenia

| Data | Decyzja |
|---|---|
| 2026-06-04 | Stack: Next.js + Supabase + Stripe + next-intl |
| 2026-06-04 | Płatności: Stripe (jeden globalny klucz w env vars, nie per-domek) |
| 2026-06-04 | Booking.com: iCal na teraz, Connectivity API w przyszłości |
| 2026-06-04 | iCal sync: co 5 minut (Supabase Edge Function) |
| 2026-06-04 | Anulowanie: tylko przez admina lub kontakt mailowy — bez self-service |
| 2026-06-04 | Języki: pl + en (next-intl) |
| 2026-06-04 | Model cen: reguły priorytetowe (sezon, weekend, etc.) — konfigurowane z admina |

---

## Legenda

| Symbol | Znaczenie |
|---|---|
| ⬜ todo | Nierozpoczęte |
| 🔄 in progress | W trakcie |
| ✅ done | Ukończone |
| 🚫 blocked | Zablokowane (podaj powód) |
