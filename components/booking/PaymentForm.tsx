'use client'

import { useState, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementReadyEvent,
} from '@stripe/stripe-js'
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
  const [hasExpressMethods, setHasExpressMethods] = useState(false)

  function handleExpressCheckoutReady(event: StripeExpressCheckoutElementReadyEvent) {
    setHasExpressMethods(!!event.availablePaymentMethods)
  }

  async function confirm() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await confirm()
  }

  async function handleExpressCheckout(_event: StripeExpressCheckoutElementConfirmEvent) {
    await confirm()
  }

  const rest = totalPrice - amountToPay

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-charcoal/10 bg-white p-6 md:p-8 space-y-6">
      <p className="text-sm text-charcoal/60 leading-relaxed">
        {isDeposit
          ? t(locale, 'payment.depositInfo', {
              percent: depositPercent ?? 0,
              amount: amountToPay.toLocaleString('pl-PL'),
              rest: rest.toLocaleString('pl-PL'),
            })
          : t(locale, 'payment.fullPaymentInfo')}
      </p>

      <div className={hasExpressMethods ? 'space-y-4' : ''}>
        <ExpressCheckoutElement
          onReady={handleExpressCheckoutReady}
          onConfirm={handleExpressCheckout}
          options={{
            paymentMethods: {
              applePay: 'auto',
              googlePay: 'auto',
              link: 'never',
              klarna: 'never',
              paypal: 'never',
              amazonPay: 'never',
            },
            buttonHeight: 48,
            buttonTheme: { applePay: 'black', googlePay: 'black' },
            buttonType: { applePay: 'plain', googlePay: 'plain' },
          }}
        />
        {hasExpressMethods && (
          <div className="flex items-center gap-3 text-xs text-charcoal/40">
            <span className="h-px flex-1 bg-charcoal/10" />
            <span className="uppercase tracking-[0.2em]">{locale === 'en' ? 'or' : 'lub'}</span>
            <span className="h-px flex-1 bg-charcoal/10" />
          </div>
        )}
      </div>

      <PaymentElement
        options={{
          layout: { type: 'tabs', defaultCollapsed: false },
        }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-charcoal/40">{t(locale, 'payment.secureInfo')}</p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 rounded-full border border-charcoal/15 px-5 py-3 text-sm font-medium text-charcoal transition hover:bg-fog disabled:opacity-50"
        >
          {t(locale, 'booking.back')}
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 rounded-full bg-forest px-5 py-3 text-sm font-medium text-bone transition hover:bg-pine active:scale-[0.97] disabled:opacity-50"
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
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1E4D2B',
            colorText: '#2E3330',
            colorBackground: '#FDFAF5',
            colorDanger: '#DC2626',
            borderRadius: '12px',
          },
        },
        loader: 'auto',
      }}
    >
      <CheckoutForm {...rest} />
    </Elements>
  )
}
