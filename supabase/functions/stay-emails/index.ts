import { createClient } from 'jsr:@supabase/supabase-js@2'
import { preArrivalEmailHtml, reviewRequestEmailHtml, type StayEmailData } from '../_shared/email-templates.ts'

interface ReservationRow {
  id: string
  guest_name: string
  guest_email: string
  language: string | null
  check_in: string
  check_out: string
  properties: { name_pl: string; name_en: string } | null
}

function dateOffset(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function toStayEmailData(r: ReservationRow): { data: StayEmailData; locale: 'pl' | 'en' } {
  const locale = (r.language ?? 'pl') as 'pl' | 'en'
  const propertyName = r.properties
    ? locale === 'pl'
      ? r.properties.name_pl
      : r.properties.name_en
    : 'Domek'

  return {
    locale,
    data: {
      guestName: r.guest_name,
      guestEmail: r.guest_email,
      propertyName,
      checkIn: r.check_in,
      checkOut: r.check_out,
    },
  }
}

async function sendEmail(resendApiKey: string, from: string, to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`)
  }
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM') ?? 'noreply@example.com'

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not set' }), { status: 500 })
  }

  const selectQuery = 'id, guest_name, guest_email, language, check_in, check_out, properties(name_pl, name_en)'

  const [{ data: arriving }, { data: departed }] = await Promise.all([
    supabase
      .from('reservations')
      .select(selectQuery)
      .eq('status', 'confirmed')
      .eq('check_in', dateOffset(2))
      .is('pre_arrival_email_sent_at', null),
    supabase
      .from('reservations')
      .select(selectQuery)
      .eq('status', 'confirmed')
      .eq('check_out', dateOffset(-1))
      .is('review_email_sent_at', null),
  ])

  let preArrivalSent = 0
  let reviewRequestsSent = 0
  const errors: { reservation_id: string; type: string; error: string }[] = []

  for (const reservation of (arriving ?? []) as unknown as ReservationRow[]) {
    try {
      const { data, locale } = toStayEmailData(reservation)
      const { subject, html } = preArrivalEmailHtml(data, locale)

      await sendEmail(resendApiKey, from, data.guestEmail, subject, html)
      await supabase
        .from('reservations')
        .update({ pre_arrival_email_sent_at: new Date().toISOString() })
        .eq('id', reservation.id)

      preArrivalSent += 1
    } catch (err) {
      errors.push({ reservation_id: reservation.id, type: 'pre-arrival', error: err instanceof Error ? err.message : String(err) })
    }
  }

  for (const reservation of (departed ?? []) as unknown as ReservationRow[]) {
    try {
      const { data, locale } = toStayEmailData(reservation)
      const { subject, html } = reviewRequestEmailHtml(data, locale)

      await sendEmail(resendApiKey, from, data.guestEmail, subject, html)
      await supabase
        .from('reservations')
        .update({ review_email_sent_at: new Date().toISOString() })
        .eq('id', reservation.id)

      reviewRequestsSent += 1
    } catch (err) {
      errors.push({ reservation_id: reservation.id, type: 'review', error: err instanceof Error ? err.message : String(err) })
    }
  }

  return new Response(JSON.stringify({ preArrivalSent, reviewRequestsSent, errors }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
