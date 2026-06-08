'use client'

import dynamic from 'next/dynamic'
import { pickText, type CottageContent } from '@/lib/cottages-data'
import type { Locale } from '@/lib/i18n/t'

interface Props {
  location: CottageContent['location']
  locale: Locale
}

const CottageLocationMap = dynamic(
  () => import('./CottageLocationMap').then((m) => m.CottageLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-2xl bg-mist/30 animate-pulse" style={{ height: 420 }} />
    ),
  },
)

export function CottageLocation({ location, locale }: Props) {
  const name = pickText(locale, location.name)
  const [headline, region] = name.split(',').map((s) => s.trim())

  return (
    <section id="lokalizacja" className="bg-fog py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start mb-16">
          <div className="reveal">
            <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-6">
              {locale === 'en' ? 'Where you are' : 'Gdzie jesteś'}
            </p>
            <h2
              className="font-display text-charcoal leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              {headline}
              {region && (
                <>
                  ,<br />
                  <em className="text-sage">{region}.</em>
                </>
              )}
            </h2>
            <p className="text-charcoal/60 leading-relaxed text-[15px]">
              {pickText(locale, location.description)}
            </p>
          </div>

          <div className="reveal-d1">
            <CottageLocationMap lat={location.coords.lat} lng={location.coords.lng} label={name} />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.coords.lat},${location.coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-charcoal hover:text-sage transition-colors"
            >
              {locale === 'en' ? 'Get directions in Google Maps' : 'Wyznacz trasę w Google Maps'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-mist pt-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-5">
            {locale === 'en' ? 'Distances' : 'Odległości'}
          </p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {location.distances.map(({ place, dist }) => (
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
