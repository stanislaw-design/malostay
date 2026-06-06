import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { PricingRulesManager } from '@/components/admin/PricingRulesManager'
import { ICalFeedsManager } from '@/components/admin/ICalFeedsManager'
import type { Tables } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()

  const [
    { data: property, error },
    { data: pricingRules },
    { data: icalFeeds },
  ] = await Promise.all([
    supabase
      .from('properties')
      .select('*, property_settings(deposit_percent)')
      .eq('id', id)
      .single(),
    supabase
      .from('pricing_rules')
      .select('*')
      .eq('property_id', id)
      .order('priority', { ascending: false }),
    supabase
      .from('ical_feeds')
      .select('*')
      .eq('property_id', id)
      .order('created_at'),
  ])

  if (error || !property) notFound()

  const settings = property.property_settings as Tables<'property_settings'> | null

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/domki" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Domki
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{property.name_pl}</h1>
          <p className="text-sm text-neutral-500 font-mono mt-0.5">{property.slug}</p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${property.active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-500'}`}>
          {property.active ? 'Aktywny' : 'Nieaktywny'}
        </span>
      </div>

      {/* Property edit form */}
      <PropertyForm
        property={{ ...property, property_settings: settings }}
      />

      <hr className="border-neutral-200" />

      {/* Pricing rules */}
      <div className="bg-white border border-neutral-200 rounded-xl px-5 py-5">
        <PricingRulesManager
          propertyId={id}
          initialRules={pricingRules ?? []}
        />
      </div>

      <hr className="border-neutral-200" />

      {/* iCal feeds */}
      <div className="bg-white border border-neutral-200 rounded-xl px-5 py-5">
        <ICalFeedsManager
          propertyId={id}
          propertySlug={property.slug}
          initialFeeds={icalFeeds ?? []}
        />
      </div>
    </div>
  )
}
