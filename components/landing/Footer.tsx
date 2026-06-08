import Image from 'next/image'

const linkColumns = [
  {
    heading: 'Nawigacja',
    links: [
      { href: '#domki', label: 'Domki' },
      { href: '#galeria', label: 'Galeria' },
      { href: '#kontakt', label: 'Rezerwacja' },
    ],
  },
  {
    heading: 'Informacje',
    links: [
      { href: '/polityka-prywatnosci', label: 'Polityka prywatności' },
      { href: '#kontakt', label: 'Kontakt' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-forest overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12 sm:gap-6">
          <Image
            src="/logos/logo-poziome.png"
            alt="Malo Stay"
            width={190}
            height={76}
            className="opacity-90"
            style={{ height: 'auto' }}
          />

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            {linkColumns.map((column) => (
              <div key={column.heading}>
                <p className="text-sage/70 text-[10px] tracking-[0.25em] uppercase mb-4">
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-bone/70 text-sm tracking-wide hover:text-bone transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-bone/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-bone/35 text-[11px] tracking-wide text-center sm:text-left">
            © 2025 Malo Stay · Domki w Małopolsce
          </p>
          <p className="text-bone/35 text-[11px] tracking-wide text-center sm:text-right">
            Nad Doliną Dunajca, Małopolska
          </p>
        </div>
      </div>

      <p
        aria-hidden
        className="font-display text-bone/[0.05] leading-[0.8] tracking-tight text-center select-none -mb-[0.12em] -mt-2"
        style={{ fontSize: 'clamp(4.5rem, 17vw, 13rem)' }}
      >
        MALO STAY
      </p>
    </footer>
  )
}
