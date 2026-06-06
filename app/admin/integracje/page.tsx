import { createServiceClient } from '@/lib/supabase/service'
import { ICalFeedsManager } from '@/components/admin/ICalFeedsManager'

export const metadata = { title: 'Integracje — Panel admina' }

export default async function IntegracjePage() {
  const supabase = createServiceClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('id, slug, name_pl, active')
    .order('name_pl')

  const { data: feeds } = await supabase
    .from('ical_feeds')
    .select('*')
    .order('created_at')

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Integracje kalendarza</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Synchronizacja z Booking.com, Airbnb i innymi serwisami przez iCal. Sync odbywa się automatycznie co 5 minut.
        </p>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl px-6 py-10 text-center">
          <p className="text-sm text-neutral-500">Brak domków. Dodaj domek, żeby skonfigurować integracje.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => {
            const propertyFeeds = feeds?.filter(f => f.property_id === property.id) ?? []

            return (
              <div key={property.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{property.name_pl}</p>
                    <p className="text-xs text-neutral-400 font-mono">{property.slug}</p>
                  </div>
                  {!property.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                      Nieaktywny
                    </span>
                  )}
                </div>
                <div className="px-5 py-4">
                  <ICalFeedsManager
                    propertyId={property.id}
                    propertySlug={property.slug}
                    initialFeeds={propertyFeeds}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
