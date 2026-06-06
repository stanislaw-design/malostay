import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Potwierdzona',
  pending: 'Oczekująca',
  cancelled: 'Anulowana',
}

const STATUS_CLASSES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-neutral-100 text-neutral-500',
}

interface SearchParams {
  status?: string
  property_id?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function ReservationsPage({ searchParams }: Props) {
  const { status, property_id } = await searchParams
  const supabase = createServiceClient()

  let query = supabase
    .from('reservations')
    .select('*, properties(name_pl, slug)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (property_id) query = query.eq('property_id', property_id)

  const { data: reservations } = await query
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name_pl')
    .order('name_pl')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Rezerwacje</h1>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3">
        <select
          name="status"
          defaultValue={status ?? ''}
          className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="">Wszystkie statusy</option>
          <option value="confirmed">Potwierdzone</option>
          <option value="pending">Oczekujące</option>
          <option value="cancelled">Anulowane</option>
        </select>

        <select
          name="property_id"
          defaultValue={property_id ?? ''}
          className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="">Wszystkie domki</option>
          {properties?.map((p) => (
            <option key={p.id} value={p.id}>{p.name_pl}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
        >
          Filtruj
        </button>

        {(status || property_id) && (
          <Link
            href="/admin/rezerwacje"
            className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900"
          >
            Wyczyść
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {!reservations || reservations.length === 0 ? (
          <p className="px-6 py-8 text-sm text-neutral-500 text-center">Brak rezerwacji</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Gość</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Domek</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Daty</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Kwota</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-600">Złożona</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reservations.map((r) => {
                  const property = r.properties as { name_pl: string; slug: string } | null
                  const checkIn = format(new Date(r.check_in), 'd MMM yyyy', { locale: pl })
                  const checkOut = format(new Date(r.check_out), 'd MMM yyyy', { locale: pl })
                  const created = format(new Date(r.created_at), 'd MMM yyyy', { locale: pl })

                  return (
                    <tr key={r.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900">{r.guest_name}</div>
                        <div className="text-neutral-500">{r.guest_email}</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-700">{property?.name_pl ?? '—'}</td>
                      <td className="px-4 py-3 text-neutral-700">
                        {checkIn} – {checkOut}
                        <div className="text-neutral-500">{r.total_nights} {r.total_nights === 1 ? 'noc' : r.total_nights < 5 ? 'noce' : 'nocy'}</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-900 font-medium">
                        {r.total_price.toFixed(0)} zł
                        {r.deposit_amount && (
                          <div className="text-neutral-500 font-normal">
                            zadatek: {r.deposit_amount.toFixed(0)} zł
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[r.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{created}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/rezerwacje/${r.id}`}
                          className="text-sm text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline"
                        >
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
