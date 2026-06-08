'use client'

import dynamic from 'next/dynamic'

const distances = [
  { place: 'Zakliczyn', dist: '8 km' },
  { place: 'Zamek Wiśnicz', dist: '30 km' },
  { place: 'Kopalnia Soli Bochnia', dist: '39 km' },
  { place: 'Tarnów', dist: '40 km' },
  { place: 'Kraków', dist: '90 km' },
  { place: 'Lotnisko KRK', dist: '93 km' },
]

const LocationMap = dynamic(
  () => import('./LocationMap').then((m) => m.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl bg-mist/30 animate-pulse"
        style={{ height: 420 }}
      />
    ),
  },
)

export function Location() {
  return (
    <section id="lokalizacja" className="bg-fog py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Main grid: editorial + map */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start mb-16">

          {/* Left — editorial */}
          <div className="reveal">
            <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-6">Gdzie jesteśmy</p>
            <h2
              className="font-display text-charcoal leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Dolina Dunajca,<br />
              <em className="text-sage">Małopolska.</em>
            </h2>
            <p className="text-charcoal/60 leading-relaxed text-[15px] mb-6">
              Nasze domki leżą na wzgórzach nad Doliną Dunajca — między Zakliczyniem a Paleśnicą.
              Cisza, zieleń, widoki na rzekę. Daleko od tras turystycznych, blisko wszystkiego,
              co warto zobaczyć w Małopolsce.
            </p>
            <p className="text-charcoal/40 text-[13px]">
              Kliknij pinezkę na mapie, żeby zobaczyć dostępne domki w danej lokalizacji.
            </p>
          </div>

          {/* Right — interactive map */}
          <div className="reveal-d1">
            <LocationMap />
          </div>

        </div>

        {/* Distances strip */}
        <div className="border-t border-mist pt-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-5">Odległości</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {distances.map(({ place, dist }) => (
              <li key={place} className="flex items-center gap-2.5">
                <span className="text-sm text-charcoal/55">{place}</span>
                <span className="text-sm font-medium text-charcoal tabular-nums">{dist}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
