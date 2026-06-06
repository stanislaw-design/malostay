'use client'

import Link from 'next/link'

interface Props {
  from: string
  to: string
  isCustom: boolean
}

export function ChartDateFilter({ from, to, isCustom }: Props) {
  return (
    <form method="get" className="flex items-center gap-2 flex-wrap">
      <input
        type="date"
        name="chart_from"
        defaultValue={from}
        className="px-2 py-1 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
      <span className="text-xs text-neutral-400">–</span>
      <input
        type="date"
        name="chart_to"
        defaultValue={to}
        className="px-2 py-1 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
      <button
        type="submit"
        className="px-2.5 py-1 text-xs bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Zastosuj
      </button>
      {isCustom && (
        <Link
          href="/admin"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Resetuj
        </Link>
      )}
    </form>
  )
}
