'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

type CottageItem = {
  slug: string
  name: string
  parentName?: string
  label?: string
  area?: string
  guests: number
  bedrooms: number
  tags: string[]
  description: string
  score: string
  reviews: number
  address: string
  imgSrc?: string
  imgSeed?: string
}

const allCottages: CottageItem[] = [
  {
    slug: 'domek-nad-dolina',
    name: 'Domek nad Doliną Dunajca',
    area: '70 m²',
    guests: 6,
    bedrooms: 1,
    tags: ['Sauna & Jacuzzi', 'Balkon z widokiem na rzekę', 'Prywatny taras'],
    description:
      'Panoramiczne okna wychodzą prosto na dolinę. Budzisz się z kawą i widokiem na rzekę, wieczorem — jacuzzi i cisza przerywana wiatrem.',
    score: '9.8',
    reviews: 129,
    address: 'Dolina Dunajca, Małopolska',
    imgSrc: '/nad-dolina-dunajca/jaccuzi-zachod.webp',
  },
  {
    slug: 'drewniany-domek',
    name: 'Drewniany Domek nad Doliną Dunajca',
    area: '70 m²',
    guests: 6,
    bedrooms: 2,
    tags: ['Sauna & Jacuzzi', 'Drewniana konstrukcja', 'Kominek w salonie'],
    description:
      'Ciepło prawdziwego drewna i dwie osobne sypialnie. Ten sam widok na dolinę, ten sam dostęp do SPA — z rustykalnym charakterem.',
    score: '9.7',
    reviews: 78,
    address: 'Dolina Dunajca, Małopolska',
    imgSrc: '/drewniany-nad-dolina-dunajca/domek.webp',
  },
  {
    slug: 'dom-w-zawadzie-a',
    name: 'Dom w Zawadzie Lanckorońskiej',
    parentName: 'Dom w Zawadzie Lanckorońskiej',
    label: 'Lokal 4 os.',
    guests: 4,
    bedrooms: 2,
    tags: ['Własne wejście', 'Pełna kuchnia', 'Piękny ogród'],
    description:
      'Spokojny wariant dla 4 osób z własnym wejściem i pełnym wyposażeniem. Cisza Zawady, przestronny ogród, kuchnia gotowa na dłuższy pobyt.',
    score: '9.7',
    reviews: 36,
    address: 'Zawada Lanckorońska, Małopolska',
    imgSrc: '/zawada-lancronska/domek1.webp',
  },
  {
    slug: 'dom-w-zawadzie-b',
    name: 'Dom w Zawadzie Lanckorońskiej',
    parentName: 'Dom w Zawadzie Lanckorońskiej',
    label: 'Lokal 6 os.',
    guests: 6,
    bedrooms: 3,
    tags: ['Własne wejście', 'Pełna kuchnia', 'Piękny ogród'],
    description:
      'Większy wariant dla 6 osób z trzema sypialniami. Ta sama spokojność, więcej przestrzeni dla rodziny lub dwóch par.',
    score: '9.7',
    reviews: 36,
    address: 'Zawada Lanckorońska, Małopolska',
    imgSrc: '/zawada-lancronska/sypialnia2.webp',
  },
  {
    slug: 'dom-na-wzgorzu',
    name: 'Dom na Borówkowym Wzgórzu',
    area: '100 m²',
    guests: 8,
    bedrooms: 2,
    tags: ['Plac zabaw dla dzieci', 'Ogrodzony teren', 'Altana z grillem'],
    description:
      'Największy z domków, schowany na wzgórzu w Paleśnicy. Całkowita cisza, przestronny ogród, altana i plac zabaw — idealny dla rodzin.',
    score: '10.0',
    reviews: 31,
    address: 'Paleśnica, Małopolska',
    imgSrc: '/domek4/dom-zewnatrz.webp',
  },
]

const easeOut = [0.22, 0.97, 0.34, 1] as [number, number, number, number]
const easeIn = [0.4, 0, 1, 1] as [number, number, number, number]


function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 mt-[3px] text-sage"
      aria-hidden
    >
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function bedroomLabel(n: number) {
  if (n === 1) return '1 sypialnia'
  if (n < 5) return `${n} sypialnie`
  return `${n} sypialni`
}

/* ─── Desktop left panel ──────────────────────────────────────────────────── */

function DesktopPanel({ cottage, direction }: { cottage: CottageItem; direction: number }) {
  const controls = useAnimation()
  const [c, setC] = useState<CottageItem>(cottage)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    let active = true
      ; (async () => {
        await controls.start({ opacity: 0, y: direction * -16, transition: { duration: 0.22, ease: easeIn } })
        if (!active) return
        setC(cottage)
        controls.set({ opacity: 0, y: direction * 16 })
        controls.start({ opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } })
      })()
    return () => { active = false; controls.stop() }
  }, [cottage.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div animate={controls} initial={{ opacity: 1, y: 0 }} className="flex flex-col">
      {c.parentName && (
        <div className="flex items-center gap-2.5 mb-4">
          <p className="text-[10px] tracking-[0.28em] uppercase text-sage">{c.parentName}</p>
          <span className="text-[9px] font-semibold border border-sage/40 text-sage px-2 py-0.5 rounded-full">
            {c.guests} os.
          </span>
        </div>
      )}

      {c.parentName ? (
        <p className="text-[13px] font-semibold tracking-wide text-charcoal/75 mb-5">
          {c.guests} os. · {bedroomLabel(c.bedrooms)}
        </p>
      ) : (
        <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-5">
          {c.area} · {c.guests} os. · {bedroomLabel(c.bedrooms)}
        </p>
      )}

      <h3
        className="font-display italic text-charcoal leading-[0.88] mb-5"
        style={{ fontSize: 'clamp(1.9rem, 2.8vw, 3rem)' }}
      >
        {c.name}
      </h3>

      <p className="text-charcoal/60 text-[15px] leading-relaxed mb-8 max-w-sm">{c.description}</p>

      <ul className="flex flex-col gap-3 mb-10">
        {c.tags.map((tag) => (
          <li key={tag} className="flex items-start gap-3 text-[14px] text-charcoal/70">
            <CheckIcon />
            {tag}
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-charcoal/40 uppercase mb-5">
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden className="shrink-0">
          <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5Zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
        </svg>
        {c.address}
      </p>

      <div className="flex flex-wrap items-center gap-5">
        <a
          href={`/pl/domki/${c.slug}`}
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-forest text-bone text-sm tracking-wide hover:bg-charcoal transition-colors duration-200"
        >
          Sprawdź termin
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="ml-1.5">
            <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] tracking-[0.12em] uppercase text-charcoal/35">Booking.com</span>
          <span className="text-sm font-medium text-charcoal">
            {c.score}{' '}
            <span className="font-normal text-charcoal/40">· {c.reviews} opinii</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Mobile card ─────────────────────────────────────────────────────────── */

function MobileCard({ cottage }: { cottage: CottageItem }) {
  const imgSrc = cottage.imgSrc ?? `https://picsum.photos/seed/${cottage.imgSeed}/800/600`

  return (
    <div className="bg-bone rounded-2xl overflow-hidden">
      {/* Image — padded, rounded */}
      <div className="p-3 pb-0">
        <div className="rounded-xl overflow-hidden aspect-[4/3]">
          <img src={imgSrc} alt={cottage.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 pb-7">
        {cottage.parentName ? (
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[9px] tracking-[0.28em] uppercase text-sage">
              {cottage.parentName}
            </p>
            <span className="text-[8px] font-semibold border border-sage/40 text-sage px-1.5 py-0.5 rounded-full">
              {cottage.guests} os.
            </span>
          </div>
        ) : null}

        {cottage.parentName ? (
          <p className="text-[13px] font-semibold tracking-wide text-charcoal/75 mb-4">
            {cottage.guests} os. · {bedroomLabel(cottage.bedrooms)}
          </p>
        ) : (
          <p className="text-[9px] tracking-[0.3em] uppercase text-sage mb-4">
            {cottage.area} · {cottage.guests} os. · {bedroomLabel(cottage.bedrooms)}
          </p>
        )}

        <h3
          className="font-display italic text-charcoal leading-[0.9] mb-4"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 1.75rem)' }}
        >
          {cottage.name}
        </h3>

        <p className="text-charcoal/55 text-[13px] leading-relaxed mb-6">{cottage.description}</p>

        <ul className="flex flex-col gap-2.5 mb-8">
          {cottage.tags.map((tag) => (
            <li key={tag} className="flex items-start gap-2.5 text-[13px] text-charcoal/70">
              <CheckIcon />
              {tag}
            </li>
          ))}
        </ul>

        <p className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-charcoal/40 uppercase mb-5">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden className="shrink-0">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5Zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
          </svg>
          {cottage.address}
        </p>

        <div className="flex items-center justify-between">
          <a
            href={`/pl/domki/${cottage.slug}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-forest text-bone text-sm tracking-wide hover:bg-charcoal transition-colors duration-200"
          >
            Sprawdź termin
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="ml-1.5">
              <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-[0.12em] uppercase text-charcoal/30">Booking</span>
            <span className="text-sm font-medium text-charcoal">
              {cottage.score}{' '}
              <span className="font-normal text-charcoal/35 text-xs">· {cottage.reviews}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ─────────────────────────────────────────────────────────── */

export function CottageFeatured() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const prevIndexRef = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ index: number; dir: number } | null>(null)

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const rect = scrollContainerRef.current.getBoundingClientRect()
    const scrolled = Math.max(0, -rect.top)
    const newIndex = Math.min(
      Math.round(scrolled / window.innerHeight),
      allCottages.length - 1,
    )
    if (newIndex === prevIndexRef.current) return

    const dir = newIndex > prevIndexRef.current ? 1 : -1
    prevIndexRef.current = newIndex
    pendingRef.current = { index: newIndex, dir }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        setDirection(pendingRef.current.dir)
        setActiveIndex(pendingRef.current.index)
        pendingRef.current = null
      }
    }, 100)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [handleScroll])

  const cottage = allCottages[activeIndex]

  return (
    <section id="domki" className="bg-fog">
      {/* Section header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-12 lg:pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
          className="font-display text-charcoal leading-[0.88] mb-4"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
        >
          Nasze domki
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.13 }}
          className="font-semibold italic text-sage text-xl"
        >
          Każdy z charakterem. Każdy z widokiem.
        </motion.p>
      </div>

      {/* ── Desktop: sticky scroll ─────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="hidden lg:block relative"
        style={{ height: `${allCottages.length * 100}vh` }}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] flex overflow-hidden">
          {/* Left: text */}
          <div className="w-[44%] flex flex-col justify-center px-12 xl:px-20 relative overflow-hidden">
            <DesktopPanel cottage={cottage} direction={direction} />

            {/* Progress dots */}
            <div className="absolute bottom-10 left-12 xl:left-20 flex items-center gap-2">
              {allCottages.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] rounded-full transition-all duration-400 bg-charcoal/25"
                  style={{
                    width: i === activeIndex ? '20px' : '6px',
                    backgroundColor: i === activeIndex ? 'var(--color-charcoal)' : undefined,
                    opacity: i === activeIndex ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="w-px bg-charcoal/10 self-stretch my-10" />

          {/* Right: image — all images pre-rendered, CSS transition for guaranteed smoothness */}
          <div className="w-[56%] relative bg-fog">
            <div className="absolute inset-12 rounded-2xl overflow-hidden">
              {allCottages.map((c, i) => (
                <img
                  key={c.slug}
                  src={c.imgSrc ?? `https://picsum.photos/seed/${c.imgSeed}/1400/1050`}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform: `scale(${i === activeIndex ? 1 : 0.96})`,
                    transition: 'opacity 0.55s cubic-bezier(0.22,0.97,0.34,1), transform 0.55s cubic-bezier(0.22,0.97,0.34,1)',
                    willChange: 'opacity, transform',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: cards ─────────────────────────────────────────────────── */}
      <div className="lg:hidden px-5 pb-20 flex flex-col gap-4">
        {allCottages.map((c) => (
          <MobileCard key={c.slug} cottage={c} />
        ))}
      </div>
    </section>
  )
}
