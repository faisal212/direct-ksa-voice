// app/layout.tsx
// SERVER COMPONENT — no 'use client'

import type { Metadata } from 'next'
import { Inter, Noto_Kufi_Arabic, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { brand } from '@/lib/brand'
import { MouseGlow } from '@/components/ui/MouseGlow'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const kufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${brand.name} — AI Customer Experience Suite`,
  description: `AI-powered voice system for ${brand.name} services`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${kufiArabic.variable} ${dmSerif.variable}`}
      style={{ '--brand-color': brand.color } as React.CSSProperties}
    >
      <body className="font-sans antialiased">
        <MouseGlow />
        {children}
      </body>
    </html>
  )
}
