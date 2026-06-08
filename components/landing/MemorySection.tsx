'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const quotes = [
  {
    text: 'Dokładnie tego potrzebowaliśmy.',
    author: 'Marta W. · Kraków',
    avatar: 'https://i.pravatar.cc/80?img=5',
    posClass: 'top-[10%] left-[24%]',
    alignRight: false,
  },
  {
    text: 'Cisza była najlepszą częścią wyjazdu.',
    author: 'Tomek i Ola · Wrocław',
    avatar: 'https://i.pravatar.cc/80?img=44',
    posClass: 'top-[10%] right-[24%]',
    alignRight: true,
  },
  {
    text: 'Tu czas płynął zupełnie inaczej.',
    author: 'Marek R. · Warszawa',
    avatar: 'https://i.pravatar.cc/80?img=12',
    posClass: 'bottom-[12%] left-[24%]',
    alignRight: false,
  },
  {
    text: 'Obudzić się z tym widokiem — bezcenne.',
    author: 'Rodzina Nowak · Gdańsk',
    avatar: 'https://i.pravatar.cc/80?img=32',
    posClass: 'bottom-[12%] right-[24%]',
    alignRight: true,
  },
]

export function MemorySection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [160, -160])
  const y2 = useTransform(scrollYProgress, [0, 1], [120, -120])

  return (
    <section ref={sectionRef} className="relative bg-fog overflow-hidden">

      {/* ── Mobile layout ── */}
      <div className="md:hidden flex flex-col items-center py-28 px-6 gap-12">
        <div className="text-center reveal">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-6">
            Wspomnienia gości
          </p>
          <h2
            className="font-display italic text-charcoal leading-[0.92]"
            style={{ fontSize: 'clamp(3rem, 14vw, 5.5rem)' }}
          >
            Wspomnienie<br />które zostaje
          </h2>
        </div>
        <div className="flex flex-col gap-8 w-full max-w-sm">
          {quotes.slice(0, 3).map((q, i) => (
            <div key={i} className="flex items-start gap-3">
              <img
                src={q.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-display italic text-charcoal/65 text-[1rem] leading-snug">
                  &ldquo;{q.text}&rdquo;
                </p>
                <p className="text-[11px] text-charcoal/38 mt-1">{q.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div
        className="hidden md:block relative"
        style={{ height: '130svh', minHeight: '900px' }}
      >
        {/* Centered headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none px-6 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-8">
            Wspomnienia gości
          </p>
          <h2
            className="font-display italic text-charcoal leading-[0.88]"
            style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)' }}
          >
            Wspomnienie<br />które zostaje
          </h2>
        </div>

        {/* Photo 1 — top-left, parallax upward */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[22%] left-[4%] w-[19vw] max-w-[290px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-[3deg]"
        >
          <img
            src="/nad-dolina-dunajca/domek-noc.webp"
            alt="Domek nad Doliną Dunajca nocą"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Photo 2 — right side, parallax downward */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[35%] right-[4%] w-[18vw] max-w-[270px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-[2deg]"
        >
          <img
            src="/nad-dolina-dunajca/jaccuzi-zachod.webp"
            alt="Jacuzzi o zachodzie słońca nad doliną"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating quotes */}
        {quotes.map((q, i) => (
          <div
            key={i}
            className={`absolute ${q.posClass} z-20 max-w-[230px] ${q.alignRight ? 'text-right' : ''}`}
          >
            <div className={`flex items-start gap-3 ${q.alignRight ? 'flex-row-reverse' : ''}`}>
              <img
                src={q.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-fog"
              />
              <div>
                <span className="block font-display text-charcoal/25 text-3xl leading-none -mb-1 select-none">
                  &ldquo;
                </span>
                <p
                  className="font-display italic text-charcoal/60 leading-snug"
                  style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}
                >
                  {q.text}
                </p>
                <p className="text-[11px] text-charcoal/35 mt-2">{q.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
