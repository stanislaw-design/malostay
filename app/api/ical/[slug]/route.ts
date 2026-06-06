import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateIcal } from '@/lib/ical/exporter'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!property) {
    return new NextResponse('Not found', { status: 404 })
  }

  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, check_in, check_out, guest_name, created_at')
    .eq('property_id', property.id)
    .eq('status', 'confirmed')

  const ical = generateIcal(reservations ?? [], slug)

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
      'Cache-Control': 'no-cache, no-store',
    },
  })
}
