# Zasady kodowania

## Fundamenty

- **TypeScript strict** — `strict: true` w tsconfig, zero `any`, zero `@ts-ignore`
- **Server Components domyślnie** — `"use client"` tylko gdy potrzebna interaktywność (eventy, stan, hooki)
- **Brak komentarzy** — kod musi być samo-dokumentujący przez nazwy. Komentarz tylko gdy logika jest nieoczywista (edge case, obejście buga)
- **Brak zbędnych abstrakcji** — trzy podobne linie są lepsze niż przedwczesna abstrakcja

## Struktura plików

```
app/
  [locale]/               ← publiczne strony (pl/en)
  admin/                  ← panel admina (bez locale)
  api/                    ← route handlers
components/
  booking/                ← komponenty systemu rezerwacji
  admin/                  ← komponenty panelu admina
  ui/                     ← generyczne komponenty (button, input, etc.)
lib/
  supabase/               ← klient, typy, helpery
  stripe/                 ← inicjalizacja, helpery
  ical/                   ← parser, sync logika
  i18n/                   ← konfiguracja next-intl
types/                    ← globalne typy TypeScript
messages/
  pl.json
  en.json
```

## Konwencje nazewnictwa

- Pliki komponentów: `PascalCase.tsx`
- Pliki pomocnicze/lib: `kebab-case.ts`
- Zmienne i funkcje: `camelCase`
- Typy i interfejsy: `PascalCase`, prefix `T` lub `I` tylko gdy niezbędne rozróżnienie
- Stałe: `SCREAMING_SNAKE_CASE`
- Tabele Supabase: `snake_case`

## API Routes / Server Actions

- Walidacja inputu na granicy systemu (zod lub natywna walidacja)
- Błędy: zwracamy `{ error: string }` ze statusem HTTP, nie rzucamy wyjątków do klienta
- Brak logiki biznesowej w route handlerach — delegujemy do funkcji w `lib/`

## Baza danych

- Wszystkie zapytania przez Supabase client z typami generowanymi (`supabase gen types`)
- RLS (Row Level Security) włączone na wszystkich tabelach
- Migracje przez Supabase CLI — nigdy ręczne zmiany na produkcji

## Komponenty

- Props typowane przez `interface`, nie inline
- Brak defaultowych exportów anonimowych funkcji — zawsze named export
- Komponenty formularzy: kontrolowane przez `react-hook-form`

## Zakaz

- `console.log` w kodzie produkcyjnym
- Hardkodowane stringi widoczne dla użytkownika (wszystko przez i18n)
- Hardkodowane daty, ceny, konfiguracja — wszystko z bazy lub env
- `useEffect` do fetchowania danych (zamiast tego Server Components lub TanStack Query)
- Inline styles (zamiast tego Tailwind)

## Przed każdą implementacją Next.js

Przeczytać odpowiedni plik w `node_modules/next/dist/docs/` — API może się różnić od training data modelu.
