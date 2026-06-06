import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getBookedRanges } from '@/lib/availability'
import { t, type Locale } from '@/lib/i18n/t'
import { BookingWidget } from '@/components/booking/BookingWidget'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params
  const safeLocale = locale as Locale

  const supabase = await createClient()
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!property) notFound()

  const service = createServiceClient()

  const [{ data: settings }, { data: pricingRules }, bookedRanges] = await Promise.all([
    service
      .from('property_settings')
      .select('deposit_percent')
      .eq('property_id', property.id)
      .single(),
    supabase
      .from('pricing_rules')
      .select('*')
      .eq('property_id', property.id)
      .eq('active', true)
      .order('priority', { ascending: false }),
    getBookedRanges(slug),
  ])

  const name = safeLocale === 'pl' ? property.name_pl : property.name_en
  const description = safeLocale === 'pl' ? property.description_pl : property.description_en

  const samplePrice =
    pricingRules && pricingRules.length > 0
      ? Math.min(...pricingRules.map((r) => Number(r.price_per_night)))
      : null

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {property.cover_image && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-neutral-100">
            <img src={property.cover_image} alt={name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900">{name}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <span>
                {t(safeLocale, 'property.maxGuests')}: <strong>{property.max_guests}</strong>
              </span>
              <span>
                {t(safeLocale, 'property.checkIn')}: <strong>{property.check_in_time}</strong>
              </span>
              <span>
                {t(safeLocale, 'property.checkOut')}: <strong>{property.check_out_time}</strong>
              </span>
              <span>
                {t(safeLocale, 'property.minNights')}: <strong>{property.min_nights}</strong>
              </span>
            </div>

            {samplePrice != null && (
              <p className="text-2xl font-semibold text-neutral-900">
                {t(safeLocale, 'property.priceFrom', { price: samplePrice })}
              </p>
            )}

            {description && (
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{description}</p>
            )}
          </div>

          <div>
            <BookingWidget
              property={{
                id: property.id,
                slug: property.slug,
                minNights: property.min_nights,
                maxGuests: property.max_guests,
                checkInTime: property.check_in_time,
                checkOutTime: property.check_out_time,
              }}
              pricingRules={pricingRules ?? []}
              bookedRanges={bookedRanges}
              depositPercent={settings?.deposit_percent ?? null}
              stripeConfigured={!!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
              locale={safeLocale}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const supabase = await createClient()
  const { data: property } = await supabase
    .from('properties')
    .select('name_pl, name_en')
    .eq('slug', slug)
    .single()
  if (!property) return {}
  return { title: locale === 'pl' ? property.name_pl : property.name_en }
}
