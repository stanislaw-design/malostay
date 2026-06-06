import { NextResponse } from 'next/server'
import { addDays, format } from 'date-fns'

// Mock iCal feed for local development.
// Covers all edge cases the real sync must handle:
//   ?scenario=normal    — 3 standard bookings with UIDs (default)
//   ?scenario=cancelled — one booking is STATUS:CANCELLED (should be deleted from DB)
//   ?scenario=no-uid    — event has no UID (should get synthetic key, no duplicates)
//   ?scenario=duration  — uses DURATION instead of DTEND
//   ?scenario=empty     — no events (should delete all stored for this feed)

function toIcalDate(date: Date): string {
  return format(date, 'yyyyMMdd')
}

function toIcalDateTime(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'")
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const scenario = url.searchParams.get('scenario') ?? 'normal'
  const today = new Date()

  let events = ''

  if (scenario === 'normal') {
    const bookings = [
      { start: addDays(today, 5),  end: addDays(today, 10), uid: 'mock-booking-1' },
      { start: addDays(today, 20), end: addDays(today, 25), uid: 'mock-booking-2' },
      { start: addDays(today, 40), end: addDays(today, 44), uid: 'mock-booking-3' },
    ]
    events = bookings.map(b => [
      'BEGIN:VEVENT',
      `UID:${b.uid}@mock.local`,
      `DTSTAMP:${toIcalDateTime(today)}`,
      `DTSTART;VALUE=DATE:${toIcalDate(b.start)}`,
      `DTEND;VALUE=DATE:${toIcalDate(b.end)}`,
      'SUMMARY:Mock Booking',
      'END:VEVENT',
    ].join('\r\n')).join('\r\n')
  }

  if (scenario === 'cancelled') {
    // booking-1: active, booking-2: CANCELLED (must be removed from DB if it was there)
    events = [
      'BEGIN:VEVENT',
      'UID:mock-booking-1@mock.local',
      `DTSTAMP:${toIcalDateTime(today)}`,
      `DTSTART;VALUE=DATE:${toIcalDate(addDays(today, 5))}`,
      `DTEND;VALUE=DATE:${toIcalDate(addDays(today, 10))}`,
      'SUMMARY:Active Booking',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:mock-booking-2@mock.local',
      `DTSTAMP:${toIcalDateTime(today)}`,
      `DTSTART;VALUE=DATE:${toIcalDate(addDays(today, 20))}`,
      `DTEND;VALUE=DATE:${toIcalDate(addDays(today, 25))}`,
      'SUMMARY:Cancelled Booking',
      'STATUS:CANCELLED',
      'END:VEVENT',
    ].join('\r\n')
  }

  if (scenario === 'no-uid') {
    // Event without UID — sync must generate synthetic key to avoid duplicates
    events = [
      'BEGIN:VEVENT',
      `DTSTAMP:${toIcalDateTime(today)}`,
      `DTSTART;VALUE=DATE:${toIcalDate(addDays(today, 7))}`,
      `DTEND;VALUE=DATE:${toIcalDate(addDays(today, 12))}`,
      'SUMMARY:Booking Without UID',
      'END:VEVENT',
    ].join('\r\n')
  }

  if (scenario === 'duration') {
    // Uses DURATION instead of DTEND (e.g. Google Calendar exports)
    events = [
      'BEGIN:VEVENT',
      'UID:mock-duration-1@mock.local',
      `DTSTAMP:${toIcalDateTime(today)}`,
      `DTSTART;VALUE=DATE:${toIcalDate(addDays(today, 3))}`,
      'DURATION:P5D',
      'SUMMARY:Booking With Duration',
      'END:VEVENT',
    ].join('\r\n')
  }

  // scenario === 'empty': events stays '', simulates cancelled-all or empty calendar

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mock//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...(events ? [events] : []),
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
