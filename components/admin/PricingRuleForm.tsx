'use client'

import { useState } from 'react'
import type { Tables } from '@/types/database'

type PricingRule = Tables<'pricing_rules'>

interface Props {
  propertyId: string
  rule?: PricingRule
  onSaved: () => void
  onCancel: () => void
}

const DAYS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

export function PricingRuleForm({ propertyId, rule, onSaved, onCancel }: Props) {
  const isEdit = !!rule

  const [labelPl, setLabelPl] = useState(rule?.label_pl ?? '')
  const [labelEn, setLabelEn] = useState(rule?.label_en ?? '')
  const [price, setPrice] = useState(rule ? String(rule.price_per_night) : '')
  const [priority, setPriority] = useState(rule?.priority ?? 1)
  const [validFrom, setValidFrom] = useState(rule?.valid_from ?? '')
  const [validTo, setValidTo] = useState(rule?.valid_to ?? '')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(rule?.days_of_week ?? [])
  const [active, setActive] = useState(rule?.active ?? true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      property_id: propertyId,
      label_pl: labelPl,
      label_en: labelEn,
      price_per_night: parseFloat(price),
      priority,
      valid_from: validFrom || null,
      valid_to: validTo || null,
      days_of_week: daysOfWeek.length > 0 ? daysOfWeek : null,
      active,
    }

    const url = isEdit ? `/api/admin/pricing-rules/${rule.id}` : '/api/admin/pricing-rules'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json() as { error: string }
      setError(data.error)
      setLoading(false)
      return
    }

    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4">
      <h3 className="text-sm font-semibold text-neutral-900">{isEdit ? 'Edytuj regułę' : 'Nowa reguła cenowa'}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Nazwa (PL) *</label>
          <input
            value={labelPl}
            onChange={(e) => setLabelPl(e.target.value)}
            required
            placeholder="np. Sezon letni"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Nazwa (EN) *</label>
          <input
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            required
            placeholder="e.g. Summer season"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Cena za noc (zł) *</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="np. 350"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Priorytet</label>
          <input
            type="number"
            min={0}
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Ważna od</label>
          <input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Ważna do</label>
          <input
            type="date"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-2">
          Dni tygodnia (puste = wszystkie)
        </label>
        <div className="flex gap-1">
          {DAYS.map((day, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={`w-9 h-9 text-xs font-medium rounded-lg border transition-colors ${
                daysOfWeek.includes(i)
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rule-active"
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300"
        />
        <label htmlFor="rule-active" className="text-sm text-neutral-700">Reguła aktywna</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Zapisywanie…' : isEdit ? 'Zapisz' : 'Dodaj regułę'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50"
        >
          Anuluj
        </button>
      </div>
    </form>
  )
}
