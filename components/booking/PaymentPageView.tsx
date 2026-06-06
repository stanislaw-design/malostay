'use client'

import { useRouter } from 'next/navigation'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { PaymentForm } from '@/components/booking/PaymentForm'
import type { Locale } from '@/lib/i18n/t'
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
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-8 md:py-12 space-y-6">
        <BookingSummary
          checkIn={new Date(checkIn)}
          checkOut={new Date(checkOut)}
          priceData={priceData}
          depositPercent={depositPercent}
          locale={locale}
          expanded
        />
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
      </div>
    </main>
  )
}
