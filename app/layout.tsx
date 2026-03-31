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

const PROD_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(PROD_URL),

  title: {
    default: `${brand.name} — AI Customer Experience Suite`,
    template: `%s | ${brand.name}`,
  },

  description: `${brand.name} is an AI-powered voice and visa services platform for Saudi Arabia. Instantly check application status or monitor live call analytics.`,

  keywords: [
    'Saudi visa services', 'AI voice system', 'KSA visa application',
    'Masaar KSA', 'visa status checker', 'AI customer experience',
  ],

  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },

  alternates: { canonical: '/' },

  openGraph: {
    type: 'website',
    url: '/',
    siteName: brand.name,
    title: `${brand.name} — AI Customer Experience Suite`,
    description: `AI-powered voice and visa services platform for Saudi Arabia.`,
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: brand.name }],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — AI Customer Experience Suite`,
    description: `AI-powered voice and visa services platform for Saudi Arabia.`,
    images: [{ url: '/opengraph-image', alt: brand.name }],
  },
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
