'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/types/database'

type Property = Tables<'properties'>
type PropertySettings = Tables<'property_settings'>

interface Props {
  property?: Property & { property_settings?: PropertySettings | null }
}

interface FormValues {
  name_pl: string
  name_en: string
  slug: string
  description_pl: string
  description_en: string
  contact_email: string
  cover_image: string
  min_nights: number
  max_guests: number
  check_in_time: string
  check_out_time: string
  deposit_percent: string
  active: boolean
}

export function PropertyForm({ property }: Props) {
  const router = useRouter()
  const isEdit = !!property

  const [values, setValues] = useState<FormValues>({
    name_pl: property?.name_pl ?? '',
    name_en: property?.name_en ?? '',
    slug: property?.slug ?? '',
    description_pl: property?.description_pl ?? '',
    description_en: property?.description_en ?? '',
    contact_email: property?.contact_email ?? '',
    cover_image: property?.cover_image ?? '',
    min_nights: property?.min_nights ?? 2,
    max_guests: property?.max_guests ?? 6,
    check_in_time: property?.check_in_time ?? '15:00',
    check_out_time: property?.check_out_time ?? '11:00',
    deposit_percent: property?.property_settings?.deposit_percent?.toString() ?? '',
    active: property?.active ?? true,
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const slugValid = /^[a-z0-9-]+$/.test(values.slug)

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name_pl: values.name_pl,
      name_en: values.name_en,
      slug: values.slug,
      description_pl: values.description_pl || null,
      description_en: values.description_en || null,
      contact_email: values.contact_email,
      cover_image: values.cover_image || null,
      min_nights: values.min_nights,
      max_guests: values.max_guests,
      check_in_time: values.check_in_time,
      check_out_time: values.check_out_time,
      active: values.active,
      deposit_percent: values.deposit_percent ? parseFloat(values.deposit_percent) : null,
    }

    const url = isEdit ? `/api/admin/properties/${property.id}` : '/api/admin/properties'
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

    router.push('/admin/domki')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Podstawowe info */}
      <section id="podstawowe" className="scroll-mt-16 bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">Podstawowe informacje</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Nazwa (PL) *</label>
            <input
              value={values.name_pl}
              onChange={(e) => set('name_pl', e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Nazwa (EN) *</label>
            <input
              value={values.name_en}
              onChange={(e) => set('name_en', e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Slug (URL) *</label>
            <input
              value={values.slug}
              onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              required
              pattern="[a-z0-9-]+"
              title="Tylko małe litery, cyfry i myślniki"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 font-mono ${
                values.slug && !slugValid
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-neutral-300 focus:ring-neutral-900'
              }`}
            />
            {values.slug && !slugValid ? (
              <p className="text-xs text-red-600 mt-1">Tylko małe litery, cyfry i myślniki, np. <code>domek-nad-stawem</code></p>
            ) : (
              <p className="text-xs text-neutral-500 mt-1">
                {values.slug ? `Adres: /domki/${values.slug}` : <>Np. <code>domek-nad-stawem</code></>}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Email kontaktowy *</label>
            <input
              type="email"
              value={values.contact_email}
              onChange={(e) => set('contact_email', e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Zdjęcie główne</label>
            <input
              type="text"
              value={values.cover_image}
              onChange={(e) => set('cover_image', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-700">Opis (PL)</label>
              <span className="text-xs text-neutral-400">{values.description_pl.length} znaków</span>
            </div>
            <textarea
              value={values.description_pl}
              onChange={(e) => set('description_pl', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-700">Opis (EN)</label>
              <span className="text-xs text-neutral-400">{values.description_en.length} znaków</span>
            </div>
            <textarea
              value={values.description_en}
              onChange={(e) => set('description_en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="active"
            type="checkbox"
            checked={values.active}
            onChange={(e) => set('active', e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="active" className="text-sm text-neutral-700">Domek aktywny (widoczny publicznie)</label>
        </div>
      </section>

      {/* Konfiguracja */}
      <section id="konfiguracja" className="scroll-mt-16 bg-white border border-neutral-200 rounded-xl px-5 py-4 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900">Konfiguracja pobytu</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Min. nocy</label>
            <input
              type="number"
              min={1}
              value={values.min_nights}
              onChange={(e) => set('min_nights', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Max. gości</label>
            <input
              type="number"
              min={1}
              value={values.max_guests}
              onChange={(e) => set('max_guests', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Check-in</label>
            <input
              type="time"
              value={values.check_in_time}
              onChange={(e) => set('check_in_time', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Check-out</label>
            <input
              type="time"
              value={values.check_out_time}
              onChange={(e) => set('check_out_time', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Zadatek (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={values.deposit_percent}
              onChange={(e) => set('deposit_percent', e.target.value)}
              placeholder="np. 30"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>
        <p className="text-xs text-neutral-500">Zadatek: puste pole = pełna płatność przy rezerwacji</p>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 bg-white/90 backdrop-blur border border-neutral-200 rounded-xl px-4 py-3 shadow-sm">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Zapisywanie…' : isEdit ? 'Zapisz zmiany' : 'Dodaj domek'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/domki')}
          className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Anuluj
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </form>
  )
}
