import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, FROM, ADMIN_EMAIL } from './resend'

interface BookingEmailData {
  guestName: string
  guestEmail: string
  language: string
  propertyName: string
  checkIn: string
  checkOut: string
  totalNights: number
  totalPrice: number
  depositAmount: number | null
  reservationId: string
}

function fmt(date: string, locale: 'pl' | 'en') {
  return format(new Date(date), 'd MMM yyyy', { locale: locale === 'pl' ? pl : enUS })
}

function guestEmailHtml(d: BookingEmailData, locale: 'pl' | 'en'): { subject: string; html: string } {
  const isPl = locale === 'pl'
  const amountPaid = d.depositAmount ?? d.totalPrice
  const isDeposit = d.depositAmount !== null

  const subject = isPl
    ? `Potwierdzenie rezerwacji — ${d.propertyName}`
    : `Booking confirmation — ${d.propertyName}`

  const depositNote = isDeposit
    ? isPl
      ? `<p style="color:#6b7280;font-size:14px;margin:0">Opłacono zadatek. Pozostała kwota płatna przy zameldowaniu.</p>`
      : `<p style="color:#6b7280;font-size:14px;margin:0">Deposit paid. Remaining balance due at check-in.</p>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">

        <tr><td style="background:#16a34a;padding:32px 32px 24px;text-align:center">
          <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:56px">✓</div>
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">
            ${isPl ? 'Rezerwacja potwierdzona' : 'Booking confirmed'}
          </h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px">
            ${isPl ? `Cześć ${d.guestName}, wszystko gotowe!` : `Hi ${d.guestName}, you're all set!`}
          </p>
        </td></tr>

        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;color:#374151;font-size:15px">
            ${isPl
              ? `Twoja rezerwacja <strong>${d.propertyName}</strong> została potwierdzona. Oto szczegóły:`
              : `Your reservation at <strong>${d.propertyName}</strong> is confirmed. Here are the details:`}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:50%">
                ${isPl ? 'Nr rezerwacji' : 'Reservation ID'}
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:12px;color:#374151;font-weight:600">
                ${d.reservationId.slice(0, 8).toUpperCase()}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">
                ${isPl ? 'Zameldowanie' : 'Check-in'}
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">
                ${fmt(d.checkIn, locale)}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">
                ${isPl ? 'Wymeldowanie' : 'Check-out'}
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">
                ${fmt(d.checkOut, locale)}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">
                ${isPl ? 'Liczba nocy' : 'Nights'}
              </td>
              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">
                ${d.totalNights}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;color:#374151;font-size:14px;font-weight:700">
                ${isPl ? 'Opłacono' : 'Paid'}
              </td>
              <td style="padding:12px 16px;color:#16a34a;font-size:14px;font-weight:700">
                ${Number(amountPaid).toLocaleString('pl-PL')} zł
              </td>
            </tr>
          </table>

          ${depositNote}

          <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.6">
            ${isPl
              ? 'Jeśli masz pytania, odpowiedz na tego maila lub skontaktuj się z nami bezpośrednio.'
              : 'If you have any questions, reply to this email or contact us directly.'}
          </p>
        </td></tr>

        <tr><td style="padding:16px 32px 28px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:12px">
            ${d.propertyName}${process.env.NEXT_PUBLIC_SITE_URL ? ` · ${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}` : ''}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}

function adminEmailHtml(d: BookingEmailData): { subject: string; html: string } {
  const amountPaid = d.depositAmount ?? d.totalPrice
  const isDeposit = d.depositAmount !== null

  const subject = `Nowa rezerwacja — ${d.propertyName} (${fmt(d.checkIn, 'pl')} – ${fmt(d.checkOut, 'pl')})`

  const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">

        <tr><td style="background:#1e3a5f;padding:24px 32px">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Nowa rezerwacja</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:14px">${d.propertyName}</p>
        </td></tr>

        <tr><td style="padding:24px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:20px">
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:45%">Nr rezerwacji</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:12px;font-weight:600;color:#374151">${d.reservationId.slice(0, 8).toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Gość</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">${d.guestName}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Email gościa</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px">
                <a href="mailto:${d.guestEmail}" style="color:#2563eb">${d.guestEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Zameldowanie</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">${fmt(d.checkIn, 'pl')}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Wymeldowanie</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;font-weight:500">${fmt(d.checkOut, 'pl')}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Noce</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px">${d.totalNights}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px">Łączna cena</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px">${Number(d.totalPrice).toLocaleString('pl-PL')} zł</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;color:#374151;font-size:14px;font-weight:700">${isDeposit ? 'Opłacony zadatek' : 'Opłacono'}</td>
              <td style="padding:10px 16px;color:#16a34a;font-size:14px;font-weight:700">${Number(amountPaid).toLocaleString('pl-PL')} zł</td>
            </tr>
          </table>

          ${isDeposit ? `<p style="margin:0;color:#92400e;background:#fef3c7;padding:12px 16px;border-radius:8px;font-size:13px">Zadatek — pozostała kwota <strong>${Number(d.totalPrice - amountPaid).toLocaleString('pl-PL')} zł</strong> płatna przy zameldowaniu.</p>` : ''}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html }
}

export async function sendBookingEmails(reservationId: string): Promise<void> {
  const service = createServiceClient()

  const { data: reservation } = await service
    .from('reservations')
    .select('*, properties(name_pl, name_en)')
    .eq('id', reservationId)
    .single()

  if (!reservation) return

  const property = reservation.properties as { name_pl: string; name_en: string } | null
  const locale = (reservation.language ?? 'pl') as 'pl' | 'en'
  const propertyName = property
    ? locale === 'pl'
      ? property.name_pl
      : property.name_en
    : 'Domek'

  const data: BookingEmailData = {
    guestName: reservation.guest_name,
    guestEmail: reservation.guest_email,
    language: locale,
    propertyName,
    checkIn: reservation.check_in,
    checkOut: reservation.check_out,
    totalNights: reservation.total_nights,
    totalPrice: Number(reservation.total_price),
    depositAmount: reservation.deposit_amount ? Number(reservation.deposit_amount) : null,
    reservationId: reservation.id,
  }

  const resend = getResend()
  const adminEmail = ADMIN_EMAIL
  const from = FROM

  const guest = guestEmailHtml(data, locale)
  const admin = adminEmailHtml(data)

  await Promise.all([
    resend.emails.send({
      from,
      to: data.guestEmail,
      subject: guest.subject,
      html: guest.html,
    }),
    ...(adminEmail
      ? [
          resend.emails.send({
            from,
            to: adminEmail,
            subject: admin.subject,
            html: admin.html,
          }),
        ]
      : []),
  ])
}
