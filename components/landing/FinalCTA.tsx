'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/booking/Calendar'

const COTTAGES = [
  { value: '', label: 'Dowolny domek' },
  { value: 'domek-nad-dolina', label: 'Domek nad Doliną Dunajca' },
  { value: 'drewniany-domek', label: 'Drewniany Domek nad Doliną' },
  { value: 'dom-na-wzgorzu', label: 'Dom na Borówkowym Wzgórzu' },
]

interface SearchResult {
  slug: string
  namePl: string
  nameEn: string
  coverImage: string | null
  maxGuests: number
  minNights: number
}

function DateField({ label, value }: { label: string; value: Date | undefined }) {
  return (
    <div>
      <p className="text-charcoal/40 text-[9px] tracking-widest uppercase mb-1.5">{label}</p>
      <p className="text-charcoal text-sm border-b border-charcoal/15 py-2.5">
        {value ? format(value, 'd MMM yyyy', { locale: pl }) : 'Wybierz datę →'}
      </p>
    </div>
  )
}

export function FinalCTA() {
  const [range, setRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(2)
  const [cottage, setCottage] = useState('')
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const datesReady = !!(range?.from && range.to)

  async function handleSearch() {
    if (!range?.from || !range.to) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: format(range.from, 'yyyy-MM-dd'),
          checkOut: format(range.to, 'yyyy-MM-dd'),
          guests,
          cottage: cottage || undefined,
        }),
      })

      if (!res.ok) {
        setError('Coś poszło nie tak. Spróbuj ponownie.')
        return
      }

      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setError('Coś poszło nie tak. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="kontakt" className="relative bg-fog py-32 md:py-44 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sage text-[11px] tracking-[0.3em] uppercase mb-6 reveal">
          Zarezerwuj pobyt
        </p>
        <h2
          className="font-display text-charcoal leading-[0.9] mb-16 reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          Znajdź swój <em>termin.</em>
        </h2>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start reveal-d2">
          {/* Search form */}
          <div className="bg-bone border border-charcoal/10 p-6">
            <p className="text-charcoal/40 text-[10px] tracking-[0.3em] uppercase mb-5">
              Twoje kryteria
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <DateField label="Przyjazd" value={range?.from} />
              <DateField label="Wyjazd" value={range?.to} />
            </div>

            <div className="mb-4">
              <p className="text-charcoal/40 text-[9px] tracking-widest uppercase mb-1.5">Goście</p>
              <div className="flex items-center border-b border-charcoal/15 py-1.5">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="text-charcoal/55 hover:text-charcoal transition-colors px-1 text-base leading-none select-none"
                  aria-label="Mniej gości"
                >
                  −
                </button>
                <span className="text-charcoal text-sm flex-1 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(12, g + 1))}
                  className="text-charcoal/55 hover:text-charcoal transition-colors px-1 text-base leading-none select-none"
                  aria-label="Więcej gości"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-charcoal/40 text-[9px] tracking-widest uppercase mb-1.5">
                Domek
                <span className="ml-1 normal-case tracking-normal opacity-60">(opcjonalnie)</span>
              </label>
              <div className="relative">
                <select
                  value={cottage}
                  onChange={(e) => setCottage(e.target.value)}
                  className="w-full bg-transparent text-charcoal text-sm border-b border-charcoal/15 py-1.5 pr-5 focus:outline-none focus:border-charcoal/40 transition-colors cursor-pointer appearance-none"
                >
                  {COTTAGES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-0 bottom-2 text-charcoal/35 text-[10px] pointer-events-none">
                  ▾
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={!datesReady || loading}
              className="relative w-full bg-forest text-bone text-sm tracking-wide py-3 rounded-full cursor-pointer overflow-hidden group transition-all duration-100 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-enabled:group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
              <span className="relative z-10 group-enabled:group-hover:text-forest transition-colors duration-150 delay-150">
                {loading ? 'Szukam…' : 'Szukaj domków'}
              </span>
            </button>

            {!datesReady && (
              <p className="mt-4 text-charcoal/40 text-xs leading-relaxed">
                Wybierz termin w kalendarzu, aby wyszukać dostępne domki.
              </p>
            )}
          </div>

          {/* Calendar */}
          <div className="bg-bone border border-charcoal/10 p-6">
            <Calendar bookedRanges={[]} minNights={1} locale="pl" onRangeSelect={setRange} />
          </div>
        </div>

        {/* Results */}
        {error && (
          <p className="mt-12 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 reveal">
            {error}
          </p>
        )}

        {results && (
          <div className="mt-16 reveal">
            <p className="text-charcoal/40 text-[10px] tracking-[0.3em] uppercase mb-8">
              {results.length === 0
                ? 'Brak wolnych domków w tym terminie'
                : `Dostępne domki — ${results.length}`}
            </p>

            {results.length === 0 ? (
              <p className="text-charcoal/55 text-[15px] leading-relaxed max-w-md">
                Nie znaleźliśmy domków spełniających te kryteria. Spróbuj zmienić termin, liczbę
                gości lub wybrać inny domek.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((r) => (
                  <a
                    key={r.slug}
                    href={`/pl/domki/${r.slug}`}
                    className="group bg-bone border border-charcoal/10 overflow-hidden hover:border-charcoal/25 transition-colors"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-fog">
                      {r.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.coverImage}
                          alt={r.namePl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-2">
                        {r.maxGuests} os. · min. {r.minNights}{' '}
                        {r.minNights === 1 ? 'noc' : 'nocy'}
                      </p>
                      <h3 className="font-display italic text-charcoal text-xl mb-4">{r.namePl}</h3>
                      <span className="inline-flex items-center text-sm text-forest tracking-wide">
                        Sprawdź termin
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          aria-hidden
                          className="ml-1.5 group-hover:translate-x-0.5 transition-transform"
                        >
                          <path
                            d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-16 text-charcoal/40 text-sm reveal">
          Masz pytania?{' '}
          <a
            href="mailto:kontakt@domeknaddunajem.pl"
            className="underline underline-offset-4 hover:text-charcoal/70 transition-colors"
          >
            kontakt@domeknaddunajem.pl
          </a>
        </p>
      </div>
    </section>
  )
}
