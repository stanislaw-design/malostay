const amenities = [
  'WiFi bezpłatne',
  'Kuchnia wyposażona',
  'Smart TV',
  'Kominek',
  'Taras z widokiem',
  'Grill / BBQ',
  'Parking gratis',
  'Pościel i ręczniki',
]

export function Amenities() {
  return (
    <section className="bg-fog py-32 md:py-44">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-6 reveal">Co znajdziesz</p>
        <h2
          className="font-display text-charcoal mb-16 reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          Wszystko, czego potrzebujesz.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-mist/60">
          {amenities.map((item, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-7 py-5 border-b border-mist/60 reveal ${
                i % 2 === 0 ? 'sm:border-r sm:pr-14' : 'sm:pl-14'
              }`}
            >
              <span
                className="font-display text-pine/50 shrink-0 tabular-nums leading-none"
                style={{ fontSize: '1.4rem', fontWeight: 300 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14px] text-charcoal/75 tracking-wide">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
