'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin', label: 'Pulpit', exact: true },
  { href: '/admin/rezerwacje', label: 'Rezerwacje' },
  { href: '/admin/domki', label: 'Domki' },
  { href: '/admin/kalendarz', label: 'Kalendarz' },
  { href: '/admin/integracje', label: 'Integracje' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  const navLinks = (
    <nav className="flex-1 space-y-1">
      {NAV.map(({ href, label, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive(href, exact)
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-neutral-200 min-h-screen px-3 py-5">
        <div className="px-3 mb-6">
          <span className="text-sm font-semibold text-neutral-900">Admin</span>
        </div>
        {navLinks}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-4 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 text-left disabled:opacity-50"
        >
          {loggingOut ? 'Wylogowywanie…' : 'Wyloguj się'}
        </button>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
        <span className="text-sm font-semibold text-neutral-900">Admin</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-neutral-600 hover:text-neutral-900"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col px-4 py-5">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-neutral-900">Admin</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-neutral-600" aria-label="Zamknij">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {navLinks}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 text-left disabled:opacity-50"
          >
            {loggingOut ? 'Wylogowywanie…' : 'Wyloguj się'}
          </button>
        </div>
      )}
    </>
  )
}
