import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { TrustStrip } from '@/components/landing/TrustStrip'
import { CottageFeatured } from '@/components/landing/CottageFeatured'
import { Gallery } from '@/components/landing/Gallery'
import { MemorySection } from '@/components/landing/MemorySection'
import { Location } from '@/components/landing/Location'
import { Reviews } from '@/components/landing/Reviews'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <CottageFeatured />
        <MemorySection />
        <Reviews />
        <Gallery />

        <Location />

        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
