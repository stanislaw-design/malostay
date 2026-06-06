import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { format, subMonths, startOfMonth, endOfMonth, addMonths } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ReservationsChart } from '@/components/admin/ReservationsChart'
import { ChartDateFilter } from '@/components/admin/ChartDateFilter'

const STATUS_CLASSES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-neutral-100 text-neutral-500',
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Potwierdzona',
  pending: 'Oczekująca',
  cancelled: 'Anulowana',
}

interface SearchParams {
  chart_from?: string
  chart_to?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const { chart_from, chart_to } = await searchParams
  const supabase = createServiceClient()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const isCustomRange = !!(chart_from && chart_to)
  const chartFromDate = chart_from ? new Date(chart_from) : subMonths(today, 5)
  const chartToDate = chart_to ? new Date(chart_to) : today
  const filterFrom = chart_from ?? format(subMonths(today, 5), 'yyyy-MM-dd')
  const filterTo = chart_to ?? format(today, 'yyyy-MM-dd')

  const [
    { count: totalReservations },
    { count: confirmedCount },
    { count: pendingCount },
    { data: revenueRows },
    { data: recentReservations },
    { data: upcomingArrivals },
    { data: chartRows },
  ] = await Promise.all([
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reservations').select('total_price').eq('status', 'confirmed'),
    supabase
      .from('reservations')
      .select('id, guest_name, check_in, check_out, total_price, status, properties(name_pl)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('reservations')
      .select('id, guest_name, check_in, check_out, properties(name_pl)')
      .gte('check_in', todayStr)
      .lte('check_in', nextWeekStr)
      .eq('status', 'confirmed')
      .order('check_in'),
    supabase
      .from('reservations')
      .select('created_at, total_price, status')
      .gte('created_at', startOfMonth(chartFromDate).toISOString())
      .lte('created_at', endOfMonth(chartToDate).toISOString())
      .order('created_at'),
  ])

  const totalRevenue = revenueRows?.reduce((sum, r) => sum + r.total_price, 0) ?? 0

  const chartMonths: Date[] = []
  let cursor = startOfMonth(chartFromDate)
  const chartEnd = startOfMonth(chartToDate)
  while (cursor <= chartEnd) {
    chartMonths.push(cursor)
    cursor = addMonths(cursor, 1)
  }

  const monthlyData = chartMonths.map((monthDate) => {
    const start = startOfMonth(monthDate).toISOString()
    const end = endOfMonth(monthDate).toISOString()
    const label = format(monthDate, 'LLL', { locale: pl })
    const month = label.charAt(0).toUpperCase() + label.slice(1)
    const rows = chartRows?.filter(r => r.created_at >= start && r.created_at <= end && r.status !== 'cancelled') ?? []
    return {
      month,
      count: rows.length,
      revenue: rows.reduce((s, r) => s + r.total_price, 0),
    }
  })

  const pendingNum = pendingCount ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Pulpit</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Oto podsumowanie Twoich obiektów</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Wszystkie rezerwacje</div>
          <div className="mt-2 text-3xl font-bold text-neutral-900">{totalReservations ?? 0}</div>
          <div className="mt-1 text-xs text-neutral-400">Łącznie w systemie</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Potwierdzone</div>
          <div className="mt-2 text-3xl font-bold text-neutral-900">{confirmedCount ?? 0}</div>
          <div className="mt-1 text-xs text-green-600">Aktywne rezerwacje</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Przychód</div>
          <div className="mt-2 text-3xl font-bold text-neutral-900">
            {totalRevenue.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł
          </div>
          <div className="mt-1 text-xs text-neutral-400">Z potwierdzonych</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Oczekujące</div>
          <div className="mt-2 text-3xl font-bold text-neutral-900">{pendingNum}</div>
          <div className={`mt-1 text-xs ${pendingNum > 0 ? 'text-yellow-600' : 'text-neutral-400'}`}>
            {pendingNum > 0 ? 'Wymagają uwagi' : 'Wszystko w porządku'}
          </div>
        </div>
      </div>

      {/* Quick actions — horizontal row */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/admin/domki"
          className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <span className="text-sm font-medium text-neutral-800">Zarządzaj domkami</span>
          <span className="text-neutral-400 text-sm">→</span>
        </Link>
        <Link
          href="/admin/kalendarz"
          className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <span className="text-sm font-medium text-neutral-800">Otwórz kalendarz</span>
          <span className="text-neutral-400 text-sm">→</span>
        </Link>
        <Link
          href="/admin/rezerwacje?status=pending"
          className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
        >
          <span className="text-sm font-medium text-neutral-800">Oczekujące rezerwacje</span>
          {pendingNum > 0 ? (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
              {pendingNum}
            </span>
          ) : (
            <span className="text-neutral-400 text-sm">→</span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-neutral-900">Rezerwacje</div>
                <div className="text-xs text-neutral-500">Potwierdzone i oczekujące</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-400">Łączny przychód</div>
                <div className="text-sm font-semibold text-neutral-900">
                  {monthlyData.reduce((s, m) => s + m.revenue, 0).toLocaleString('pl-PL', { maximumFractionDigits: 0 })} zł
                </div>
              </div>
            </div>
            <ChartDateFilter from={filterFrom} to={filterTo} isCustom={isCustomRange} />
            <ReservationsChart data={monthlyData} />
          </div>

          {/* Upcoming arrivals */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-neutral-900">Nadchodzące przyjazdy</div>
                <div className="text-xs text-neutral-500">Najbliższe 7 dni</div>
              </div>
              <Link
                href="/admin/kalendarz"
                className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
              >
                Kalendarz →
              </Link>
            </div>

            {!upcomingArrivals || upcomingArrivals.length === 0 ? (
              <p className="text-sm text-neutral-400 py-6 text-center">Brak zaplanowanych przyjazdów w tym tygodniu</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {upcomingArrivals.map((r) => {
                  const property = r.properties as { name_pl: string } | null
                  const checkIn = format(new Date(r.check_in), 'EEEE, d MMM', { locale: pl })
                  const checkOut = format(new Date(r.check_out), 'd MMM', { locale: pl })
                  return (
                    <div key={r.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{r.guest_name}</div>
                        <div className="text-xs text-neutral-500">
                          {property?.name_pl} · {checkIn} – {checkOut}
                        </div>
                      </div>
                      <Link
                        href={`/admin/rezerwacje/${r.id}`}
                        className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                      >
                        Szczegóły →
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Recent reservations */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-neutral-900">Ostatnie rezerwacje</div>
              <Link
                href="/admin/rezerwacje"
                className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
              >
                Wszystkie →
              </Link>
            </div>

            {!recentReservations || recentReservations.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">Brak rezerwacji</p>
            ) : (
              <div className="space-y-1">
                {recentReservations.map((r) => {
                  const property = r.properties as { name_pl: string } | null
                  return (
                    <Link
                      key={r.id}
                      href={`/admin/rezerwacje/${r.id}`}
                      className="block hover:bg-neutral-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-neutral-900 truncate">{r.guest_name}</div>
                          <div className="text-xs text-neutral-500 truncate">{property?.name_pl ?? '—'}</div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[r.status] ?? 'bg-neutral-100 text-neutral-600'}`}
                        >
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-xs text-neutral-400">
                          {format(new Date(r.check_in), 'd MMM', { locale: pl })} –{' '}
                          {format(new Date(r.check_out), 'd MMM yyyy', { locale: pl })}
                        </div>
                        <div className="text-xs font-medium text-neutral-700">
                          {r.total_price.toFixed(0)} zł
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
