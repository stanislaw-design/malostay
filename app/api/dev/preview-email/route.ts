import { NextRequest, NextResponse } from 'next/server'
import { guestEmailHtml, adminEmailHtml, type BookingEmailData } from '@/lib/email/send-booking-emails'

const MOCK: BookingEmailData = {
  guestName: 'Anna Kowalska',
  guestEmail: 'anna.kowalska@example.com',
  language: 'pl',
  propertyName: 'Domek Jaworowy',
  checkIn: '2026-07-10',
  checkOut: '2026-07-14',
  totalNights: 4,
  totalPrice: 1800,
  depositAmount: 540,
  reservationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') === 'admin' ? 'admin' : 'guest'
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'pl'
  const deposit = searchParams.get('deposit')

  const data: BookingEmailData = {
    ...MOCK,
    language: locale,
    depositAmount: deposit === 'false' ? null : MOCK.depositAmount,
  }

  const { subject, html } =
    type === 'admin' ? adminEmailHtml(data) : guestEmailHtml(data, locale)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Email-Subject': encodeURIComponent(subject),
    },
  })
}
