import { differenceInCalendarDays, format } from 'date-fns'
import type { Tables } from '@/types/database'

type PricingRule = Tables<'pricing_rules'>

export interface NightPrice {
  date: string
  price: number
}

export interface PriceCalculation {
  nights: number
  totalPrice: number
  depositAmount: number | null
  perNight: NightPrice[]
}

function priceForNight(date: Date, rules: PricingRule[]): number {
  const dayOfWeek = date.getDay()
  const dateStr = format(date, 'yyyy-MM-dd')

  const matching = rules
    .filter((rule) => {
      if (!rule.active) return false
      if (rule.valid_from && dateStr < rule.valid_from) return false
      if (rule.valid_to && dateStr > rule.valid_to) return false
      if (rule.days_of_week && !rule.days_of_week.includes(dayOfWeek)) return false
      return true
    })
    .sort((a, b) => b.priority - a.priority)

  return Number(matching[0]?.price_per_night ?? 0)
}

export function calculatePrice(
  checkIn: Date,
  checkOut: Date,
  rules: PricingRule[],
  depositPercent: number | null
): PriceCalculation {
  const nights = differenceInCalendarDays(checkOut, checkIn)
  const perNight: NightPrice[] = []

  for (let i = 0; i < nights; i++) {
    const d = new Date(checkIn)
    d.setDate(d.getDate() + i)
    perNight.push({ date: format(d, 'yyyy-MM-dd'), price: priceForNight(d, rules) })
  }

  const totalPrice = perNight.reduce((sum, n) => sum + n.price, 0)
  const depositAmount =
    depositPercent != null ? Math.ceil((totalPrice * depositPercent) / 100) : null

  return { nights, totalPrice, depositAmount, perNight }
}
