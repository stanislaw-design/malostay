'use client'

const SECTIONS = [
  { id: 'podstawowe', label: 'Podstawowe' },
  { id: 'konfiguracja', label: 'Konfiguracja' },
  { id: 'cennik', label: 'Cennik' },
  { id: 'ical', label: 'iCal' },
]

export function PropertySectionNav() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-0 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-2 bg-neutral-50/90 backdrop-blur border-b border-neutral-200">
      <ul className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => scrollTo(s.id)}
              className="px-3 py-1.5 text-sm font-medium text-neutral-600 rounded-full hover:bg-white hover:text-neutral-900 border border-transparent hover:border-neutral-200 transition-colors"
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
