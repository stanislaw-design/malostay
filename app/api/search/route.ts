import { NextRequest, NextResponse } from 'next/server'
import { differenceInCalendarDays } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd
}

export async function POST(req: NextRequest) {
  const { checkIn, checkOut, guests, cottage } = await req.json()

  if (!checkIn || !checkOut || !guests) {
    return NextResponse.json({ error: 'invalid_params' }, { status: 400 })
  }

  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  if (nights < 1) {
    return NextResponse.json({ error: 'invalid_range' }, { status: 400 })
  }

  const supabase = await createClient()
  let query = supabase
    .from('properties')
    .select('id, slug, name_pl, name_en, cover_image, max_guests, min_nights')
    .eq('active', true)
    .gte('max_guests', guests)
    .lte('min_nights', nights)

  if (cottage) query = query.eq('slug', cottage)

  const { data: properties } = await query

  if (!properties || properties.length === 0) {
    return NextResponse.json({ results: [] })
  }

  const service = createServiceClient()
  const ids = properties.map((p) => p.id)

  const [{ data: reservations }, { data: external }] = await Promise.all([
    service
      .from('reservations')
      .select('property_id, check_in, check_out')
      .in('property_id', ids)
      .in('status', ['pending', 'confirmed']),
    service
      .from('external_bookings')
      .select('property_id, start_date, end_date')
      .in('property_id', ids),
  ])

  const blockedIds = new Set<string>()
  for (const r of reservations ?? []) {
    if (overlaps(checkIn, checkOut, r.check_in, r.check_out)) blockedIds.add(r.property_id)
  }
  for (const b of external ?? []) {
    if (overlaps(checkIn, checkOut, b.start_date, b.end_date)) blockedIds.add(b.property_id)
  }

  const results = properties
    .filter((p) => !blockedIds.has(p.id))
    .map((p) => ({
      slug: p.slug,
      namePl: p.name_pl,
      nameEn: p.name_en,
      coverImage: p.cover_image,
      maxGuests: p.max_guests,
      minNights: p.min_nights,
    }))

  return NextResponse.json({ results })
}
