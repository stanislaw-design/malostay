'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { pickText, type CottagePhoto } from '@/lib/cottages-data'
import type { Locale } from '@/lib/i18n/t'

interface Props {
  photos: CottagePhoto[]
  locale: Locale
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}>
      <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CottageGallery({ photos, locale }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, prev, next])

  const openPhoto = openIndex !== null ? photos[openIndex] : null

  return (
    <section id="galeria" className="bg-charcoal pt-24 md:pt-32 pb-1">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-5 reveal">
          {locale === 'en' ? 'A look inside' : 'Zajrzyj do środka'}
        </p>
        <h2
          className="font-display text-bone reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {locale === 'en' ? 'Gallery.' : 'Galeria.'}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative overflow-hidden bg-forest aspect-[3/4] reveal cursor-zoom-in"
            aria-label={locale === 'en' ? `Open photo: ${pickText(locale, photo.alt)}` : `Otwórz zdjęcie: ${pickText(locale, photo.alt)}`}
          >
            <Image
              src={photo.src}
              alt={pickText(locale, photo.alt)}
              fill
              priority={i < 3}
              quality={70}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </button>
        ))}
      </div>

      {openPhoto && (
        <div
          className="fixed inset-0 z-50 bg-forest/96 backdrop-blur-sm flex items-center justify-center px-4 md:px-20 py-10"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close() }}
            className="absolute top-6 right-6 text-bone/60 hover:text-bone transition-colors p-2"
            aria-label={locale === 'en' ? 'Close gallery' : 'Zamknij galerię'}
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition-colors p-3"
            aria-label={locale === 'en' ? 'Previous photo' : 'Poprzednie zdjęcie'}
          >
            <ArrowIcon direction="left" />
          </button>

          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full" style={{ height: '78vh' }}>
              <Image
                src={openPhoto.src}
                alt={pickText(locale, openPhoto.alt)}
                fill
                quality={85}
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="text-bone/50 text-[13px] tracking-wide text-center mt-5">
              {pickText(locale, openPhoto.alt)}
              <span className="text-bone/30"> · {(openIndex ?? 0) + 1} / {photos.length}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition-colors p-3"
            aria-label={locale === 'en' ? 'Next photo' : 'Następne zdjęcie'}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      )}
    </section>
  )
}
