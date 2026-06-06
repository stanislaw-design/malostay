import { createServiceClient } from '@/lib/supabase/service'
import { AdminCalendar } from '@/components/admin/AdminCalendar'
import type { Tables } from '@/types/database'

export default async function KalendarzPage() {
  const supabase = createServiceClient()

  const [
    { data: properties },
    { data: reservations },
    { data: externalBookings },
    { data: blockedDates },
  ] = await Promise.all([
    supabase.from('properties').select('id, name_pl, slug').order('name_pl'),
    supabase
      .from('reservations')
      .select('*, properties(name_pl, slug)')
      .in('status', ['confirmed', 'pending'])
      .order('check_in'),
    supabase
      .from('external_bookings')
      .select('*')
      .neq('source', 'manual')
      .order('start_date'),
    supabase
      .from('external_bookings')
      .select('*')
      .eq('source', 'manual')
      .order('start_date'),
  ])

  if (!properties || properties.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-neutral-900">Kalendarz</h1>
        <p className="text-sm text-neutral-500">
          Brak domków. <a href="/admin/domki/nowy" className="underline">Dodaj pierwszy domek</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900">Kalendarz</h1>
      <AdminCalendar
        properties={properties}
        reservations={(reservations as (Tables<'reservations'> & { properties: { name_pl: string; slug: string } | null })[]) ?? []}
        externalBookings={externalBookings ?? []}
        blockedDates={blockedDates ?? []}
      />
    </div>
  )
}
