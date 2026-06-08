import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import { createServiceClient } from '@/lib/supabase/service'
import { createStripe } from '@/lib/stripe/server'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
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
      <>
        <Nav />
        <main className="bg-bone min-h-screen flex items-center justify-center px-6 pt-28 md:pt-36 pb-24">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mx-auto text-2xl">
              ⏳
            </div>
            <h1 className="font-display text-charcoal leading-[0.95]" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
              {safeLocale === 'pl' ? 'Oczekiwanie na płatność' : 'Awaiting payment'}
            </h1>
            <p className="text-charcoal/60 text-sm leading-relaxed">
              {safeLocale === 'pl'
                ? 'Twoja płatność jest przetwarzana. Wyślemy potwierdzenie na e-mail.'
                : 'Your payment is being processed. We will send a confirmation to your email.'}
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="bg-bone min-h-screen">
        <div className="max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-24">
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-pine/10 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-sage">
              {safeLocale === 'pl' ? 'Rezerwacja' : 'Reservation'}
            </p>
            <h1 className="font-display text-charcoal leading-[0.95]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {t(safeLocale, 'confirmation.title')}
            </h1>
            <p className="text-charcoal/60 text-sm leading-relaxed max-w-sm mx-auto">
              {t(safeLocale, 'confirmation.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-6 space-y-5">
            {propertyName && (
              <h3 className="font-display text-xl text-charcoal text-center">{propertyName}</h3>
            )}

            <div className="space-y-2.5 text-sm pt-3 border-t border-charcoal/10">
              <div className="flex justify-between">
                <span className="text-charcoal/55">{t(safeLocale, 'confirmation.reservationId')}</span>
                <span className="font-mono text-xs text-charcoal">{reservation.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/55">{t(safeLocale, 'confirmation.checkIn')}</span>
                <span className="font-medium text-charcoal">{fmt(reservation.check_in)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/55">{t(safeLocale, 'confirmation.checkOut')}</span>
                <span className="font-medium text-charcoal">{fmt(reservation.check_out)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/55">{t(safeLocale, 'confirmation.nights')}</span>
                <span className="font-medium text-charcoal">{reservation.total_nights}</span>
              </div>
            </div>

            <div className="flex justify-between font-display text-lg text-charcoal pt-4 border-t border-charcoal/10">
              <span>{t(safeLocale, 'confirmation.paid')}</span>
              <span>{Number(amountPaid).toLocaleString('pl-PL')} zł</span>
            </div>
          </div>

          {property && (
            <Link
              href={`/${safeLocale}/domki/${property.slug}`}
              className="mt-6 block w-full text-center rounded-lg border border-charcoal/15 px-4 py-2.5 text-sm font-medium text-charcoal transition hover:bg-white"
            >
              {t(safeLocale, 'confirmation.backToHome')}
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
