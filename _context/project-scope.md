# Zakres projektu

## Co budujemy

### System rezerwacji (core)
- [ ] Wielodomenikowy — wiele domków na jednej instalacji
- [ ] Publiczny kalendarz dostępności per domek
- [ ] Flow rezerwacji: wybór dat → dane gościa → płatność
- [ ] Minimalna liczba nocy (konfigurowalna per domek)
- [ ] Płatności przez Stripe: BLIK, Apple Pay, Google Pay, karta
- [ ] Zadatek lub pełna płatność (konfigurowalne z admina)
- [ ] Obsługa dwóch języków: polski i angielski

### Synchronizacja kalendarza
- [ ] Import zajętych terminów przez iCal (Booking.com, Airbnb i inne)
- [ ] Eksport własnego feedu iCal dla zewnętrznych platform
- [ ] Auto-sync co 5 minut (Supabase Edge Function)

### Panel admina
- [ ] Logowanie (Supabase Auth)
- [ ] Zarządzanie domkami (dodawanie, edycja, aktywacja/dezaktywacja)
- [ ] Konfiguracja cen (reguły sezonowe, weekendowe, etc.)
- [ ] Konfiguracja per domek: min. noce, check-in/out, zadatek %
- [ ] Zarządzanie rezerwacjami: podgląd, potwierdzenie, anulowanie
- [ ] Ręczne blokowanie terminów (urlopy techniczne, remonty)
- [ ] Podgląd kalendarza z wszystkimi rezerwacjami
- [ ] Zarządzanie feedami iCal (dodawanie/usuwanie źródeł)

### Szablon / reużywalność
- [ ] Konfiguracja przez pliki env + dane w bazie
- [ ] Łatwe wdrożenie na nowej stronie bez zmian w logice

---

## Czego NIE robimy (poza zakresem)

- Anulowanie rezerwacji przez gościa w systemie — odsyłamy do kontaktu mailowego
- Booking.com Connectivity API — planowane później, wymaga certyfikacji
- Wielowalutowość — tylko PLN
- System recenzji/ocen domków
- Wiadomości między gościem a adminem w systemie
- Aplikacja mobilna
- Rozliczenia/faktury VAT (opcjonalnie: paragon Stripe)
- Integracja z systemami PMS (Property Management System)
- Dynamiczne wyceny oparte o AI / popyt
- Stripe Connect (platforma) — jeden klucz dla całej instalacji, nie per-domek
- Klucze Stripe per domek — jeden globalny klucz w env vars

---

## Fazy realizacji

### Faza 1 — Fundament
Supabase setup, schemat bazy, typy, auth admina, middleware

### Faza 2 — Silnik kalendarza
Model dostępności, iCal sync, eksport feedu, mockowy iCal do testów

### Faza 3 — Publiczny flow rezerwacji
Widok domku, kalendarz UI, formularz gościa, integracja Stripe

### Faza 4 — Panel admina
Zarządzanie domkami, rezerwacjami, cennikiem, kalendarzem, feedami iCal

### Faza 5 — i18n
Pełne tłumaczenia pl/en, routing locale, formatowanie dat i kwot

### Faza 6 — Testy i szlif
E2E happy path, edge cases kalendarza, testy płatności (Stripe test mode), responsywność
