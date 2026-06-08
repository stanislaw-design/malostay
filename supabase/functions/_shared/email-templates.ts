// Brand tokens — kept in sync with app/globals.css (--color-* / --font-poppins)
// and lib/email/send-booking-emails.ts in the Next.js app.
const FOREST = '#1C2320'
const FOG = '#F4EEE4'
const BONE = '#FDFAF5'
const PINE = '#1E4D2B'
const CHARCOAL = '#2E3330'
const SAGE = '#7A8E7E'
const MIST = '#C8CEC9'
const FONT_STACK = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">'

export interface StayEmailData {
  guestName: string
  guestEmail: string
  propertyName: string
  checkIn: string
  checkOut: string
}

function logoUrl(): string {
  const siteUrl = Deno.env.get('NEXT_PUBLIC_SITE_URL') ?? ''
  return `${siteUrl.replace(/\/$/, '')}/logos/logo-poziome.png`
}

function fmt(date: string, locale: 'pl' | 'en'): string {
  const d = new Date(`${date}T00:00:00Z`)
  return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

function emailHeader(title: string, subtitle: string): string {
  return `<tr><td style="background:${FOREST};padding:48px 40px 40px;text-align:center">
          <img src="${logoUrl()}" width="130" height="52" alt="Malo Stay" style="display:block;margin:0 auto 32px;width:130px;height:auto;border:0" />
          <div style="width:48px;height:1px;background:rgba(253,250,245,0.25);margin:0 auto 32px;line-height:0">&nbsp;</div>
          <h1 style="margin:0;color:${BONE};font-size:23px;font-weight:600;font-family:${FONT_STACK}">
            ${title}
          </h1>
          <p style="margin:12px 0 0;color:rgba(253,250,245,0.7);font-size:15px;font-family:${FONT_STACK}">
            ${subtitle}
          </p>
        </td></tr>`
}

function wrap(title: string, subtitle: string, locale: 'pl' | 'en', body: string, propertyName: string): string {
  const siteUrl = Deno.env.get('NEXT_PUBLIC_SITE_URL') ?? ''

  return `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${FONT_LINK}</head>
<body style="margin:0;padding:0;background:${FOG};font-family:${FONT_STACK}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};padding:56px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${BONE};border-radius:12px;border:1px solid ${MIST};overflow:hidden">

        ${emailHeader(title, subtitle)}

        <tr><td style="padding:44px 40px">
          ${body}
        </td></tr>

        <tr><td style="padding:28px 40px;text-align:center;border-top:1px solid ${MIST}">
          <p style="margin:0;color:${SAGE};font-size:12px;font-family:${FONT_STACK}">
            ${propertyName}${siteUrl ? ` · ${siteUrl.replace(/^https?:\/\//, '')}` : ''}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function button(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px auto 0">
    <tr><td style="border-radius:8px;background:${PINE}">
      <a href="${href}" style="display:inline-block;padding:14px 28px;color:${BONE};font-size:14px;font-weight:600;font-family:${FONT_STACK};text-decoration:none;border-radius:8px">
        ${label}
      </a>
    </td></tr>
  </table>`
}

export function preArrivalEmailHtml(d: StayEmailData, locale: 'pl' | 'en'): { subject: string; html: string } {
  const isPl = locale === 'pl'

  const subject = isPl
    ? `Za 2 dni zaczyna się Wasz pobyt — ${d.propertyName}`
    : `2 days to go — your stay at ${d.propertyName}`

  const packingItems = isPl
    ? [
        'Wygodne, ciepłe ubrania na chłodniejsze wieczory',
        'Strój kąpielowy — na jacuzzi i saunę',
        'Wygodne buty do spacerów w okolicy',
        'Dobry humor i chęć na odpoczynek od pośpiechu',
      ]
    : [
        'Comfortable, warm clothes for cooler evenings',
        'Swimwear — for the jacuzzi and sauna',
        'Comfortable shoes for walks around the area',
        'A good mood and the will to slow down',
      ]

  const list = packingItems
    .map(
      (item) => `<tr>
          <td style="padding:10px 0;color:${CHARCOAL};font-size:14px;line-height:1.6;font-family:${FONT_STACK};vertical-align:top">
            <span style="color:${PINE};font-weight:700">·</span>&ensp;${item}
          </td>
        </tr>`
    )
    .join('')

  const body = `
    <p style="margin:0 0 28px;color:${CHARCOAL};font-size:15px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? `Cześć ${d.guestName}! Już za dwa dni, <strong>${fmt(d.checkIn, locale)}</strong>, zaczyna się Wasz pobyt w <strong>${d.propertyName}</strong>. Czekamy na Was — a w międzyczasie kilka rzeczy, o których warto pomyśleć przed wyjazdem:`
        : `Hi ${d.guestName}! In two days, on <strong>${fmt(d.checkIn, locale)}</strong>, your stay at <strong>${d.propertyName}</strong> begins. We can't wait to host you — meanwhile, here's what's worth packing:`}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${FOG};border-radius:8px;border:1px solid ${MIST};padding:6px 22px">
      ${list}
    </table>

    <p style="margin:28px 0 0;color:${CHARCOAL};font-size:15px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? `Przypominamy też termin Waszego wyjazdu — wymeldowanie zaplanowane jest na <strong>${fmt(d.checkOut, locale)}</strong>.`
        : `As a reminder — your check-out is planned for <strong>${fmt(d.checkOut, locale)}</strong>.`}
    </p>

    <p style="margin:28px 0 0;color:${SAGE};font-size:13px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? 'Jeśli macie pytania dotyczące dojazdu lub zameldowania, po prostu odpowiedzcie na tego maila — chętnie pomożemy.'
        : "If you have any questions about getting here or checking in, just reply to this email — we're happy to help."}
    </p>
  `

  return {
    subject,
    html: wrap(
      isPl ? 'Już za dwa dni!' : 'Two days to go!',
      isPl ? `${d.guestName}, czas zacząć się pakować` : `${d.guestName}, time to start packing`,
      locale,
      body,
      d.propertyName
    ),
  }
}

export function reviewRequestEmailHtml(d: StayEmailData, locale: 'pl' | 'en'): { subject: string; html: string } {
  const isPl = locale === 'pl'

  const subject = isPl
    ? `Jak było w ${d.propertyName}? Zostawcie nam kilka słów`
    : `How was your stay at ${d.propertyName}? We'd love your feedback`

  const reviewUrl = Deno.env.get('REVIEW_URL')

  const body = `
    <p style="margin:0 0 24px;color:${CHARCOAL};font-size:15px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? `Cześć ${d.guestName}! Mamy nadzieję, że pobyt w <strong>${d.propertyName}</strong> (${fmt(d.checkIn, locale)} – ${fmt(d.checkOut, locale)}) był dokładnie tym, czego szukaliście.`
        : `Hi ${d.guestName}! We hope your stay at <strong>${d.propertyName}</strong> (${fmt(d.checkIn, locale)} – ${fmt(d.checkOut, locale)}) was exactly what you were looking for.`}
    </p>

    <p style="margin:0;color:${CHARCOAL};font-size:15px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? 'Kilka słów od Was zajmie chwilę, a nam i przyszłym gościom naprawdę pomoże — chętnie poznamy Wasze wrażenia.'
        : "A couple of words from you would take a moment, and would really help us and future guests — we'd love to hear how it went."}
    </p>

    ${reviewUrl ? button(reviewUrl, isPl ? 'Zostaw opinię' : 'Leave a review') : ''}

    <p style="margin:36px 0 0;color:${SAGE};font-size:13px;line-height:1.7;font-family:${FONT_STACK}">
      ${isPl
        ? 'Dziękujemy, że byliście z nami — mamy nadzieję, że jeszcze się spotkamy.'
        : "Thank you for staying with us — we hope to host you again."}
    </p>
  `

  return {
    subject,
    html: wrap(
      isPl ? 'Dziękujemy za pobyt' : 'Thanks for staying with us',
      isPl ? `${d.guestName}, jak Wam się podobało?` : `${d.guestName}, how was it?`,
      locale,
      body,
      d.propertyName
    ),
  }
}
