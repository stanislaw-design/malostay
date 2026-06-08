import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-fog flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-sage text-[11px] tracking-[0.3em] uppercase mb-6">Błąd 404</p>
        <h1
          className="font-display text-charcoal leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          Tej strony <em>tu nie ma.</em>
        </h1>
        <p className="text-charcoal/55 text-[15px] leading-relaxed mb-10">
          Może link był nieaktualny, a może domek się przeprowadził. Wróć na stronę główną i
          spróbuj ponownie.
          <br />
          <span className="text-charcoal/40">
            This page doesn&apos;t exist — head back to the homepage.
          </span>
        </p>
        <Link
          href="/"
          className="relative inline-flex bg-forest text-bone text-sm tracking-wide px-8 py-3 rounded-full overflow-hidden group transition-all duration-100 active:scale-[0.97]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          />
          <span className="relative z-10 group-hover:text-forest transition-colors duration-150 delay-150">
            Wróć na stronę główną
          </span>
        </Link>
      </div>
    </div>
  )
}
