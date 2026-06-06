'use client'

import { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, addMonths } from 'date-fns'
import { pl } from 'date-fns/locale'
import 'react-day-picker/style.css'
import type { Tables } from '@/types/database'

type Reservation = Tables<'reservations'> & { properties: { name_pl: string; slug: string } | null }
type ExternalBooking = Tables<'external_bookings'>

interface Props {
  properties: Array<{ id: string; name_pl: string; slug: string }>
  reservations: Reservation[]
  externalBookings: ExternalBooking[]
  blockedDates: ExternalBooking[]
}

const SOURCE_COLORS: Record<string, string> = {
  booking: 'bg-blue-100 text-blue-800',
  airbnb: 'bg-pink-100 text-pink-800',
  manual: 'bg-red-100 text-red-800',
}

function datesBetween(start: string, end: string): string[] {
  const dates: string[] = []
  const d = new Date(start)
  const last = new Date(end)
  while (d < last) {
    dates.push(format(d, 'yyyy-MM-dd'))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export function AdminCalendar({ properties, reservations, externalBookings, blockedDates }: Props) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id ?? '')
  const [range, setRange] = useState<DateRange | undefined>()
  const [note, setNote] = useState('')
  const [blocking, setBlocking] = useState(false)
  const [blockError, setBlockError] = useState<string | null>(null)
  const [blockedList, setBlockedList] = useState(blockedDates)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredReservations = reservations.filter((r) => r.property_id === selectedPropertyId)
  const filteredExternal = externalBookings.filter((b) => b.property_id === selectedPropertyId)
  const filteredBlocked = blockedList.filter((b) => b.property_id === selectedPropertyId)

  const confirmedRes = filteredReservations.filter((r) => r.status === 'confirmed')
  const confirmedStartDays = confirmedRes.map((r) => new Date(r.check_in))
  const confirmedEndDays = confirmedRes.map((r) => new Date(r.check_out))
  const confirmedMidDays = confirmedRes
    .flatMap((r) => datesBetween(r.check_in, r.check_out).slice(1))
    .map((d) => new Date(d))

  const externalStartDays = filteredExternal.map((b) => new Date(b.start_date))
  const externalEndDays = filteredExternal.map((b) => new Date(b.end_date))
  const externalMidDays = filteredExternal
    .flatMap((b) => datesBetween(b.start_date, b.end_date).slice(1))
    .map((d) => new Date(d))

  const blockedStartDays = filteredBlocked.map((b) => new Date(b.start_date))
  const blockedEndDays = filteredBlocked.map((b) => new Date(b.end_date))
  const blockedMidDays = filteredBlocked
    .flatMap((b) => datesBetween(b.start_date, b.end_date).slice(1))
    .map((d) => new Date(d))

  async function blockDates() {
    if (!range?.from || !range?.to) return
    setBlockError(null)
    setBlocking(true)

    const res = await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: selectedPropertyId,
        start_date: format(range.from, 'yyyy-MM-dd'),
        end_date: format(range.to, 'yyyy-MM-dd'),
        note: note || undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json() as { error: string }
      setBlockError(data.error)
    } else {
      const newBlock = await res.json() as ExternalBooking
      setBlockedList((prev) => [...prev, newBlock])
      setRange(undefined)
      setNote('')
    }

    setBlocking(false)
  }

  async function unblockDate(id: string) {
    setDeletingId(id)
    await fetch(`/api/admin/blocked-dates?id=${id}`, { method: 'DELETE' })
    setBlockedList((prev) => prev.filter((b) => b.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Property selector */}
      {properties.length > 1 && (
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Domek</label>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name_pl}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex gap-4 text-xs mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              Rezerwacja
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
              Zewnętrzna
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              Zablokowana
            </span>
          </div>

          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={pl}
            modifiers={{
              confirmed_start: confirmedStartDays,
              confirmed_mid: confirmedMidDays,
              confirmed_end: confirmedEndDays,
              external_start: externalStartDays,
              external_mid: externalMidDays,
              external_end: externalEndDays,
              blocked_start: blockedStartDays,
              blocked_mid: blockedMidDays,
              blocked_end: blockedEndDays,
            }}
            modifiersClassNames={{
              confirmed_start: 'rdp-day_confirmed_start',
              confirmed_mid: 'rdp-day_confirmed_mid',
              confirmed_end: 'rdp-day_confirmed_end',
              external_start: 'rdp-day_external_start',
              external_mid: 'rdp-day_external_mid',
              external_end: 'rdp-day_external_end',
              blocked_start: 'rdp-day_blocked_start',
              blocked_mid: 'rdp-day_blocked_mid',
              blocked_end: 'rdp-day_blocked_end',
            }}
            styles={{}}
            numberOfMonths={1}
          />

          <style>{`
            /* Zameldowanie: górny trójkąt (prawy-górny) */
            .rdp-day_confirmed_start { background: linear-gradient(to bottom left, #bbf7d0 50%, transparent 50%) !important; color: #166534 !important; }
            .rdp-day_confirmed_mid   { background-color: #bbf7d0 !important; color: #166534 !important; }
            /* Wymeldowanie: dolny trójkąt (lewy-dolny) */
            .rdp-day_confirmed_end   { background: linear-gradient(to top right, #bbf7d0 50%, transparent 50%) !important; color: #166534 !important; }
            /* Ten sam dzień: wymeldowanie + zameldowanie → pełny kolor */
            .rdp-day_confirmed_end.rdp-day_confirmed_start { background: linear-gradient(to bottom left, #bbf7d0 50%, transparent 50%), linear-gradient(to top right, #bbf7d0 50%, transparent 50%) !important; }

            .rdp-day_external_start { background: linear-gradient(to bottom left, #bfdbfe 50%, transparent 50%) !important; color: #1e40af !important; }
            .rdp-day_external_mid   { background-color: #bfdbfe !important; color: #1e40af !important; }
            .rdp-day_external_end   { background: linear-gradient(to top right, #bfdbfe 50%, transparent 50%) !important; color: #1e40af !important; }
            .rdp-day_external_end.rdp-day_external_start { background: linear-gradient(to bottom left, #bfdbfe 50%, transparent 50%), linear-gradient(to top right, #bfdbfe 50%, transparent 50%) !important; }

            .rdp-day_blocked_start  { background: linear-gradient(to bottom left, #fecaca 50%, transparent 50%) !important; color: #991b1b !important; }
            .rdp-day_blocked_mid    { background-color: #fecaca !important; color: #991b1b !important; }
            .rdp-day_blocked_end    { background: linear-gradient(to top right, #fecaca 50%, transparent 50%) !important; color: #991b1b !important; }
            .rdp-day_blocked_end.rdp-day_blocked_start { background: linear-gradient(to bottom left, #fecaca 50%, transparent 50%), linear-gradient(to top right, #fecaca 50%, transparent 50%) !important; }
          `}</style>
        </div>

        {/* Block form */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Zablokuj termin</h3>
            <p className="text-xs text-neutral-500">
              Zaznacz zakres dat w kalendarzu, opcjonalnie podaj powód i kliknij Zablokuj.
            </p>

            {range?.from && range?.to ? (
              <div className="text-sm text-neutral-700">
                <span className="font-medium">
                  {format(range.from, 'd MMM', { locale: pl })} – {format(range.to, 'd MMM yyyy', { locale: pl })}
                </span>
              </div>
            ) : (
              <p className="text-sm text-neutral-400 italic">Brak zaznaczenia</p>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Powód (opcjonalnie)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="np. Remont, Urlop własny"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {blockError && <p className="text-sm text-red-600">{blockError}</p>}

            <button
              onClick={blockDates}
              disabled={!range?.from || !range?.to || blocking}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              {blocking ? 'Blokowanie…' : 'Zablokuj termin'}
            </button>
          </div>

          {/* Blocked list */}
          {filteredBlocked.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900">Zablokowane terminy</h3>
              {filteredBlocked.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <span className="text-neutral-900">
                      {format(new Date(b.start_date), 'd MMM', { locale: pl })} –{' '}
                      {format(new Date(b.end_date), 'd MMM yyyy', { locale: pl })}
                    </span>
                    {b.external_uid && (
                      <span className="text-neutral-500 ml-2 text-xs">({b.external_uid})</span>
                    )}
                  </div>
                  <button
                    onClick={() => unblockDate(b.id)}
                    disabled={deletingId === b.id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 shrink-0"
                  >
                    Odblokuj
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming reservations */}
          {filteredReservations.filter((r) => r.status === 'confirmed' && new Date(r.check_out) >= new Date()).length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900">Nadchodzące rezerwacje</h3>
              {filteredReservations
                .filter((r) => r.status === 'confirmed' && new Date(r.check_out) >= new Date())
                .slice(0, 5)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <span className="text-neutral-900 font-medium">{r.guest_name}</span>
                      <span className="text-neutral-500 ml-2">
                        {format(new Date(r.check_in), 'd MMM', { locale: pl })} –{' '}
                        {format(new Date(r.check_out), 'd MMM', { locale: pl })}
                      </span>
                    </div>
                    <a
                      href={`/admin/rezerwacje/${r.id}`}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline-offset-2 hover:underline shrink-0"
                    >
                      Szczegóły
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
