'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface Props {
  lat: number
  lng: number
  label: string
}

function buildPinHtml(label: string) {
  return `
    <div class="lp-pin lp-pin--active" data-pin-id="single">
      <div class="lp-dot"><span class="lp-single">&#9679;</span></div>
      <div class="lp-label">${label}</div>
    </div>
  `
}

export function CottageLocationMap({ lat, lng, label }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

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
        minZoom: 8,
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

      ;(map as import('leaflet').Map).setView([lat, lng], 12)

      const icon = (L as typeof import('leaflet')).divIcon({
        html: buildPinHtml(label),
        className: '',
        iconSize: [44, 76],
        iconAnchor: [22, 22],
      })

      ;(L as typeof import('leaflet')).marker([lat, lng], { icon }).addTo(map as import('leaflet').Map)

      mapInstanceRef.current = map
    })

    return () => {
      mounted = false
      ;(mapInstanceRef.current as import('leaflet').Map | null)?.remove()
      mapInstanceRef.current = null
    }
  }, [lat, lng, label])

  return <div ref={mapRef} className="w-full rounded-2xl overflow-hidden" style={{ height: 420 }} />
}
