'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  reservationId: string
  currentStatus: string
}

export function ReservationActions({ reservationId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(status: string) {
    setLoading(status)
    setError(null)

    const res = await fetch(`/api/admin/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      const data = await res.json() as { error: string }
      setError(data.error)
    } else {
      router.refresh()
    }

    setLoading(null)
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {currentStatus !== 'confirmed' && (
          <button
            onClick={() => updateStatus('confirmed')}
            disabled={loading !== null}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading === 'confirmed' ? 'Zapisywanie…' : 'Potwierdź rezerwację'}
          </button>
        )}

        {currentStatus !== 'cancelled' && (
          <button
            onClick={() => updateStatus('cancelled')}
            disabled={loading !== null}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading === 'cancelled' ? 'Zapisywanie…' : 'Anuluj rezerwację'}
          </button>
        )}

        {currentStatus !== 'pending' && (
          <button
            onClick={() => updateStatus('pending')}
            disabled={loading !== null}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            {loading === 'pending' ? 'Zapisywanie…' : 'Ustaw jako oczekującą'}
          </button>
        )}
      </div>
    </div>
  )
}
