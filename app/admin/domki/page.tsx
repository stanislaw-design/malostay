import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'

export default async function PropertiesPage() {
  const supabase = createServiceClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_settings(deposit_percent)')
    .order('name_pl')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Domki</h1>
        <Link
          href="/admin/domki/nowy"
          className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          + Dodaj domek
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {!properties || properties.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500 mb-4">Brak domków. Dodaj pierwszy.</p>
            <Link
              href="/admin/domki/nowy"
              className="inline-block px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg"
            >
              Dodaj domek
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Nazwa</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Min. nocy</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Max. gości</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Zadatek</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {properties.map((p) => {
                const settings = p.property_settings as { deposit_percent: number | null } | null

                return (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{p.name_pl}</div>
                      <div className="text-neutral-500">{p.name_en}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 font-mono">{p.slug}</td>
                    <td className="px-4 py-3 text-neutral-700">{p.min_nights}</td>
                    <td className="px-4 py-3 text-neutral-700">{p.max_guests}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {settings?.deposit_percent != null ? `${settings.deposit_percent}%` : 'Pełna'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-500'}`}>
                        {p.active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/domki/${p.id}`}
                        className="text-sm text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline"
                      >
                        Edytuj
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
