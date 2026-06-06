'use client'

import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import { t, type Locale } from '@/lib/i18n/t'
import type { PriceCalculation } from '@/lib/pricing'

interface Props {
  checkIn: Date
  checkOut: Date
  priceData: PriceCalculation
  depositPercent: number | null
  locale: Locale
  expanded?: boolean
}

export function BookingSummary({ checkIn, checkOut, priceData, depositPercent, locale, expanded }: Props) {
  const dateFnsLocale = locale === 'pl' ? pl : enUS
  const fmt = (d: Date) => format(d, 'd MMM yyyy', { locale: dateFnsLocale })
  const { nights, totalPrice, depositAmount, perNight } = priceData

  const amountToPay = depositAmount ?? totalPrice

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-4">
      <h3 className="font-semibold text-neutral-900">{t(locale, 'booking.summary')}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">{t(locale, 'booking.checkInLabel')}</span>
          <span className="font-medium">{fmt(checkIn)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">{t(locale, 'booking.checkOutLabel')}</span>
          <span className="font-medium">{fmt(checkOut)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">{t(locale, 'booking.nightsLabel')}</span>
          <span className="font-medium">{nights}</span>
        </div>
      </div>

      {expanded && perNight.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-neutral-200">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {t(locale, 'booking.priceBreakdown')}
          </p>
          <div className="max-h-32 overflow-y-auto space-y-0.5">
            {perNight.map((n) => (
              <div key={n.date} className="flex justify-between text-xs text-neutral-600">
                <span>{format(new Date(n.date), 'd MMM', { locale: dateFnsLocale })}</span>
                <span>{n.price.toLocaleString('pl-PL')} zł</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-neutral-200 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">{t(locale, 'booking.totalPrice')}</span>
          <span className="font-medium">{totalPrice.toLocaleString('pl-PL')} zł</span>
        </div>
        {depositAmount != null && (
          <div className="flex justify-between text-sm text-amber-700 font-semibold">
            <span>{t(locale, 'booking.depositAmount', { percent: depositPercent ?? 0 })}</span>
            <span>{depositAmount.toLocaleString('pl-PL')} zł</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-neutral-900 pt-1 border-t border-neutral-200">
          <span>{t(locale, 'booking.toPay')}</span>
          <span>{amountToPay.toLocaleString('pl-PL')} zł</span>
        </div>
      </div>
    </div>
  )
}
