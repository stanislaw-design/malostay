export interface IcalEvent {
  start_date: string
  end_date: string
  external_uid: string | null
  cancelled: boolean
}

function unfold(raw: string): string {
  return raw.replace(/\r?\n[ \t]/g, '')
}

function parseIcalDate(value: string): string {
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
  }
  if (/^\d{8}T/.test(value)) {
    const d = value.slice(0, 8)
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
  }
  return value
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function parseIcal(content: string): IcalEvent[] {
  const unfolded = unfold(content)
  const events: IcalEvent[] = []

  const blocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? []

  for (const block of blocks) {
    const get = (key: string): string | null => {
      const match = block.match(new RegExp(`(?:^|\\r?\\n)${key}(?:;[^:]*)?:([^\\r\\n]+)`))
      return match ? match[1].trim() : null
    }

    const dtstart = get('DTSTART')
    const uid = get('UID')
    const status = get('STATUS')

    // CANCELLED events must be tracked so we can remove them from our DB
    const cancelled = status?.toUpperCase() === 'CANCELLED'

    if (!dtstart) continue

    let end_date: string

    const dtend = get('DTEND')
    if (dtend) {
      end_date = parseIcalDate(dtend)
    } else {
      // DURATION fallback (e.g. DURATION:P3D)
      const duration = get('DURATION')
      if (duration) {
        const daysMatch = duration.match(/P(?:(\d+)W)?(?:(\d+)D)?/)
        const weeks = parseInt(daysMatch?.[1] ?? '0', 10)
        const days = parseInt(daysMatch?.[2] ?? '0', 10)
        end_date = addDays(parseIcalDate(dtstart), weeks * 7 + days)
      } else {
        // No DTEND and no DURATION — skip
        continue
      }
    }

    events.push({
      start_date: parseIcalDate(dtstart),
      end_date,
      external_uid: uid,
      cancelled,
    })
  }

  return events
}
