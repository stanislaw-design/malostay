'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cottages, pickText, type CottagePhoto } from '@/lib/cottages-data'

interface GalleryGroup {
  slug: string
  name: string
  photos: CottagePhoto[]
}

function buildGroups(): GalleryGroup[] {
  const dunajca = cottages['domek-nad-dolina']
  const drewniany = cottages['drewniany-domek']
  const zawadaA = cottages['dom-w-zawadzie-a']
  const zawadaB = cottages['dom-w-zawadzie-b']
  const wzgorze = cottages['dom-na-wzgorzu']

  // Both Zawada units live in the same house and share photos — merge and dedupe by source.
  const seen = new Set<string>()
  const zawadaPhotos = [...zawadaA.gallery, ...zawadaB.gallery].filter((photo) => {
    if (seen.has(photo.src)) return false
    seen.add(photo.src)
    return true
  })

  return [
    { slug: dunajca.slug, name: 'Domek nad Doliną Dunajca', photos: dunajca.gallery },
    { slug: drewniany.slug, name: 'Drewniany Domek nad Doliną Dunajca', photos: drewniany.gallery },
    { slug: zawadaA.slug, name: 'Dom w Zawadzie Lanckorońskiej', photos: zawadaPhotos },
    { slug: wzgorze.slug, name: 'Dom na Borówkowym Wzgórzu', photos: wzgorze.gallery },
  ]
}

const groups = buildGroups()
const allPhotos = groups.flatMap((group) => group.photos)
const groupOffsets = groups.reduce<number[]>((offsets, group, i) => {
  offsets.push(i === 0 ? 0 : offsets[i - 1] + groups[i - 1].photos.length)
  return offsets
}, [])

const revealClasses = ['reveal', 'reveal-d1', 'reveal-d2', 'reveal-d3']

/** Lets each row breathe at a slightly different rhythm — wide shots span two columns, the rest alternate between two quiet portrait ratios. */
function tileClass(photo: CottagePhoto, indexInGroup: number) {
  if (photo.wide) return 'col-span-2 aspect-[16/9]'
  return indexInGroup % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]'
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

function LinkArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
      <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length)),
    [],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % allPhotos.length)),
    [],
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

  const openPhoto = openIndex !== null ? allPhotos[openIndex] : null

  return (
    <section id="galeria" className="bg-charcoal pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 mb-16 md:mb-20">
        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-5 reveal">Zajrzyj do środka</p>
        <h2
          className="font-display text-bone reveal-d1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          Galeria.
        </h2>
        <p className="text-bone/50 text-[15px] leading-relaxed max-w-md mt-6 reveal-d2">
          Cztery domki, jeden rytm doliny — poranne światło na ścianach, wieczorne cienie na tarasach,
          detale, które zostają w pamięci dłużej niż sam pobyt.
        </p>
      </div>

      <div className="flex flex-col gap-16 md:gap-24">
        {groups.map((group, groupIndex) => (
          <div key={group.slug}>
            <div className="max-w-6xl mx-auto px-6 mb-6 md:mb-8 flex items-end justify-between gap-6">
              <div className="reveal">
                <p className="text-[10px] tracking-[0.28em] uppercase text-sage/70 mb-2">Domek</p>
                <h3
                  className="font-display italic text-bone"
                  style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)', lineHeight: 1 }}
                >
                  {group.name}
                </h3>
              </div>
              <Link
                href={`/pl/domki/${group.slug}`}
                className="group reveal hidden sm:flex items-center gap-2 text-[12px] tracking-wide text-sage hover:text-bone transition-colors duration-200 shrink-0 pb-1.5"
              >
                Zobacz domek
                <LinkArrowIcon />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
              {group.photos.map((photo, photoIndex) => {
                const globalIndex = groupOffsets[groupIndex] + photoIndex
                return (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setOpenIndex(globalIndex)}
                    className={`group relative overflow-hidden bg-forest cursor-zoom-in ${tileClass(photo, photoIndex)} ${revealClasses[photoIndex % revealClasses.length]}`}
                    aria-label={`Otwórz zdjęcie: ${pickText('pl', photo.alt)}`}
                  >
                    <Image
                      src={photo.src}
                      alt={pickText('pl', photo.alt)}
                      fill
                      priority={groupIndex === 0 && photoIndex < 2}
                      quality={70}
                      sizes={photo.wide ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </button>
                )
              })}
            </div>
          </div>
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
            aria-label="Zamknij galerię"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition-colors p-3"
            aria-label="Poprzednie zdjęcie"
          >
            <ArrowIcon direction="left" />
          </button>

          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full" style={{ height: '78vh' }}>
              <Image
                src={openPhoto.src}
                alt={pickText('pl', openPhoto.alt)}
                fill
                quality={85}
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="text-bone/50 text-[13px] tracking-wide text-center mt-5">
              {pickText('pl', openPhoto.alt)}
              <span className="text-bone/30"> · {(openIndex ?? 0) + 1} / {allPhotos.length}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition-colors p-3"
            aria-label="Następne zdjęcie"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      )}
    </section>
  )
}
