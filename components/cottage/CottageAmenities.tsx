import { pickText, type LocalizedText } from '@/lib/cottages-data'
import type { Locale } from '@/lib/i18n/t'

interface Props {
  amenities: LocalizedText[]
  locale: Locale
}

const HIGHLIGHT_COUNT = 3

export function CottageAmenities({ amenities, locale }: Props) {
  const highlights = amenities.slice(0, HIGHLIGHT_COUNT)
  const included = amenities.slice(HIGHLIGHT_COUNT)
  const isPl = locale === 'pl'

  return (
    <section className="bg-fog py-32 md:py-44">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-6 reveal">
          {isPl ? 'Czego inni szukają tygodniami' : 'What others spend weeks searching for'}
        </p>
        <h2
          className="font-display text-charcoal mb-6 reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {isPl ? 'Tu już na to trafiłeś.' : 'You already found it.'}
        </h2>
        <p className="text-charcoal/55 leading-relaxed max-w-xl mb-20 reveal-d1" style={{ maxWidth: '56ch' }}>
          {isPl
            ? 'To, co goście wymieniają najczęściej w pierwszej wiadomości po przyjeździe — i to, co po prostu jest, gdy tylko przekroczysz próg.'
            : 'The things guests mention first in their arrival messages — and the things that are simply there the moment you walk in.'}
        </p>

        {/* Signature highlights — dark cards that pull focus, the differentiators given room to breathe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 reveal">
          {highlights.map((item, i) => (
            <div key={i} className="bg-charcoal px-7 py-9 sm:px-8 sm:py-10 flex flex-col gap-6">
              <span
                className="font-display text-bone/30 tabular-nums leading-none"
                style={{ fontSize: '1.8rem', fontWeight: 300 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[17px] sm:text-[18px] text-bone tracking-wide leading-snug font-medium">
                {pickText(locale, item)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-sage font-medium tracking-wide mb-16 reveal">
          {isPl ? '— rzadkość w promieniu kilkudziesięciu kilometrów' : '— a rarity for miles around'}
        </p>

        {/* Everything else — framed as a generous given, not a feature list */}
        {included.length > 0 && (
          <div className="border-t-2 border-charcoal/15 pt-12 reveal-d1">
            <p className="text-[12px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-8">
              {isPl
                ? `i jeszcze ${included.length} rzeczy, o które nie musisz się martwić`
                : `plus ${included.length} more things you won't have to think about`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
              {included.map((item, i) => (
                <div key={i} className="flex items-baseline gap-4">
                  <span className="text-pine shrink-0 leading-none font-semibold" style={{ fontSize: '1rem' }}>
                    ✓
                  </span>
                  <span className="text-[15px] text-charcoal tracking-wide">{pickText(locale, item)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
