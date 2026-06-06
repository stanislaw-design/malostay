'use client'

import { useState, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { t, type Locale } from '@/lib/i18n/t'

interface CheckoutFormProps {
  amountToPay: number
  isDeposit: boolean
  depositPercent: number | null
  totalPrice: number
  returnUrl: string
  locale: Locale
  onBack: () => void
}

function CheckoutForm({
  amountToPay,
  isDeposit,
  depositPercent,
  totalPrice,
  returnUrl,
  locale,
  onBack,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })

    if (stripeError) {
      setError(stripeError.message ?? t(locale, 'errors.paymentFailed'))
      setProcessing(false)
    }
    // On success, Stripe redirects — component stays mounted briefly
  }

  const rest = totalPrice - amountToPay

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-neutral-900">{t(locale, 'payment.title')}</h2>

      <p className="text-sm text-neutral-600">
        {isDeposit
          ? t(locale, 'payment.depositInfo', {
              percent: depositPercent ?? 0,
              amount: amountToPay.toLocaleString('pl-PL'),
              rest: rest.toLocaleString('pl-PL'),
            })
          : t(locale, 'payment.fullPaymentInfo')}
      </p>

      <PaymentElement
        options={{
          layout: { type: 'tabs', defaultCollapsed: false },
        }}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-neutral-400">{t(locale, 'payment.secureInfo')}</p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {t(locale, 'booking.back')}
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {processing
            ? t(locale, 'payment.processing')
            : t(locale, 'payment.submitLabel', {
                amount: amountToPay.toLocaleString('pl-PL'),
              })}
        </button>
      </div>
    </form>
  )
}

interface Props extends CheckoutFormProps {
  clientSecret: string
}

export function PaymentForm({ clientSecret, ...rest }: Props) {
  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
    []
  )

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: rest.locale === 'pl' ? 'pl' : 'en',
        appearance: { theme: 'stripe' },
        loader: 'auto',
      }}
    >
      <CheckoutForm {...rest} />
    </Elements>
  )
}
