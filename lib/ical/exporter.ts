import type { Tables } from '@/types/database'

type Reservation = Pick<
  Tables<'reservations'>,
  'id' | 'check_in' | 'check_out' | 'guest_name' | 'created_at'
>

function toIcalDate(isoDate: string): string {
  return isoDate.replace(/-/g, '')
}

function formatNow(): string {
  return new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
}

export function generateIcal(reservations: Reservation[], propertySlug: string): string {
  const now = formatNow()

  const events = reservations
    .map((r) => {
      return [
        'BEGIN:VEVENT',
        `UID:${r.id}@${propertySlug}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${toIcalDate(r.check_in)}`,
        `DTEND;VALUE=DATE:${toIcalDate(r.check_out)}`,
        `SUMMARY:Reservation`,
        'END:VEVENT',
      ].join('\r\n')
    })
    .join('\r\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${propertySlug}//Booking System//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n')
}
