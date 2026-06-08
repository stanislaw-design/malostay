import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ReservationActions } from '@/components/admin/ReservationActions'
import { CopyButton } from '@/components/admin/CopyButton'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Potwierdzona',
  pending: 'Oczekująca',
  cancelled: 'Anulowana',
}

const STATUS_CLASSES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-neutral-100 text-neutral-500',
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*, properties(name_pl, name_en, slug)')
    .eq('id', id)
    .single()

  if (error || !reservation) notFound()

  const property = reservation.properties as { name_pl: string; name_en: string; slug: string } | null

  const checkIn = format(new Date(reservation.check_in), 'EEEE, d MMMM yyyy', { locale: pl })
  const checkOut = format(new Date(reservation.check_out), 'EEEE, d MMMM yyyy', { locale: pl })
  const created = format(new Date(reservation.created_at), 'd MMMM yyyy, HH:mm', { locale: pl })
  const updated = format(new Date(reservation.updated_at), 'd MMMM yyyy, HH:mm', { locale: pl })
  const pricePerNight = reservation.total_price / reservation.total_nights

  const stripeMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test/' : ''
  const stripeUrl = reservation.stripe_payment_intent_id
    ? `https://dashboard.stripe.com/${stripeMode}payments/${reservation.stripe_payment_intent_id}`
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/rezerwacje" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Rezerwacje
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{reservation.guest_name}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">ID: {reservation.id.slice(0, 8)}</p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STATUS_CLASSES[reservation.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
          {STATUS_LABELS[reservation.status] ?? reservation.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info */}
          <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Domek</p>
                {property ? (
                  <Link
                    href={`/admin/domki/${reservation.property_id}`}
                    className="text-sm font-medium text-neutral-900 hover:underline underline-offset-2"
                  >
                    {property.name_pl}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-neutral-900">—</p>
                )}
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Liczba gości</p>
                <p className="text-sm font-medium text-neutral-900">{reservation.guest_count}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Język</p>
                <p className="text-sm font-medium text-neutral-900 uppercase">{reservation.language}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Check-in</p>
                <p className="text-sm font-medium text-neutral-900 capitalize">{checkIn}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Check-out</p>
                <p className="text-sm font-medium text-neutral-900 capitalize">{checkOut}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Liczba nocy</p>
                <p className="text-sm font-medium text-neutral-900">{reservation.total_nights}</p>
              </div>
            </div>

            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Cena łączna</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {reservation.total_price.toFixed(0)} zł
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Cena za noc</p>
                <p className="text-sm font-medium text-neutral-900">
                  {pricePerNight.toFixed(0)} zł
                </p>
              </div>
              {reservation.deposit_amount && (
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">Zadatek</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {reservation.deposit_amount.toFixed(0)} zł
                  </p>
                </div>
              )}
              {reservation.stripe_payment_intent_id && stripeUrl && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-neutral-500 mb-0.5">Stripe Payment Intent</p>
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-neutral-700 hover:text-neutral-900 hover:underline underline-offset-2"
                  >
                    {reservation.stripe_payment_intent_id} ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Guest contact */}
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-900">Dane gościa</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Imię i nazwisko</p>
                <p className="text-sm text-neutral-900">{reservation.guest_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Telefon</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${reservation.guest_phone}`}
                    className="text-sm text-neutral-900 hover:underline underline-offset-2"
                  >
                    {reservation.guest_phone}
                  </a>
                  <CopyButton value={reservation.guest_phone} />
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Email</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${reservation.guest_email}`}
                    className="text-sm text-neutral-900 hover:underline underline-offset-2"
                  >
                    {reservation.guest_email}
                  </a>
                  <CopyButton value={reservation.guest_email} />
                </div>
              </div>
              {reservation.notes && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-neutral-500 mb-0.5">Uwagi gościa</p>
                  <p className="text-sm text-neutral-700 whitespace-pre-line">{reservation.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right / sidebar column */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-900">Akcje</h2>
            <ReservationActions reservationId={reservation.id} currentStatus={reservation.status} />
          </div>

          {/* Email automation status */}
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-900">Maile automatyczne</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Mail przed przyjazdem</p>
                {reservation.pre_arrival_email_sent_at ? (
                  <p className="text-sm text-neutral-900">
                    Wysłany {format(new Date(reservation.pre_arrival_email_sent_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-400">Jeszcze nie wysłany</p>
                )}
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Mail z prośbą o opinię</p>
                {reservation.review_email_sent_at ? (
                  <p className="text-sm text-neutral-900">
                    Wysłany {format(new Date(reservation.review_email_sent_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-400">Jeszcze nie wysłany</p>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="px-1 space-y-1 text-xs text-neutral-400">
            <p>Rezerwacja złożona: {created}</p>
            <p>Ostatnia aktualizacja: {updated}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
