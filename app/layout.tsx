import type { Metadata } from 'next'
import { DM_Serif_Display, Instrument_Serif, Poppins } from 'next/font/google'
import './globals.css'

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Malo Stay · Domki w Małopolsce',
  description:
    'Malo Stay — wyjątkowe domki w Małopolsce nad Doliną Dunajca. Sauna, jacuzzi, BBQ, widok na dolinę. Do 8 osób. Rezerwacja online.',
  keywords: 'Malo Stay, domek letniskowy, Dolina Dunajca, Małopolska, wynajem, nocleg, sauna, jacuzzi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className={`${dmSerifDisplay.variable} ${instrumentSerif.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
