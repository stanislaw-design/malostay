'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

type Cottage = {
  slug: string
  name: string
  label?: string
  area?: string
  guests: number
  bedrooms: number
  imgSrc?: string
}

type PinGroup = {
  id: string
  locationName: string
  lat: number
  lng: number
  cottages: Cottage[]
}

const pinGroups: PinGroup[] = [
  {
    id: 'dolina-dunajca',
    locationName: 'Dolina Dunajca',
    lat: 49.863,
    lng: 20.519,
    cottages: [
      {
        slug: 'domek-nad-dolina',
        name: 'Domek nad Doliną Dunajca',
        area: '70 m²',
        guests: 6,
        bedrooms: 1,
        imgSrc: '/nad-dolina-dunajca/jaccuzi-zachod.webp',
      },
      {
        slug: 'drewniany-domek',
        name: 'Drewniany Domek nad Doliną',
        area: '70 m²',
        guests: 6,
        bedrooms: 2,
        imgSrc: '/drewniany-nad-dolina-dunajca/domek.webp',
      },
      {
        slug: 'dom-na-wzgorzu',
        name: 'Dom na Borówkowym Wzgórzu',
        area: '100 m²',
        guests: 8,
        bedrooms: 2,
      },
    ],
  },
  {
    id: 'zawada-lanckoronska',
    locationName: 'Zawada Lanckorońska',
    lat: 49.855,
    lng: 19.745,
    cottages: [
      {
        slug: 'dom-w-zawadzie-a',
        name: 'Dom w Zawadzie Lanckorońskiej',
        label: 'Lokal 4 os.',
        guests: 4,
        bedrooms: 2,
        imgSrc: '/zawada-lancronska/domek1.webp',
      },
      {
        slug: 'dom-w-zawadzie-b',
        name: 'Dom w Zawadzie Lanckorońskiej',
        label: 'Lokal 6 os.',
        guests: 6,
        bedrooms: 3,
        imgSrc: '/zawada-lancronska/sypialnia2.webp',
      },
    ],
  },
]

function bedroomLabel(n: number) {
  if (n === 1) return '1 sypialnia'
  if (n < 5) return `${n} sypialnie`
  return `${n} sypialni`
}

function buildPinHtml(group: PinGroup) {
  const count = group.cottages.length
  const isMulti = count > 1
  return `
    <div class="lp-pin" data-pin-id="${group.id}">
      <div class="lp-dot${isMulti ? ' lp-dot--multi' : ''}">
        ${isMulti ? `<span class="lp-count">${count}</span>` : '<span class="lp-single">&#9679;</span>'}
      </div>
      <div class="lp-label">${group.locationName}</div>
    </div>
  `
}

export function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [activeGroup, setActiveGroup] = useState<PinGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let mounted = true

    import('leaflet').then((mod) => {
      if (!mounted || !mapRef.current) return
      const L = (mod as unknown as { default: typeof import('leaflet') }).default ?? mod

      const map = (L as typeof import('leaflet')).map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
        minZoom: 7,
        maxZoom: 16,
      })

      ;(L as typeof import('leaflet'))
        .tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        })
        .addTo(map as import('leaflet').Map)

      ;(L as typeof import('leaflet')).control
        .zoom({ position: 'bottomright' })
        .addTo(map as import('leaflet').Map)

      const bounds = (L as typeof import('leaflet')).latLngBounds(
        pinGroups.map((g) => [g.lat, g.lng] as [number, number]),
      )
      ;(map as import('leaflet').Map).fitBounds(bounds, { padding: [56, 80], maxZoom: 11 })

      pinGroups.forEach((group) => {
        const icon = (L as typeof import('leaflet')).divIcon({
          html: buildPinHtml(group),
          className: '',
          iconSize: [44, 76],
          iconAnchor: [22, 22],
        })

        ;(L as typeof import('leaflet'))
          .marker([group.lat, group.lng], { icon })
          .addTo(map as import('leaflet').Map)
          .on('click', () => {
            document
              .querySelectorAll('.lp-pin')
              .forEach((el) => el.classList.remove('lp-pin--active'))
            document
              .querySelector(`.lp-pin[data-pin-id="${group.id}"]`)
              ?.classList.add('lp-pin--active')
            setActiveGroup(group)
          })
      })

      mapInstanceRef.current = map
    })

    return () => {
      mounted = false
      ;(mapInstanceRef.current as import('leaflet').Map | null)?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <div>
      {/* Map */}
      <div ref={mapRef} className="w-full rounded-2xl overflow-hidden" style={{ height: 420 }} />

      {/* Cottage selection panel */}
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: activeGroup ? '600px' : '0px',
          opacity: activeGroup ? 1 : 0,
          marginTop: activeGroup ? '20px' : '0px',
        }}
      >
        {activeGroup && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-sage">
                {activeGroup.locationName} — wybierz domek
              </p>
              <button
                onClick={() => {
                  document
                    .querySelectorAll('.lp-pin')
                    .forEach((el) => el.classList.remove('lp-pin--active'))
                  setActiveGroup(null)
                }}
                className="text-charcoal/30 hover:text-charcoal/60 transition-colors text-[11px] tracking-wide uppercase"
              >
                zamknij ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {activeGroup.cottages.map((cottage) => (
                <a
                  key={cottage.slug}
                  href={`/pl/domki/${cottage.slug}`}
                  className="group flex flex-col bg-bone border border-mist/60 rounded-xl overflow-hidden hover:border-sage/50 hover:shadow-lg transition-all duration-200"
                >
                  {cottage.imgSrc ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={cottage.imgSrc}
                        alt={cottage.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-mist/40 flex items-center justify-center">
                      <span className="text-3xl text-charcoal/20 font-display italic">
                        {cottage.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    {cottage.label && (
                      <p className="text-[9px] tracking-[0.28em] uppercase text-sage mb-1">
                        {cottage.label}
                      </p>
                    )}
                    <p className="text-[13px] font-medium text-charcoal leading-snug mb-1">
                      {cottage.name}
                    </p>
                    <p className="text-[11px] text-charcoal/45 mb-4">
                      {[cottage.area, `${cottage.guests} os.`, bedroomLabel(cottage.bedrooms)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 text-sage group-hover:text-forest transition-colors">
                      <span className="text-[11px] tracking-wide font-medium">Sprawdź termin</span>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
