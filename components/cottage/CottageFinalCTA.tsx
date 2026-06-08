'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/booking/Calendar'
import type { SerializedBookedRange } from '@/lib/availability'
import type { Locale } from '@/lib/i18n/t'

interface Props {
  name: string
  bookedRanges: SerializedBookedRange[]
  minNights: number
  locale: Locale
}

export function CottageFinalCTA({ name, bookedRanges, minNights, locale }: Props) {
  const [range, setRange] = useState<DateRange | undefined>()
  const dateLocale = locale === 'en' ? enUS : pl

  function scrollToBooking() {
    document.getElementById('rezerwacja')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative bg-fog py-32 md:py-44 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sage text-[11px] tracking-[0.3em] uppercase mb-6 reveal">
          {locale === 'en' ? 'Book your stay' : 'Zarezerwuj pobyt'}
        </p>
        <h2
          className="font-display text-charcoal leading-[0.9] mb-16 reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          {locale === 'en' ? (
            <>
              Find your <em>dates.</em>
            </>
          ) : (
            <>
              Znajdź swój <em>termin.</em>
            </>
          )}
        </h2>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start reveal-d2">
          <div className="bg-bone border border-charcoal/10 p-6">
            <Calendar bookedRanges={bookedRanges} minNights={minNights} locale={locale} onRangeSelect={setRange} />
          </div>

          <div className="bg-bone border border-charcoal/10 p-6 flex flex-col h-full">
            <p className="text-charcoal/40 text-[10px] tracking-[0.3em] uppercase mb-5">{name}</p>

            {range?.from && range?.to ? (
              <p className="text-charcoal text-sm mb-8 leading-relaxed">
                {format(range.from, 'd MMM', { locale: dateLocale })}
                {' — '}
                {format(range.to, 'd MMM yyyy', { locale: dateLocale })}
              </p>
            ) : (
              <p className="text-charcoal/45 text-sm mb-8 leading-relaxed">
                {locale === 'en'
                  ? 'Pick your dates in the calendar to continue.'
                  : 'Wybierz daty w kalendarzu, aby przejść dalej.'}
              </p>
            )}

            <button
              type="button"
              onClick={scrollToBooking}
              className="relative mt-auto w-full bg-forest text-bone text-sm tracking-wide py-3 rounded-full cursor-pointer overflow-hidden group transition-transform duration-100 active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
              <span className="relative z-10 group-hover:text-forest transition-colors duration-150 delay-150">
                {locale === 'en' ? 'Book this cottage' : 'Zarezerwuj ten domek'}
              </span>
            </button>
          </div>
        </div>

        <p className="mt-16 text-charcoal/40 text-sm reveal">
          {locale === 'en' ? 'Questions?' : 'Masz pytania?'}{' '}
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
