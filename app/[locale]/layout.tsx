import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/i18n/t'

const LOCALES: Locale[] = ['pl', 'en']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  return <>{children}</>
}
