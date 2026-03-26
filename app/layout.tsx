// app/layout.tsx
// SERVER COMPONENT — no 'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Noto_Kufi_Arabic } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Direct KSA — AI Customer Experience Suite',
  description: 'Premium AI-powered voice system for Saudi travel and visa services',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${kufiArabic.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
