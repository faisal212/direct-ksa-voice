// app/status/page.tsx
// SERVER COMPONENT — thin wrapper rendering the interactive StatusClient

import type { Metadata } from 'next'
import { StatusClient } from '@/components/status/StatusClient'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Application Status',
  description: `Check your Saudi visa application status with ${brand.name}. Enter your application ID for an instant AI-powered update in English or Arabic.`,
  alternates: { canonical: '/status' },
  openGraph: {
    type: 'website',
    url: '/status',
    title: `Application Status | ${brand.name}`,
    description: `Check your Saudi visa application status with ${brand.name}.`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `Application Status — ${brand.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Application Status | ${brand.name}`,
    description: `Check your Saudi visa application status with ${brand.name}.`,
    images: [{ url: '/opengraph-image', alt: `Application Status — ${brand.name}` }],
  },
}

export default function StatusPage() {
  return <StatusClient />
}
