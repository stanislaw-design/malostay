import { addDays } from 'date-fns'
import { createServiceClient } from '@/lib/supabase/service'

export interface BookedRange {
  from: Date
  to: Date
}

export interface SerializedBookedRange {
  from: string
  to: string
}

export async function getBookedRanges(propertySlug: string): Promise<SerializedBookedRange[]> {
  const supabase = createServiceClient()

  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .eq('slug', propertySlug)
    .single()

  if (!property) return []

  const [{ data: reservations }, { data: external }] = await Promise.all([
    supabase
      .from('reservations')
      .select('check_in, check_out')
      .eq('property_id', property.id)
      .in('status', ['pending', 'confirmed']),
    supabase
      .from('external_bookings')
      .select('start_date, end_date')
      .eq('property_id', property.id),
  ])

  const ranges: SerializedBookedRange[] = []

  for (const r of reservations ?? []) {
    // check_out is departure day (exclusive) — last blocked night is check_out - 1
    const lastBlockedNight = addDays(new Date(r.check_out), -1)
    ranges.push({ from: r.check_in, to: lastBlockedNight.toISOString().split('T')[0] })
  }

  for (const b of external ?? []) {
    // iCal DTEND is exclusive by convention — same treatment
    const lastBlockedNight = addDays(new Date(b.end_date), -1)
    ranges.push({ from: b.start_date, to: lastBlockedNight.toISOString().split('T')[0] })
  }

  return ranges
}
