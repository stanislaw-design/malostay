import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import { createServiceClient } from '@/lib/supabase/service'
import { createStripe } from '@/lib/stripe/server'
import { t, type Locale } from '@/lib/i18n/t'

interface Props {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ reservation_id?: string; payment_intent?: string }>
}

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { reservation_id, payment_intent } = await searchParams
  const safeLocale = locale as Locale

  if (!reservation_id) notFound()

  const service = createServiceClient()

  const { data: reservation } = await service
    .from('reservations')
    .select('*, properties(name_pl, name_en, slug)')
    .eq('id', reservation_id)
    .single()

  if (!reservation) notFound()

  if (payment_intent && reservation.status === 'pending') {
    const pi = await createStripe().paymentIntents.retrieve(payment_intent)
    if (pi.status === 'succeeded') {
      await service
        .from('reservations')
        .update({ status: 'confirmed', stripe_payment_intent_id: pi.id })
        .eq('id', reservation_id)
      reservation.status = 'confirmed'
    }
  }

  const isConfirmed = reservation.status === 'confirmed'
  const dateFnsLocale = safeLocale === 'pl' ? pl : enUS
  const fmt = (d: string) => format(new Date(d), 'd MMM yyyy', { locale: dateFnsLocale })

  const property = reservation.properties as { name_pl: string; name_en: string; slug: string } | null
  const propertyName = property
    ? safeLocale === 'pl'
      ? property.name_pl
      : property.name_en
    : ''

  const amountPaid = reservation.deposit_amount ?? reservation.total_price

  if (!isConfirmed) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-2xl">
            ⏳
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {safeLocale === 'pl' ? 'Oczekiwanie na płatność' : 'Awaiting payment'}
          </h1>
          <p className="text-neutral-600">
            {safeLocale === 'pl'
              ? 'Twoja płatność jest przetwarzana. Wyślemy potwierdzenie na e-mail.'
              : 'Your payment is being processed. We will send a confirmation to your email.'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">{t(safeLocale, 'confirmation.title')}</h1>
          <p className="text-neutral-600">{t(safeLocale, 'confirmation.subtitle')}</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
          {propertyName && (
            <p className="font-semibold text-neutral-900 text-center">{propertyName}</p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">{t(safeLocale, 'confirmation.reservationId')}</span>
              <span className="font-mono text-xs text-neutral-700">{reservation.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t(safeLocale, 'confirmation.checkIn')}</span>
              <span className="font-medium">{fmt(reservation.check_in)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t(safeLocale, 'confirmation.checkOut')}</span>
              <span className="font-medium">{fmt(reservation.check_out)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{t(safeLocale, 'confirmation.nights')}</span>
              <span className="font-medium">{reservation.total_nights}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
              <span>{t(safeLocale, 'confirmation.paid')}</span>
              <span>{Number(amountPaid).toLocaleString('pl-PL')} zł</span>
            </div>
          </div>
        </div>

        {property && (
          <Link
            href={`/${safeLocale}/domki/${property.slug}`}
            className="block w-full text-center rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            {t(safeLocale, 'confirmation.backToHome')}
          </Link>
        )}
      </div>
    </main>
  )
}
