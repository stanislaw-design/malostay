import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/service'
import { createStripe } from '@/lib/stripe/server'
import type { Locale } from '@/lib/i18n/t'
import type { PriceCalculation } from '@/lib/pricing'
import { PaymentPageView } from '@/components/booking/PaymentPageView'

interface Props {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ reservation_id?: string }>
}

export default async function PaymentPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { reservation_id } = await searchParams
  const safeLocale = locale as Locale

  if (!reservation_id) notFound()

  const service = createServiceClient()

  const { data: reservation } = await service
    .from('reservations')
    .select('*, properties(name_pl, name_en, slug)')
    .eq('id', reservation_id)
    .single()

  if (!reservation || reservation.status !== 'pending') notFound()
  if (!reservation.stripe_payment_intent_id) notFound()

  const property = reservation.properties as { name_pl: string; name_en: string; slug: string } | null
  if (!property || property.slug !== slug) notFound()

  const { data: settings } = await service
    .from('property_settings')
    .select('deposit_percent')
    .eq('property_id', reservation.property_id)
    .single()

  const pi = await createStripe().paymentIntents.retrieve(reservation.stripe_payment_intent_id)
  if (!pi.client_secret) notFound()

  const priceData: PriceCalculation = {
    nights: reservation.total_nights,
    totalPrice: Number(reservation.total_price),
    depositAmount: reservation.deposit_amount ? Number(reservation.deposit_amount) : null,
    perNight: [],
  }

  const amountToPay = priceData.depositAmount ?? priceData.totalPrice

  const headerList = await headers()
  const host = headerList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') ? 'http' : 'https'
  const returnUrl = `${proto}://${host}/${locale}/domki/${slug}/potwierdzenie?reservation_id=${reservation_id}`

  return (
    <PaymentPageView
      checkIn={reservation.check_in}
      checkOut={reservation.check_out}
      priceData={priceData}
      depositPercent={settings?.deposit_percent ?? null}
      clientSecret={pi.client_secret}
      amountToPay={amountToPay}
      isDeposit={priceData.depositAmount != null}
      totalPrice={priceData.totalPrice}
      returnUrl={returnUrl}
      locale={safeLocale}
      backHref={`/${locale}/domki/${slug}`}
    />
  )
}
