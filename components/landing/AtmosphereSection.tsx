const blocks = [
  {
    image: { seed: 'valley-window', alt: 'Panoramiczny widok na Dolinę Dunajca przez okno salonu' },
    imageLeft: true,
    label: 'Widok',
    title: 'Widok, który zostaje w pamięci.',
    body: 'Panoramiczne okna w salonie wychodzą prosto na dolinę. Mgła, która rano opada między wzgórzami. Kolory jesieni odbite w tafli rzeki. Tu nie musisz szukać widoku — on sam do Ciebie przychodzi.',
  },
  {
    image: { seed: 'cabin-fireplace', alt: 'Kryty taras domku o zmierzchu z widokiem na Pieniny' },
    imageLeft: false,
    label: 'Spokój',
    title: 'Ranek na tarasie. Wieczór przy kominku.',
    body: 'Kryty taras z widokiem to miejsce, do którego będziesz wracać. Kawa o wschodzie słońca. Kolacja z panoramą Pienin. A kiedy zrobi się chłodniej — kominek w salonie czeka gotowy.',
  },
]

export function AtmosphereSection() {
  return (
    <section className="bg-bone overflow-hidden">
      {blocks.map((block, i) => (
        <div
          key={i}
          className={`grid grid-cols-1 md:grid-cols-2 ${
            block.imageLeft ? '' : 'md:[direction:rtl]'
          }`}
        >
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[72vh] overflow-hidden bg-mist">
            <img
              src={`https://picsum.photos/seed/${block.image.seed}/1000/750`}
              alt={block.image.alt}
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-1000"
              style={{ direction: 'ltr' }}
            />
          </div>

          {/* Text */}
          <div
            className="flex items-center px-8 py-20 md:px-16 md:py-32 lg:px-20"
            style={{ direction: 'ltr' }}
          >
            <div className="max-w-md reveal">
              <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-7">{block.label}</p>
              <h3
                className="font-display italic text-charcoal leading-[0.94] mb-8"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}
              >
                {block.title}
              </h3>
              <p className="text-charcoal/60 leading-relaxed text-[15px]">{block.body}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
