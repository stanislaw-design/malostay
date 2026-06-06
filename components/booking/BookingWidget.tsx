'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/booking/Calendar'
import { GuestForm, type GuestFormValues } from '@/components/booking/GuestForm'
import { calculatePrice, type PriceCalculation } from '@/lib/pricing'
import { t, type Locale } from '@/lib/i18n/t'
import type { SerializedBookedRange } from '@/lib/availability'
import type { Tables } from '@/types/database'

interface PropertyInfo {
  id: string
  slug: string
  minNights: number
  maxGuests: number
  checkInTime: string
  checkOutTime: string
}

interface Props {
  property: PropertyInfo
  pricingRules: Tables<'pricing_rules'>[]
  bookedRanges: SerializedBookedRange[]
  depositPercent: number | null
  stripeConfigured: boolean
  locale: Locale
}

export function BookingWidget({
  property,
  pricingRules,
  bookedRanges,
  depositPercent,
  stripeConfigured,
  locale,
}: Props) {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [priceData, setPriceData] = useState<PriceCalculation | undefined>()
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleDateSelect(range: DateRange | undefined) {
    setDateRange(range)
    setApiError(null)
    if (range?.from && range.to) {
      const calc = calculatePrice(range.from, range.to, pricingRules, depositPercent)
      setPriceData(calc)
    } else {
      setPriceData(undefined)
    }
  }

  async function handleGuestSubmit(values: GuestFormValues) {
    if (!dateRange?.from || !dateRange.to || !priceData) return

    setSubmitting(true)
    setApiError(null)

    const res = await fetch('/api/booking/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: property.id,
        checkIn: dateRange.from.toISOString().split('T')[0],
        checkOut: dateRange.to.toISOString().split('T')[0],
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        guestCount: values.guestCount,
        notes: values.notes,
        locale,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg =
        data.error === 'dates_unavailable'
          ? t(locale, 'errors.unavailable')
          : (data.error ?? t(locale, 'errors.generic'))
      setApiError(msg)
      setSubmitting(false)
      return
    }

    router.push(`/${locale}/domki/${property.slug}/platnosc?reservation_id=${data.reservationId}`)
  }

  const datesReady = !!(priceData && dateRange?.from && dateRange.to)

  return (
    <div className={datesReady ? 'grid lg:grid-cols-[1fr_320px] gap-8 items-start' : 'space-y-5'}>
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-neutral-900">{t(locale, 'booking.selectDates')}</h2>

        <Calendar
          bookedRanges={bookedRanges}
          minNights={property.minNights}
          locale={locale}
          onRangeSelect={handleDateSelect}
        />

        {dateRange?.from && !dateRange.to && (
          <p className="text-sm text-neutral-500">
            {t(locale, 'booking.minNightsHint', { min: property.minNights })}
          </p>
        )}

        {!stripeConfigured && (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-3">
            {locale === 'pl'
              ? 'Płatności online nie są skonfigurowane.'
              : 'Online payments are not configured.'}
          </p>
        )}
      </div>

      {datesReady && (
        <div className="space-y-4">
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          <GuestForm
            maxGuests={property.maxGuests}
            locale={locale}
            onSubmit={handleGuestSubmit}
            onBack={() => {
              setDateRange(undefined)
              setPriceData(undefined)
              setApiError(null)
            }}
            loading={submitting}
          />
        </div>
      )}
    </div>
  )
}
