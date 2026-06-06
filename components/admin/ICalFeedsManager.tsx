'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Tables } from '@/types/database'

type ICalFeed = Tables<'ical_feeds'>

interface Props {
  propertyId: string
  propertySlug: string
  initialFeeds: ICalFeed[]
}

const PRESETS = [
  {
    name: 'Booking.com',
    logo: '/logos/booking.svg',
    hint: 'Booking.com → Zarządzaj → Synchronizacja kalendarza → Eksportuj kalendarz',
  },
  {
    name: 'Airbnb',
    logo: '/logos/airbnb.svg',
    hint: 'Airbnb → Kalendarz → Dostępność → Połącz kalendarze → Eksportuj',
  },
]

function SyncBadge({ status }: { status: ICalFeed['sync_status'] }) {
  if (status === 'ok') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        OK
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        Błąd
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
      Oczekuje
    </span>
  )
}

export function ICalFeedsManager({ propertyId, propertySlug, initialFeeds }: Props) {
  const router = useRouter()
  const [feeds, setFeeds] = useState(initialFeeds)
  const [showForm, setShowForm] = useState(false)
  const [sourceName, setSourceName] = useState('')
  const [url, setUrl] = useState('')
  const [hint, setHint] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  async function refreshFeeds() {
    const res = await fetch(`/api/admin/ical-feeds?property_id=${propertyId}`)
    const data = await res.json() as ICalFeed[]
    setFeeds(data)
    router.refresh()
  }

  function selectPreset(preset: typeof PRESETS[number]) {
    setSourceName(preset.name)
    setHint(preset.hint)
    setUrl('')
    setShowForm(true)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch('/api/admin/ical-feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId, source_name: sourceName, url }),
    })

    if (!res.ok) {
      const data = await res.json() as { error: string }
      setError(data.error)
      setLoading(false)
      return
    }

    setSourceName('')
    setUrl('')
    setHint(null)
    setShowForm(false)
    setLoading(false)
    await refreshFeeds()
  }

  async function syncFeed(id: string) {
    setSyncingId(id)
    await fetch('/api/admin/ical-feeds/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feed_id: id }),
    })
    setSyncingId(null)
    await refreshFeeds()
  }

  async function deleteFeed(id: string) {
    if (!confirm('Usunąć ten feed iCal? Wszystkie zaimportowane rezerwacje z tego źródła zostaną usunięte.')) return
    setDeletingId(id)
    await fetch(`/api/admin/ical-feeds/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    await refreshFeeds()
  }

  async function toggleFeed(feed: ICalFeed) {
    await fetch(`/api/admin/ical-feeds/${feed.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !feed.active }),
    })
    await refreshFeeds()
  }

  const exportUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/ical/${propertySlug}`

  return (
    <div className="space-y-5">

      {/* Export URL */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 space-y-1">
        <p className="text-xs font-medium text-neutral-700">Twój eksport iCal — wklej ten URL w Booking.com i Airbnb</p>
        <code className="block text-xs text-neutral-500 break-all select-all">{exportUrl}</code>
      </div>

      {/* Import feeds */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-800">Import zewnętrznych kalendarzy</p>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setHint(null) }}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              + Dodaj ręcznie
            </button>
          )}
        </div>

        {/* Preset quick-add buttons */}
        {!showForm && (
          <div className="flex gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => selectPreset(preset)}
                className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
              >
                <img src={preset.logo} alt={preset.name} className="w-5 h-5 rounded" />
                {preset.name}
              </button>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAdd} className="space-y-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4">
            <h3 className="text-sm font-semibold text-neutral-900">
              {sourceName ? `Dodaj ${sourceName}` : 'Nowe źródło iCal'}
            </h3>
            {hint && (
              <p className="text-xs text-neutral-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-700">Gdzie znaleźć URL?</span><br />{hint}
              </p>
            )}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Nazwa źródła</label>
              <input
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                required
                placeholder="np. Booking.com, Airbnb"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">URL pliku .ics</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50"
              >
                {loading ? 'Zapisywanie…' : 'Dodaj i synchronizuj'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(null); setHint(null) }}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50"
              >
                Anuluj
              </button>
            </div>
          </form>
        )}

        {/* Feed list */}
        {feeds.length === 0 && !showForm ? (
          <p className="text-sm text-neutral-400 py-2">Brak feedów. Dodaj Booking.com lub Airbnb.</p>
        ) : (
          <div className="space-y-2">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`rounded-xl border px-4 py-3 space-y-2 ${
                  feed.active ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900">{feed.source_name}</p>
                      <SyncBadge status={feed.sync_status} />
                    </div>
                    <p className="text-xs text-neutral-400 truncate max-w-xs">{feed.url}</p>
                    {feed.last_synced_at && (
                      <p className="text-xs text-neutral-400">
                        Ostatnia sync: {format(new Date(feed.last_synced_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                      </p>
                    )}
                    {feed.sync_status === 'error' && feed.last_error && (
                      <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mt-1">
                        {feed.last_error}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <button
                      onClick={() => syncFeed(feed.id)}
                      disabled={syncingId === feed.id}
                      className="text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
                    >
                      {syncingId === feed.id ? 'Sync…' : 'Sync teraz'}
                    </button>
                    <button
                      onClick={() => toggleFeed(feed)}
                      className="text-neutral-500 hover:text-neutral-900"
                    >
                      {feed.active ? 'Dezaktywuj' : 'Aktywuj'}
                    </button>
                    <button
                      onClick={() => deleteFeed(feed.id)}
                      disabled={deletingId === feed.id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
