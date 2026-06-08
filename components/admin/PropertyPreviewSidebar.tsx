import Link from 'next/link'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Tables } from '@/types/database'

type Property = Pick<
  Tables<'properties'>,
  'name_pl' | 'name_en' | 'slug' | 'cover_image' | 'max_guests' | 'min_nights' | 'check_in_time' | 'check_out_time'
>
type Reservation = Pick<Tables<'reservations'>, 'id' | 'guest_name' | 'check_in' | 'check_out' | 'status'>

interface Props {
  property: Property
  upcomingReservations: Reservation[]
}

export function PropertyPreviewSidebar({ property, upcomingReservations }: Props) {
  const publicUrl = `/pl/domki/${property.slug}`

  return (
    <aside className="space-y-4 lg:sticky lg:top-8">
      {/* Live card preview */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="aspect-[4/3] bg-neutral-100 relative">
          {property.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.cover_image} alt={property.name_pl} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              Brak zdjęcia głównego
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs uppercase tracking-wide text-neutral-400">Podgląd karty</p>
          <h3 className="text-sm font-semibold text-neutral-900">{property.name_pl}</h3>
          <p className="text-xs text-neutral-500">{property.name_en}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
              do {property.max_guests} gości
            </span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
              min. {property.min_nights} noce
            </span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600">
              {property.check_in_time}–{property.check_out_time}
            </span>
          </div>
          <Link
            href={publicUrl}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 hover:underline pt-1"
          >
            Zobacz stronę publiczną →
          </Link>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white border border-neutral-200 rounded-xl px-4 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900">Najbliższe rezerwacje</h3>
        {upcomingReservations.length === 0 ? (
          <p className="text-sm text-neutral-500">Brak nadchodzących rezerwacji</p>
        ) : (
          <ul className="space-y-2.5">
            {upcomingReservations.map((r) => (
              <li key={r.id} className="text-sm">
                <p className="font-medium text-neutral-900 truncate">{r.guest_name}</p>
                <p className="text-xs text-neutral-500">
                  {format(new Date(r.check_in), 'd MMM', { locale: pl })} – {format(new Date(r.check_out), 'd MMM yyyy', { locale: pl })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
