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
    <div className="rounded-2xl border border-charcoal/10 bg-white p-6 space-y-5">
      <h3 className="font-display text-xl text-charcoal">{t(locale, 'booking.summary')}</h3>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal/55">{t(locale, 'booking.checkInLabel')}</span>
          <span className="font-medium text-charcoal">{fmt(checkIn)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal/55">{t(locale, 'booking.checkOutLabel')}</span>
          <span className="font-medium text-charcoal">{fmt(checkOut)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal/55">{t(locale, 'booking.nightsLabel')}</span>
          <span className="font-medium text-charcoal">{nights}</span>
        </div>
      </div>

      {expanded && perNight.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-charcoal/10">
          <p className="text-[10px] font-medium text-sage uppercase tracking-[0.2em]">
            {t(locale, 'booking.priceBreakdown')}
          </p>
          <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
            {perNight.map((n) => (
              <div key={n.date} className="flex justify-between text-xs text-charcoal/60">
                <span>{format(new Date(n.date), 'd MMM', { locale: dateFnsLocale })}</span>
                <span>{n.price.toLocaleString('pl-PL')} zł</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-charcoal/10 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/55">{t(locale, 'booking.totalPrice')}</span>
          <span className="font-medium text-charcoal">{totalPrice.toLocaleString('pl-PL')} zł</span>
        </div>
        {depositAmount != null && (
          <div className="flex justify-between text-sm text-pine font-semibold">
            <span>{t(locale, 'booking.depositAmount', { percent: depositPercent ?? 0 })}</span>
            <span>{depositAmount.toLocaleString('pl-PL')} zł</span>
          </div>
        )}
        <div className="flex justify-between font-display text-lg text-charcoal pt-2 border-t border-charcoal/10">
          <span>{t(locale, 'booking.toPay')}</span>
          <span>{amountToPay.toLocaleString('pl-PL')} zł</span>
        </div>
      </div>
    </div>
  )
}
