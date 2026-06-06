'use client'

import { useState, useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange, Matcher } from 'react-day-picker'
import { addDays, differenceInCalendarDays, isBefore, isAfter } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import 'react-day-picker/style.css'

interface Props {
  bookedRanges: Array<{ from: string; to: string }>
  minNights: number
  locale: 'pl' | 'en'
  onRangeSelect?: (range: DateRange | undefined) => void
}

export function Calendar({ bookedRanges, minNights, locale, onRangeSelect }: Props) {
  const [range, setRange] = useState<DateRange | undefined>()

  // from = check-in day, to = last night (check-out - 1)
  const { booked, checkInDays, checkOutDays, bookedMiddle } = useMemo(() => {
    const booked = bookedRanges.map((r) => ({ from: new Date(r.from), to: new Date(r.to) }))
    const checkInDays = booked.map((r) => r.from)
    const checkOutDays = booked.map((r) => addDays(r.to, 1))
    const bookedMiddle = booked
      .map((r) => ({ from: addDays(r.from, 1), to: r.to }))
      .filter((r) => !isAfter(r.from, r.to))
    return { booked, checkInDays, checkOutDays, bookedMiddle }
  }, [bookedRanges])

  const disabled = useMemo<Matcher[]>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const matchers: Matcher[] = [
      { before: today },
      ...bookedMiddle,
    ]

    if (range?.from && !range.to) {
      if (minNights > 1) {
        matchers.push({ from: addDays(range.from, 1), to: addDays(range.from, minNights - 1) })
      }
      // find nearest check-in day after selected start — user can check out ON that day
      const nextCheckIn = booked
        .map((r) => r.from)
        .filter((d) => isAfter(d, range.from!))
        .reduce<Date | undefined>((min, d) => (!min || isBefore(d, min) ? d : min), undefined)
      if (nextCheckIn) {
        matchers.push({ after: nextCheckIn })
      }
    }

    return matchers
  }, [range, booked, bookedMiddle, minNights])

  function handleSelect(newRange: DateRange | undefined) {
    if (!newRange?.from) {
      setRange(undefined)
      onRangeSelect?.(undefined)
      return
    }

    if (newRange.from && newRange.to) {
      const nights = differenceInCalendarDays(newRange.to, newRange.from)
      if (nights === 0) {
        if (range?.from && differenceInCalendarDays(newRange.from, range.from) === 0) {
          setRange(undefined)
          onRangeSelect?.(undefined)
        } else {
          setRange({ from: newRange.from, to: undefined })
        }
        return
      }
      if (nights < minNights) {
        setRange({ from: newRange.from, to: undefined })
        return
      }
    }

    setRange(newRange)
    if (newRange.from && newRange.to) {
      onRangeSelect?.(newRange)
    }
  }

  const today = new Date()
  const nights =
    range?.from && range.to ? differenceInCalendarDays(range.to, range.from) : undefined

  return (
    <div className="flex flex-col gap-3">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabled}
        numberOfMonths={2}
        pagedNavigation
        locale={locale === 'pl' ? pl : enUS}
        startMonth={today}
        modifiers={{
          checkIn: checkInDays,
          checkOut: checkOutDays,
          booked: bookedMiddle,
        }}
        modifiersClassNames={{
          today: 'rdp-today',
          selected: 'rdp-selected',
          range_start: 'rdp-range_start',
          range_end: 'rdp-range_end',
          range_middle: 'rdp-range_middle',
          disabled: 'rdp-disabled',
          checkIn: 'day-check-in',
          checkOut: 'day-check-out',
          booked: 'day-booked',
        }}
        className="rdp-booking"
      />

      {range?.from && !range.to && (
        <p className="text-sm text-neutral-500">
          {locale === 'pl'
            ? `Minimalna liczba nocy: ${minNights}`
            : `Minimum stay: ${minNights} nights`}
        </p>
      )}

      {nights !== undefined && (
        <p className="text-sm font-medium">
          {locale === 'pl' ? `${nights} nocy` : `${nights} nights`}
        </p>
      )}
    </div>
  )
}
