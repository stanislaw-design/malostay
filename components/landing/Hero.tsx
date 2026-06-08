'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function WordReveal({
  text,
  italic,
  baseDelay,
}: {
  text: string
  italic?: boolean
  baseDelay: number
}) {
  const words = text.split(' ')
  const spans = words.map((word, i) => (
    <span
      key={i}
      className="inline-block hero-word"
      style={{
        opacity: 0,
        animation: `hero-word-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        animationDelay: `${baseDelay + i * 0.1}s`,
      }}
    >
      {word}
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ))
  return italic ? <em>{spans}</em> : <>{spans}</>
}

export function Hero() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [cottage, setCottage] = useState('')

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)

  async function handleCheckAvailability() {
    if (!checkIn || !checkOut) {
      setSearchError('Wybierz datę przyjazdu i wyjazdu.')
      setSearchResults(null)
      setSearchOpen(true)
      return
    }
    if (checkOut <= checkIn) {
      setSearchError('Data wyjazdu musi być późniejsza niż data przyjazdu.')
      setSearchResults(null)
      setSearchOpen(true)
      return
    }

    setSearchOpen(true)
    setSearchLoading(true)
    setSearchError(null)
    setSearchResults(null)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, checkOut, guests, cottage: cottage || undefined }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSearchError('Nie udało się sprawdzić dostępności. Spróbuj ponownie.')
        return
      }

      setSearchResults(data.results ?? [])
    } catch {
      setSearchError('Nie udało się sprawdzić dostępności. Spróbuj ponownie.')
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    if (!searchOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [searchOpen])

  const fieldBase =
    'w-full bg-transparent text-bone text-sm border-b border-bone/25 py-2.5 focus:outline-none focus:border-bone/55 transition-colors [color-scheme:dark]'

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/hero-bg.webp"
        alt=""
        fill
        priority
        quality={90}
        className="object-cover hero-zoom"
        style={{ objectPosition: '35% center' }}
      />

      {/* Base overlay */}
      <div className="absolute inset-0 bg-forest/52" />

      {/* Centre vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(28,35,32,0.38) 0%, transparent 70%)',
        }}
      />

      {/* Top gradient — nav readability */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-forest/60 to-transparent" />

      {/* Bottom gradient — scroll fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forest/70 to-transparent" />

      {/* Main content: stacked on mobile, side-by-side on desktop */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full px-6 lg:px-16 pt-28 lg:pt-0 pb-16 lg:pb-0 gap-10 lg:gap-0">

        {/* Text block — top on mobile, bottom-left on desktop */}
        <div className="flex-1 flex flex-col justify-start lg:justify-end lg:pb-20">
          <p className="hero-label text-sage text-[11px] tracking-[0.32em] uppercase mb-7">
            Dolina Dunajca&ensp;·&ensp;Małopolska
          </p>

          <h1
            className="font-display text-bone leading-[0.88] mb-7"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 7.5rem)' }}
          >
            <WordReveal text="Twoja dolina." baseDelay={0.3} />
            <br />
            <WordReveal text="Twoje tempo." italic baseDelay={0.5} />
          </h1>

          <p
            className="hero-body text-bone/62 text-lg mb-10 leading-relaxed"
            style={{ maxWidth: '26rem', fontWeight: 300 }}
          >
            Pięć domków nad Doliną Dunajca — każdy z charakterem, każdy z widokiem.
          </p>

          <div className="hero-ctas">
            <a
              href="#domki"
              className="relative inline-flex items-center text-sm font-medium px-5 py-2 border border-bone text-bone rounded-full overflow-hidden group transition-transform duration-100 active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
              <span className="relative z-10 group-hover:text-forest transition-colors duration-150 delay-150">
                Poznaj domki ↓
              </span>
            </a>
          </div>
        </div>

        {/* Booking widget — below text on mobile, center-right on desktop */}
        <div className="flex-shrink-0 flex flex-col justify-start lg:justify-center lg:px-8 lg:w-[340px]">
          <div className="hero-widget bg-forest/75 backdrop-blur-md border border-bone/10 p-5">
            <p className="text-bone/40 text-[10px] tracking-[0.3em] uppercase mb-4">
              Zarezerwuj pobyt
            </p>

            {/* Przyjazd + Wyjazd — one row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-bone/40 text-[9px] tracking-widest uppercase mb-1.5">
                  Przyjazd
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className={fieldBase}
                />
              </div>
              <div>
                <label className="block text-bone/40 text-[9px] tracking-widest uppercase mb-1.5">
                  Wyjazd
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className={fieldBase}
                />
              </div>
            </div>

            {/* Ilość gości */}
            <div className="mb-4">
              <label className="block text-bone/40 text-[9px] tracking-widest uppercase mb-1.5">
                Goście
              </label>
              <div className="flex items-center border-b border-bone/25 py-1.5">
                <button
                  type="button"
                  onClick={() => setGuests(g => Math.max(1, g - 1))}
                  className="text-bone/55 hover:text-bone transition-colors px-1 text-base leading-none select-none"
                  aria-label="Mniej gości"
                >
                  −
                </button>
                <span className="text-bone text-sm flex-1 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests(g => Math.min(12, g + 1))}
                  className="text-bone/55 hover:text-bone transition-colors px-1 text-base leading-none select-none"
                  aria-label="Więcej gości"
                >
                  +
                </button>
              </div>
            </div>

            {/* Domek (opcjonalnie) */}
            <div className="mb-5">
              <label className="block text-bone/40 text-[9px] tracking-widest uppercase mb-1.5">
                Domek
                <span className="ml-1 normal-case tracking-normal opacity-60">(opcjonalnie)</span>
              </label>
              <div className="relative">
                <select
                  value={cottage}
                  onChange={e => setCottage(e.target.value)}
                  className="w-full bg-transparent text-bone text-sm border-b border-bone/25 py-1.5 pr-5 focus:outline-none focus:border-bone/55 transition-colors [color-scheme:dark] cursor-pointer appearance-none"
                >
                  {COTTAGES.map(c => (
                    <option key={c.value} value={c.value} className="bg-forest text-bone">
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-0 bottom-2 text-bone/35 text-[10px] pointer-events-none">
                  ▾
                </span>
              </div>
            </div>

            <button
              type="button"
              data-open-search
              onClick={handleCheckAvailability}
              className="relative w-full bg-[#2E7D52] text-bone text-sm tracking-wide py-3 rounded-full cursor-pointer overflow-hidden group transition-transform duration-100 active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
              <span className="relative z-10 group-hover:text-[#2D6B40] transition-colors duration-150 delay-150">
                Sprawdź dostępność
              </span>
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center px-4 py-10"
          role="dialog"
          aria-modal="true"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-forest border border-bone/10 rounded-2xl p-6 sm:p-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute top-5 right-5 text-bone/50 hover:text-bone transition-colors p-1"
              aria-label="Zamknij"
            >
              <CloseIcon />
            </button>

            <p className="text-bone/40 text-[10px] tracking-[0.3em] uppercase mb-2">
              Dostępność
            </p>
            <h3 className="font-display text-bone text-2xl sm:text-3xl mb-1">
              {checkIn && checkOut ? `${checkIn} → ${checkOut}` : 'Twój termin'}
            </h3>
            <p className="text-bone/55 text-sm mb-6">
              {guests} {guests === 1 ? 'gość' : 'gości'}
              {cottage ? ` · ${COTTAGES.find(c => c.value === cottage)?.label}` : ''}
            </p>

            {searchLoading && (
              <p className="text-bone/55 text-sm py-6 text-center">Sprawdzam dostępność…</p>
            )}

            {!searchLoading && searchError && (
              <p className="text-sm text-bone bg-bone/10 border border-bone/15 rounded-xl px-4 py-3">
                {searchError}
              </p>
            )}

            {!searchLoading && !searchError && searchResults && searchResults.length === 0 && (
              <p className="text-bone/60 text-sm py-6 text-center leading-relaxed">
                Brak wolnych domków w tym terminie dla podanej liczby gości.
                <br />
                Spróbuj zmienić daty lub liczbę gości.
              </p>
            )}

            {!searchLoading && !searchError && searchResults && searchResults.length > 0 && (
              <ul className="space-y-3">
                {searchResults.map(result => (
                  <li key={result.slug}>
                    <Link
                      href={`/pl/domki/${result.slug}`}
                      className="group flex items-center gap-4 bg-bone/[0.04] hover:bg-bone/[0.08] border border-bone/10 rounded-xl p-3 transition-colors"
                    >
                      <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-forest">
                        {result.coverImage && (
                          <Image
                            src={result.coverImage}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-bone text-sm font-medium truncate">{result.namePl}</p>
                        <p className="text-bone/45 text-xs mt-0.5">
                          do {result.maxGuests} gości · min. {result.minNights}{' '}
                          {result.minNights === 1 ? 'noc' : 'noce'}
                        </p>
                      </div>
                      <span className="text-bone/40 group-hover:text-bone transition-colors text-sm flex-shrink-0">
                        Zobacz →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
