'use client'

import { useRouter } from 'next/navigation'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { PaymentForm } from '@/components/booking/PaymentForm'
import { t, type Locale } from '@/lib/i18n/t'
import type { PriceCalculation } from '@/lib/pricing'

interface Props {
  checkIn: string
  checkOut: string
  priceData: PriceCalculation
  depositPercent: number | null
  clientSecret: string
  amountToPay: number
  isDeposit: boolean
  totalPrice: number
  returnUrl: string
  locale: Locale
  backHref: string
}

export function PaymentPageView({
  checkIn,
  checkOut,
  priceData,
  depositPercent,
  clientSecret,
  amountToPay,
  isDeposit,
  totalPrice,
  returnUrl,
  locale,
  backHref,
}: Props) {
  const router = useRouter()

  return (
    <>
      <Nav />
      <main className="bg-bone min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-28 md:pt-36 pb-24">
          <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-4">
            {locale === 'en' ? 'Final step' : 'Ostatni krok'}
          </p>
          <h1
            className="font-display text-charcoal leading-[0.95] mb-10 md:mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t(locale, 'payment.title')}
          </h1>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
            <PaymentForm
              clientSecret={clientSecret}
              amountToPay={amountToPay}
              isDeposit={isDeposit}
              depositPercent={depositPercent}
              totalPrice={totalPrice}
              returnUrl={returnUrl}
              locale={locale}
              onBack={() => router.push(backHref)}
            />
            <BookingSummary
              checkIn={new Date(checkIn)}
              checkOut={new Date(checkOut)}
              priceData={priceData}
              depositPercent={depositPercent}
              locale={locale}
              expanded
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
