const reviews = [
  {
    text: 'Magiczne miejsce. Widok z okna salonu sprawia, że nie chce się wychodzić. Wrócimy na pewno — może już zimą.',
    author: 'Katarzyna M.',
    location: 'Kraków',
    month: 'lipiec 2025',
    featured: true,
  },
  {
    text: 'Domek w 100% taki jak na zdjęciach — czysty, dobrze wyposażony, z cudownym widokiem. Idealny reset po intensywnym roku.',
    author: 'Paweł i Ania',
    location: 'Warszawa',
    month: 'grudzień 2025',
    featured: false,
  },
  {
    text: 'Przyjechaliśmy z całą rodziną — 6 osób, wszyscy zachwyceni. Dzieci bawiły się na tarasie, my odpoczywaliśmy. Nic więcej nie potrzeba.',
    author: 'Rodzina Kowalskich',
    location: 'Wrocław',
    month: 'sierpień 2025',
    featured: false,
  },
]

export function Reviews() {
  const [featured, ...rest] = reviews

  return (
    <section className="bg-fog py-32 md:py-44">
      <div className="max-w-4xl mx-auto px-6">

        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-16 text-center reveal">
          Opinie gości
        </p>

        {/* Featured pull-quote */}
        <blockquote className="text-center mb-20 reveal-d1">
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-pine text-sm">★</span>
            ))}
          </div>
          <p
            className="font-display italic text-charcoal leading-[1.08] mb-10 mx-auto"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.7rem)', maxWidth: '720px' }}
          >
            &ldquo;{featured.text}&rdquo;
          </p>
          <footer>
            <div className="w-8 h-px bg-mist mx-auto mb-6" />
            <p className="text-sm text-charcoal/45">
              {featured.author}&ensp;&middot;&ensp;{featured.location}&ensp;&middot;&ensp;Booking.com ✓
            </p>
          </footer>
        </blockquote>

        {/* Supporting testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-mist/50 pt-16">
          {rest.map((r, i) => (
            <div key={i} className={i === 0 ? 'reveal' : 'reveal-d1'}>
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-pine text-xs">★</span>
                ))}
              </div>
              <p
                className="font-display italic text-charcoal/75 leading-relaxed mb-6"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
              >
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-xs text-charcoal/38">
                {r.author}&ensp;&middot;&ensp;{r.location}&ensp;&middot;&ensp;{r.month}&ensp;&middot;&ensp;Booking.com ✓
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-xs text-charcoal/38">
          Średnia ocena <strong className="text-charcoal/60 font-normal">4.9 / 5</strong> na podstawie 47 opinii
        </p>
      </div>
    </section>
  )
}
