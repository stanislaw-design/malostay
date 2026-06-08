import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getBookedRanges } from '@/lib/availability'
import { t, type Locale } from '@/lib/i18n/t'
import { getCottageContent, pickText } from '@/lib/cottages-data'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { CottageHero } from '@/components/cottage/CottageHero'
import { CottageAmenities } from '@/components/cottage/CottageAmenities'
import { CottageGallery } from '@/components/cottage/CottageGallery'
import { CottageLocation } from '@/components/cottage/CottageLocation'
import { CottageReviews } from '@/components/cottage/CottageReviews'
import { CottageFinalCTA } from '@/components/cottage/CottageFinalCTA'

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

  const content = getCottageContent(slug)
  if (!content) notFound()

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

  const name = pickText(safeLocale, content.tagline)
  const description = pickText(safeLocale, content.description)

  const samplePrice =
    pricingRules && pricingRules.length > 0
      ? Math.min(...pricingRules.map((r) => Number(r.price_per_night)))
      : null

  return (
    <>
      <Nav />
      <main className="bg-fog">
        <CottageHero cottage={content} name={name} locale={safeLocale} />

        {/* Booking — immediately after hero, the primary action on this page */}
        <section id="rezerwacja" className="bg-bone py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
              <div className="reveal">
                <p className="text-[10px] tracking-[0.3em] uppercase text-sage mb-6">
                  {safeLocale === 'en' ? 'Check availability' : 'Sprawdź dostępność'}
                </p>
                <h2
                  className="font-display text-charcoal leading-[0.92] mb-8"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
                >
                  {name}
                </h2>

                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-charcoal/55 mb-8">
                  <span>
                    {t(safeLocale, 'property.maxGuests')}: <strong className="text-charcoal font-medium">{property.max_guests}</strong>
                  </span>
                  <span>
                    {t(safeLocale, 'property.checkIn')}: <strong className="text-charcoal font-medium">{property.check_in_time}</strong>
                  </span>
                  <span>
                    {t(safeLocale, 'property.checkOut')}: <strong className="text-charcoal font-medium">{property.check_out_time}</strong>
                  </span>
                  <span>
                    {t(safeLocale, 'property.minNights')}: <strong className="text-charcoal font-medium">{property.min_nights}</strong>
                  </span>
                </div>

                {samplePrice != null && (
                  <p className="font-display text-charcoal mb-6" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>
                    {t(safeLocale, 'property.priceFrom', { price: samplePrice })}
                  </p>
                )}

                {description && (
                  <p className="text-charcoal/65 leading-relaxed whitespace-pre-line max-w-xl" style={{ maxWidth: '60ch' }}>
                    {description}
                  </p>
                )}
              </div>

              <div className="reveal-d1">
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
        </section>

        <CottageAmenities amenities={content.amenities} locale={safeLocale} />
        <CottageGallery photos={content.gallery} locale={safeLocale} />
        <CottageLocation location={content.location} locale={safeLocale} />
        <CottageReviews
          reviews={content.reviews}
          score={content.bookingScore}
          reviewCount={content.bookingReviewCount}
          locale={safeLocale}
        />
        <CottageFinalCTA
          name={name}
          bookedRanges={bookedRanges}
          minNights={property.min_nights}
          locale={safeLocale}
        />
      </main>
      <Footer />
    </>
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
