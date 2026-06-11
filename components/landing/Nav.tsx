'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const domkiList = [
  {
    slug: 'domek-nad-dolina',
    name: 'Domek nad Doliną Dunajca',
    imgSrc: '/nad-dolina-dunajca/jaccuzi-zachod.webp',
  },
  {
    slug: 'drewniany-domek',
    name: 'Drewniany Domek nad Doliną Dunajca',
    imgSrc: '/drewniany-nad-dolina-dunajca/domek-front-dzien.webp',
  },
  {
    slug: 'dom-w-zawadzie-a',
    name: 'Dom w Zawadzie Lanckorońskiej',
    label: 'Lokal 4 os.',
    imgSrc: '/zawada-lancronska/domek1.webp',
  },
  {
    slug: 'dom-w-zawadzie-b',
    name: 'Dom w Zawadzie Lanckorońskiej',
    label: 'Lokal 6 os.',
    imgSrc: '/zawada-lancronska/sypialnia2.webp',
  },
  {
    slug: 'dom-na-wzgorzu',
    name: 'Dom na Borówkowym Wzgórzu',
    imgSrc: '/domek-borowkowe-wzgorze/domek-front-dzien.webp',
  },
]

const easeOut = [0.22, 0.97, 0.34, 1] as [number, number, number, number]
const easeIn = [0.4, 0, 1, 1] as [number, number, number, number]

const panelVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: easeOut,
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.16, ease: easeIn },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [domkiOpen, setDomkiOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 72)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openDomki = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDomkiOpen(true)
  }

  const closeDomki = () => {
    closeTimer.current = setTimeout(() => setDomkiOpen(false), 90)
  }

  const linkClass = `text-sm tracking-wide transition-colors hover:text-[#2E7D52] ${scrolled ? 'text-charcoal' : 'text-bone/80'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bone/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo-poziome.png"
            alt="Malo Stay"
            width={130}
            height={52}
            className={`transition-all duration-300 ${scrolled ? 'brightness-0' : 'brightness-100'}`}
            style={{ height: 'auto' }}
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">

          {/* Domki — dropdown on hover */}
          <div
            className="relative h-16 flex items-center"
            onMouseEnter={openDomki}
            onMouseLeave={closeDomki}
          >
            <a
              href="#domki"
              className={`flex items-center gap-1 ${linkClass}`}
            >
              Domki
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden
                className={`transition-transform duration-200 ${domkiOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <AnimatePresence>
              {domkiOpen && (
                <motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full -left-4 w-72 bg-bone border border-charcoal/10 rounded-2xl shadow-xl shadow-charcoal/10 overflow-hidden"
                >
                  <div className="py-2">
                    {domkiList.map((cottage) => (
                      <motion.a
                        key={cottage.slug}
                        href={`/pl/domki/${cottage.slug}`}
                        variants={itemVariants}
                        className="group flex items-center gap-3.5 px-4 py-3 hover:bg-fog transition-colors duration-150"
                      >
                        <div className="w-[70px] h-[52px] rounded-xl overflow-hidden shrink-0">
                          <img
                            src={cottage.imgSrc}
                            alt={cottage.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0">
                          {'label' in cottage && (cottage as { label?: string }).label && (
                            <p className="text-[9px] tracking-[0.22em] uppercase text-sage mb-0.5">
                              {(cottage as { label?: string }).label}
                            </p>
                          )}
                          <p className="text-[13px] font-medium text-charcoal leading-snug group-hover:text-forest transition-colors duration-150 line-clamp-2">
                            {cottage.name}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                  <div className="border-t border-charcoal/8 px-4 py-3">
                    <a
                      href="#domki"
                      className="flex items-center gap-1.5 text-[11px] tracking-wide text-sage hover:text-forest transition-colors"
                    >
                      Zobacz wszystkie
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path
                          d="M2 8L8 2M8 2H3.5M8 2V6.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#galeria" className={linkClass}>Galeria</a>
          <a href="#kontakt" className={linkClass}>Kontakt</a>

          <a
            href="#domki"
            className={`relative text-sm font-medium px-5 py-2 border rounded-full overflow-hidden group transition-transform duration-100 active:scale-[0.97] ${scrolled ? 'border-[#2E7D52] text-[#2E7D52]' : 'border-bone text-bone'
              }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-0 [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'bg-[#2E7D52]' : 'bg-bone'
                }`}
            />
            <span
              className={`relative z-10 transition-colors duration-150 delay-150 ${scrolled ? 'group-hover:text-bone' : 'group-hover:text-forest'
                }`}
            >
              Zarezerwuj
            </span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 transition-colors ${scrolled ? 'text-charcoal' : 'text-bone'}`}
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span
              className={`block w-full h-[2px] bg-current transition-transform duration-300 origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
            />
            <span
              className={`block w-full h-[2px] bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''
                }`}
            />
            <span
              className={`block w-full h-[2px] bg-current transition-transform duration-300 origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'
          } bg-bone/98 backdrop-blur-md`}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {[
            { href: '#domki', label: 'Domki' },
            { href: '#galeria', label: 'Galeria' },
            { href: '#kontakt', label: 'Kontakt' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-charcoal tracking-wide hover:text-[#2E7D52] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#domki"
            onClick={() => setMenuOpen(false)}
            className="relative text-sm font-medium px-5 py-2.5 border border-[#2E7D52] text-[#2E7D52] text-center rounded-full overflow-hidden group transition-transform duration-100 active:scale-[0.97]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[#2E7D52] [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
            <span className="relative z-10 group-hover:text-bone transition-colors duration-150 delay-150">
              Zarezerwuj
            </span>
          </a>
        </nav>
      </div>
    </header>
  )
}
