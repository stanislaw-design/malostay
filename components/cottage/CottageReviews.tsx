import { pickText, type CottageReview } from '@/lib/cottages-data'
import type { Locale } from '@/lib/i18n/t'

interface Props {
  reviews: CottageReview[]
  score: string
  reviewCount: number
  locale: Locale
}

export function CottageReviews({ reviews, score, reviewCount, locale }: Props) {
  if (reviews.length === 0) return null
  const [featured, ...rest] = reviews

  return (
    <section className="bg-fog py-32 md:py-44">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-sage mb-6 text-center reveal">
          {locale === 'en' ? 'Guest reviews' : 'Opinie gości'}
        </p>
        <p className="text-charcoal/45 text-sm text-center mb-16 reveal">
          <strong className="text-charcoal font-medium">{score}</strong>
          {' '}· {reviewCount} {locale === 'en' ? 'reviews on Booking.com' : 'opinii na Booking.com'}
        </p>

        <blockquote className="text-center mb-20 reveal-d1">
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-pine text-sm">★</span>
            ))}
          </div>
          <p
            className="font-display italic text-charcoal leading-[1.08] mb-10 mx-auto"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.7rem)', maxWidth: '720px' }}
          >
            &ldquo;{pickText(locale, featured.text)}&rdquo;
          </p>
          <footer>
            <div className="w-8 h-px bg-mist mx-auto mb-6" />
            <p className="text-sm text-charcoal/45">
              {featured.author}&ensp;&middot;&ensp;{featured.location}&ensp;&middot;&ensp;Booking.com ✓
            </p>
          </footer>
        </blockquote>

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-mist/50 pt-16">
            {rest.map((r, i) => (
              <div key={i} className={i === 0 ? 'reveal' : 'reveal-d1'}>
                <p className="text-charcoal/70 text-[15px] leading-relaxed mb-5">
                  &ldquo;{pickText(locale, r.text)}&rdquo;
                </p>
                <p className="text-sm text-charcoal/40">
                  {r.author}&ensp;&middot;&ensp;{r.location}&ensp;&middot;&ensp;{pickText(locale, r.month)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
