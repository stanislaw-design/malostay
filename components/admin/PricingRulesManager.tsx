'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PricingRuleForm } from '@/components/admin/PricingRuleForm'
import type { Tables } from '@/types/database'

type PricingRule = Tables<'pricing_rules'>

const DAYS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

interface Props {
  propertyId: string
  initialRules: PricingRule[]
}

export function PricingRulesManager({ propertyId, initialRules }: Props) {
  const router = useRouter()
  const [rules, setRules] = useState(initialRules)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function refreshRules() {
    const res = await fetch(`/api/admin/pricing-rules?property_id=${propertyId}`)
    const data = await res.json() as PricingRule[]
    setRules(data)
    router.refresh()
  }

  async function deleteRule(id: string) {
    if (!confirm('Usunąć tę regułę cenową?')) return
    setDeletingId(id)
    await fetch(`/api/admin/pricing-rules/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    await refreshRules()
  }

  async function toggleActive(rule: PricingRule) {
    await fetch(`/api/admin/pricing-rules/${rule.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rule, active: !rule.active }),
    })
    await refreshRules()
  }

  function handleSaved() {
    setShowForm(false)
    setEditingRule(null)
    refreshRules()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Reguły cenowe</h2>
        {!showForm && !editingRule && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline"
          >
            + Dodaj regułę
          </button>
        )}
      </div>

      {showForm && (
        <PricingRuleForm
          propertyId={propertyId}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingRule && (
        <PricingRuleForm
          propertyId={propertyId}
          rule={editingRule}
          onSaved={handleSaved}
          onCancel={() => setEditingRule(null)}
        />
      )}

      {rules.length === 0 && !showForm ? (
        <p className="text-sm text-neutral-500 py-2">Brak reguł cenowych. Dodaj pierwszą regułę.</p>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => {
            const priceZl = Number(rule.price_per_night).toFixed(0)
            const dayLabels = rule.days_of_week?.map((d) => DAYS[d]).join(', ')

            return (
              <div
                key={rule.id}
                className={`flex items-start justify-between gap-4 px-4 py-3 rounded-xl border ${
                  rule.active ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">{rule.label_pl}</span>
                    <span className="text-xs text-neutral-500">{rule.label_en}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-900">{priceZl} zł / noc</span>
                    <span>Priorytet: {rule.priority}</span>
                    {rule.valid_from && <span>od {rule.valid_from}</span>}
                    {rule.valid_to && <span>do {rule.valid_to}</span>}
                    {dayLabels && <span>{dayLabels}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(rule)}
                    className="text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    {rule.active ? 'Dezaktywuj' : 'Aktywuj'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setEditingRule(rule) }}
                    className="text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    disabled={deletingId === rule.id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
