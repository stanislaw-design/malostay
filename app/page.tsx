'use client'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/booking/Calendar'
import { GuestForm, type GuestFormValues } from '@/components/booking/GuestForm'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { calculatePrice, type PriceCalculation } from '@/lib/pricing'
import type { Tables } from '@/types/database'

const MOCK_BOOKED_RANGES = [
  { from: '2026-06-10', to: '2026-06-15' },
  { from: '2026-06-22', to: '2026-06-28' },
  { from: '2026-07-05', to: '2026-07-12' },
  { from: '2026-07-18', to: '2026-07-25' },
]

const MOCK_PRICING_RULES: Tables<'pricing_rules'>[] = [
  {
    id: '1',
    property_id: 'mock',
    label_pl: 'Sezon letni',
    label_en: 'Summer season',
    price_per_night: 450,
    priority: 10,
    valid_from: '2026-06-01',
    valid_to: '2026-08-31',
    days_of_week: null,
    active: true,
    created_at: '2026-01-01',
  },
  {
    id: '2',
    property_id: 'mock',
    label_pl: 'Cena bazowa',
    label_en: 'Base price',
    price_per_night: 350,
    priority: 1,
    valid_from: null,
    valid_to: null,
    days_of_week: null,
    active: true,
    created_at: '2026-01-01',
  },
]

type Step = 'calendar' | 'payment'

export default function HomePage() {
  const [step, setStep] = useState<Step>('calendar')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [priceData, setPriceData] = useState<PriceCalculation | undefined>()

  function handleDateSelect(range: DateRange | undefined) {
    setDateRange(range)
    if (range?.from && range.to) {
      setPriceData(calculatePrice(range.from, range.to, MOCK_PRICING_RULES, 30))
    } else {
      setPriceData(undefined)
    }
  }

  function handleGuestSubmit(_values: GuestFormValues) {
    setStep('payment')
  }

  function handleBack() {
    setDateRange(undefined)
    setPriceData(undefined)
  }

  if (step === 'payment' && priceData && dateRange?.from && dateRange.to) {
    const amountToPay = priceData.depositAmount ?? priceData.totalPrice

    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-8 md:py-12 space-y-6">
          <div className="mb-2">
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Podgląd testowy — płatność mock
            </span>
          </div>

          <BookingSummary
            checkIn={dateRange.from}
            checkOut={dateRange.to}
            priceData={priceData}
            depositPercent={30}
            locale="pl"
            expanded
          />

          <div className="rounded-xl border border-neutral-200 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">Płatność</h2>
            <p className="text-sm text-neutral-600">
              Zapłać zadatek {30}% ({priceData.depositAmount?.toLocaleString('pl-PL')} zł). Pozostałe{' '}
              {(priceData.totalPrice - (priceData.depositAmount ?? 0)).toLocaleString('pl-PL')} zł płatne
              przy przyjeździe.
            </p>

            <div className="space-y-2">
              {['Karta płatnicza', 'BLIK', 'Przelewy24'].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 cursor-pointer hover:bg-neutral-50"
                >
                  <input type="radio" name="method" defaultChecked={method === 'Karta płatnicza'} />
                  <span className="text-sm font-medium text-neutral-800">{method}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('calendar')}
                className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Wstecz
              </button>
              <button
                type="button"
                onClick={() => alert(`Mock: zapłać ${amountToPay.toLocaleString('pl-PL')} zł`)}
                className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Zapłać {amountToPay.toLocaleString('pl-PL')} zł
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const datesReady = !!(priceData && dateRange?.from && dateRange.to)

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-2">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Podgląd testowy — dane mockowe
          </span>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Domek Łąckorońska</h1>
          <p className="text-neutral-500 text-sm">
            Maks. 6 osób · check-in 15:00 · check-out 11:00 · min. 2 noce
          </p>
          <p className="text-2xl font-semibold text-neutral-900">od 350 zł / noc</p>
        </div>

        <div className={datesReady ? 'grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12' : 'space-y-4'}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">Wybierz termin</h2>
            <Calendar
              bookedRanges={MOCK_BOOKED_RANGES}
              minNights={2}
              locale="pl"
              onRangeSelect={handleDateSelect}
            />

            {dateRange?.from && !dateRange.to && (
              <p className="text-sm text-neutral-500">
                Minimalna liczba nocy: 2. Wybierz datę wyjazdu.
              </p>
            )}
          </div>

          {datesReady && (
            <div className="space-y-4">
              <GuestForm
                maxGuests={6}
                locale="pl"
                onSubmit={handleGuestSubmit}
                onBack={handleBack}
                loading={false}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
