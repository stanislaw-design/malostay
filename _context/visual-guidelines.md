# Założenia wizualne — System rezerwacji

> Dotyczy modułu rezerwacji i panelu admina.
> Strona główna ma własny design — system rezerwacji musi się z nią spójnie łączyć, ale nie zastępuje jej designu.

## Filozofia

- **Zaufanie przede wszystkim** — gość ma zostawić pieniądze. Design musi budować poczucie bezpieczeństwa i profesjonalizmu
- **Klarowność nad ozdobnością** — dostępność dat, cena, czas pobytu — zawsze na pierwszym planie
- **Mobile-first** — większość rezerwacji pochodzi z telefonów

## Układ flow rezerwacji (publiczny)

### Krok 1 — Wybór dat
- Kalendarz zajmuje centralną pozycję, nie schowany w dropdownie
- Wyraźne oznaczenia: dostępne (białe/jasne) / zajęte (wyszarzone, przekreślone) / wybrane (kolor akcentu)
- Minimalna liczba nocy — wyraźna informacja pod kalendarzem, wizualne zablokowanie krótszego wyboru
- Cena za noc widoczna w nagłówku — bez ukrywania

### Krok 2 — Dane gościa
- Formularz prosty: tylko to co konieczne (imię, email, telefon, liczba osób + opcjonalne uwagi)
- Podsumowanie rezerwacji widoczne obok (desktop) lub powyżej (mobile) formularza
- Inline walidacja — błędy przy polu, nie po submicie

### Krok 3 — Płatność
- Stripe Payment Element — gotowy, dobrze wyglądający komponent
- Wyraźna informacja o kwocie i co obejmuje (zadatek lub całość)
- Przyciski Apple Pay / Google Pay widoczne jako pierwsza opcja jeśli dostępne

### Potwierdzenie
- Prosta strona sukcesu: numer rezerwacji, daty, kwota, email z potwierdzeniem
- Brak rozpraszaczy — zero CTA prowadzących gdzieś indziej

## Kalendarz — stany wizualne

| Stan | Wygląd |
|---|---|
| Dostępny | Biały/jasny, cursor pointer |
| Niedostępny (zajęty) | Szary, przekreślony, cursor not-allowed |
| Wybrany (zakres) | Kolor akcentu, wypełnienie zakresu między datami |
| Dzisiaj | Delikatne obramowanie lub podkreślenie |
| Poza minimalnym pobytem | Zablokowany wizualnie po wyborze check-in |
| Hover | Delikatny podświetl |

## Typografia

- Hierarchia: nagłówek strony domku → cena → sekcje
- Daty i kwoty: zawsze wyróżnione wagą (semibold/bold), nie kolorem
- Komunikaty błędów: czerwony, przy polu, małą czcionką
- Komunikaty sukcesu: zielony, wyraźny ale nie krzykliwy

## Kolor

- Paleta kolorów: do dopasowania do palety strony głównej przy integracji
- Kolor akcentu systemu rezerwacji: wybrany razem z klientem przed implementacją UI
- Zajęte daty: zawsze neutralny szary (nie czerwony — czerwony to błąd, nie informacja)
- Dostępne daty: zawsze jasne, zachęcające

## Spacing i siatka

- Formularz rezerwacji: max-width 480px na mobile, obok kalendarza na desktop (grid 2-kolumnowy)
- Padding wewnętrzny kart: minimum 24px
- Odstępy między sekcjami: duże (48px+) — nie skąpimy na oddechu

## Panel admina

- Funkcjonalny, nie ozdobny — admin pracuje tu często
- Tabela rezerwacji: gęsta ale czytelna, filtrowanie po statusie/dacie/domku
- Kalendarz admina: widok miesięczny, kolory per źródło (bezpośrednia / Booking.com / zablokowana)
- Formularze ustawień: sekcje z wyraźnymi nagłówkami, grupowanie logiczne
- Potwierdzenia niszczycielskich akcji (anulowanie, usunięcie) — zawsze dialog z opisem konsekwencji

## Responsywność

- Breakpoints Tailwind: sm (640) / md (768) / lg (1024)
- Kalendarz na mobile: jeden miesiąc, pełna szerokość
- Kalendarz na desktop: dwa miesiące obok siebie
- Panel admina: sidebar na desktop, hamburger menu na mobile
