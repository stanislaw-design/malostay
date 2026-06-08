import { format } from 'date-fns'
import { pl, enUS } from 'date-fns/locale'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, FROM, ADMIN_EMAIL } from './resend'

export interface BookingEmailData {
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

// Defense in depth: guest-supplied strings are escaped before being interpolated
// into HTML email markup, even though input validation already restricts them.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Brand tokens — kept in sync with app/globals.css (--color-* / --font-poppins)
const FOREST = '#1C2320'
const FOG = '#F4EEE4'
const BONE = '#FDFAF5'
const PINE = '#1E4D2B'
const CHARCOAL = '#2E3330'
const SAGE = '#7A8E7E'
const MIST = '#C8CEC9'
const FONT_STACK = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">'
const LOGO_URL = `${(process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')}/logos/logo-poziome.png`

function emailHeader(title: string, subtitle: string): string {
  return `<tr><td style="background:${FOREST};padding:48px 40px 40px;text-align:center">
          <img src="${LOGO_URL}" width="130" height="52" alt="Malo Stay" style="display:block;margin:0 auto 32px;width:130px;height:auto;border:0" />
          <div style="width:48px;height:1px;background:rgba(253,250,245,0.25);margin:0 auto 32px;line-height:0">&nbsp;</div>
          <h1 style="margin:0;color:${BONE};font-size:23px;font-weight:600;font-family:${FONT_STACK}">
            ${title}
          </h1>
          <p style="margin:12px 0 0;color:rgba(253,250,245,0.7);font-size:15px;font-family:${FONT_STACK}">
            ${subtitle}
          </p>
        </td></tr>`
}

export function guestEmailHtml(d: BookingEmailData, locale: 'pl' | 'en'): { subject: string; html: string } {
  const isPl = locale === 'pl'
  const amountPaid = d.depositAmount ?? d.totalPrice
  const isDeposit = d.depositAmount !== null

  const subject = isPl
    ? `Potwierdzenie rezerwacji — ${d.propertyName}`
    : `Booking confirmation — ${d.propertyName}`

  const depositNote = isDeposit
    ? isPl
      ? `<p style="color:${SAGE};font-size:14px;margin:0;font-family:${FONT_STACK}">Opłacono zadatek. Pozostała kwota płatna przy zameldowaniu.</p>`
      : `<p style="color:${SAGE};font-size:14px;margin:0;font-family:${FONT_STACK}">Deposit paid. Remaining balance due at check-in.</p>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${FONT_LINK}</head>
<body style="margin:0;padding:0;background:${FOG};font-family:${FONT_STACK}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};padding:56px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${BONE};border-radius:12px;border:1px solid ${MIST};overflow:hidden">

        ${emailHeader(
          isPl ? 'Rezerwacja potwierdzona' : 'Booking confirmed',
          isPl
            ? `Cześć ${escapeHtml(d.guestName)}, wszystko gotowe!`
            : `Hi ${escapeHtml(d.guestName)}, you're all set!`
        )}

        <tr><td style="padding:44px 40px">
          <p style="margin:0 0 32px;color:${CHARCOAL};font-size:15px;line-height:1.7;font-family:${FONT_STACK}">
            ${isPl
              ? `Twoja rezerwacja <strong>${d.propertyName}</strong> została potwierdzona. Oto szczegóły:`
              : `Your reservation at <strong>${d.propertyName}</strong> is confirmed. Here are the details:`}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};border-radius:8px;border:1px solid ${MIST};overflow:hidden">
            <tr>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;width:50%;font-family:${FONT_STACK}">
                ${isPl ? 'Nr rezerwacji' : 'Reservation ID'}
              </td>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};font-family:monospace;font-size:12px;color:${CHARCOAL};font-weight:600">
                ${d.reservationId.slice(0, 8).toUpperCase()}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">
                ${isPl ? 'Zameldowanie' : 'Check-in'}
              </td>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">
                ${fmt(d.checkIn, locale)}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">
                ${isPl ? 'Wymeldowanie' : 'Check-out'}
              </td>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">
                ${fmt(d.checkOut, locale)}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">
                ${isPl ? 'Liczba nocy' : 'Nights'}
              </td>
              <td style="padding:18px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">
                ${d.totalNights}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 22px;color:${CHARCOAL};font-size:14px;font-weight:700;font-family:${FONT_STACK}">
                ${isPl ? 'Opłacono' : 'Paid'}
              </td>
              <td style="padding:18px 22px;color:${PINE};font-size:14px;font-weight:700;font-family:${FONT_STACK}">
                ${Number(amountPaid).toLocaleString('pl-PL')} zł
              </td>
            </tr>
          </table>

          ${depositNote ? `<div style="margin-top:24px">${depositNote}</div>` : ''}

          <p style="margin:36px 0 0;color:${SAGE};font-size:13px;line-height:1.7;font-family:${FONT_STACK}">
            ${isPl
              ? 'Jeśli masz pytania, odpowiedz na tego maila lub skontaktuj się z nami bezpośrednio.'
              : 'If you have any questions, reply to this email or contact us directly.'}
          </p>
        </td></tr>

        <tr><td style="padding:28px 40px;text-align:center;border-top:1px solid ${MIST}">
          <p style="margin:0;color:${SAGE};font-size:12px;font-family:${FONT_STACK}">
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

export function adminEmailHtml(d: BookingEmailData): { subject: string; html: string } {
  const amountPaid = d.depositAmount ?? d.totalPrice
  const isDeposit = d.depositAmount !== null

  const subject = `Nowa rezerwacja — ${d.propertyName} (${fmt(d.checkIn, 'pl')} – ${fmt(d.checkOut, 'pl')})`

  const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8">${FONT_LINK}</head>
<body style="margin:0;padding:0;background:${FOG};font-family:${FONT_STACK}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};padding:56px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${BONE};border-radius:12px;border:1px solid ${MIST};overflow:hidden">

        ${emailHeader('Nowa rezerwacja', d.propertyName)}

        <tr><td style="padding:44px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};border-radius:8px;border:1px solid ${MIST};overflow:hidden;margin-bottom:28px">
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;width:45%;font-family:${FONT_STACK}">Nr rezerwacji</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};font-family:monospace;font-size:12px;font-weight:600;color:${CHARCOAL}">${d.reservationId.slice(0, 8).toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Gość</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">${escapeHtml(d.guestName)}</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Email gościa</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-family:${FONT_STACK}">
                <a href="mailto:${escapeHtml(d.guestEmail)}" style="color:${PINE}">${escapeHtml(d.guestEmail)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Zameldowanie</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">${fmt(d.checkIn, 'pl')}</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Wymeldowanie</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-weight:500;font-family:${FONT_STACK}">${fmt(d.checkOut, 'pl')}</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Noce</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-family:${FONT_STACK}">${d.totalNights}</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${SAGE};font-size:13px;font-family:${FONT_STACK}">Łączna cena</td>
              <td style="padding:16px 22px;border-bottom:1px solid ${MIST};color:${CHARCOAL};font-size:14px;font-family:${FONT_STACK}">${Number(d.totalPrice).toLocaleString('pl-PL')} zł</td>
            </tr>
            <tr>
              <td style="padding:16px 22px;color:${CHARCOAL};font-size:14px;font-weight:700;font-family:${FONT_STACK}">${isDeposit ? 'Opłacony zadatek' : 'Opłacono'}</td>
              <td style="padding:16px 22px;color:${PINE};font-size:14px;font-weight:700;font-family:${FONT_STACK}">${Number(amountPaid).toLocaleString('pl-PL')} zł</td>
            </tr>
          </table>

          ${isDeposit ? `<p style="margin:24px 0 0;color:${CHARCOAL};background:${FOG};border:1px solid ${MIST};padding:12px 16px;border-radius:8px;font-size:13px;font-family:${FONT_STACK}">Zadatek — pozostała kwota <strong>${Number(d.totalPrice - amountPaid).toLocaleString('pl-PL')} zł</strong> płatna przy zameldowaniu.</p>` : ''}
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
