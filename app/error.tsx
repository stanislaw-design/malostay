'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-fog flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-sage text-[11px] tracking-[0.3em] uppercase mb-6">Coś poszło nie tak</p>
        <h1
          className="font-display text-charcoal leading-[0.9] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          Chwilowa <em>usterka.</em>
        </h1>
        <p className="text-charcoal/55 text-[15px] leading-relaxed mb-10">
          Coś po naszej stronie nie zadziałało jak trzeba. Spróbuj ponownie — jeśli problem się
          powtórzy, daj nam znać.
          <br />
          <span className="text-charcoal/40">
            Something went wrong on our end — please try again.
          </span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="relative inline-flex bg-forest text-bone text-sm tracking-wide px-8 py-3 rounded-full overflow-hidden group transition-all duration-100 active:scale-[0.97] cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-bone [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(150%_at_50%_50%)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
            <span className="relative z-10 group-hover:text-forest transition-colors duration-150 delay-150">
              Spróbuj ponownie
            </span>
          </button>
          <a
            href="/"
            className="text-charcoal/55 text-sm underline underline-offset-4 hover:text-charcoal/80 transition-colors"
          >
            Strona główna
          </a>
        </div>
      </div>
    </div>
  )
}
