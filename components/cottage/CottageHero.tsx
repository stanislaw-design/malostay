'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Locale } from '@/lib/i18n/t'
import { pickText, type CottageContent } from '@/lib/cottages-data'

interface Props {
  cottage: CottageContent
  name: string
  locale: Locale
}

const easeOut = [0.22, 0.97, 0.34, 1] as [number, number, number, number]

export function CottageHero({ cottage, name, locale }: Props) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
      <Image
        src={cottage.heroImage}
        alt=""
        fill
        priority
        quality={90}
        className="object-cover"
        style={{ objectPosition: 'center 60%' }}
      />

      <div className="absolute inset-0 bg-forest/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 62%, rgba(28,35,32,0.4) 0%, transparent 70%)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-56 bg-gradient-to-b from-forest/55 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-forest/45 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 lg:px-10 pb-16 lg:pb-24 pt-40">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
          className="text-[11px] tracking-[0.32em] uppercase text-sage mb-6"
        >
          {pickText(locale, cottage.eyebrow)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
          className="font-display text-bone leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.32 }}
          className="font-display italic text-bone/75 leading-snug mb-10 max-w-xl"
          style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)' }}
        >
          {pickText(locale, cottage.tagline)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.44 }}
          className="flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href="#rezerwacja"
            className="relative inline-flex items-center text-sm font-medium px-6 py-2.5 border border-bone text-bone rounded-full overflow-hidden group transition-transform duration-100 active:scale-[0.97]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
            <span className="relative z-10 group-hover:text-forest transition-colors duration-150 delay-150">
              {locale === 'en' ? 'Check availability ↓' : 'Sprawdź dostępność ↓'}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span className="text-sage text-sm">★</span>
            <span className="text-sm text-bone/70">
              <strong className="text-bone font-medium">{cottage.bookingScore}</strong>
              <span className="text-bone/50">
                {' '}
                · {cottage.bookingReviewCount} {locale === 'en' ? 'reviews' : 'opinii'} · Booking.com
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
