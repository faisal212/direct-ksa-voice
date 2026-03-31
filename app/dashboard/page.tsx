// app/dashboard/page.tsx
// SERVER COMPONENT — fetches initial data server-side for instant first render

import type { Metadata } from 'next'
import { getDashboardData } from '@/lib/sheets'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Operations Dashboard',
  description: `Live AI call analytics and squad performance metrics for ${brand.name}. Monitor active calls, response times, and operational KPIs in real time.`,
  alternates: { canonical: '/dashboard' },
  openGraph: {
    type: 'website',
    url: '/dashboard',
    title: `Operations Dashboard | ${brand.name}`,
    description: `Live AI call analytics and squad performance metrics for ${brand.name}.`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `Operations Dashboard — ${brand.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Operations Dashboard | ${brand.name}`,
    description: `Live AI call analytics for ${brand.name}.`,
    images: [{ url: '/opengraph-image', alt: `Operations Dashboard — ${brand.name}` }],
  },
}

export default async function DashboardPage() {
  const initialData = await getDashboardData()

  return (
    <DashboardClient
      initialStats={initialData?.stats ?? null}
      initialInteractions={initialData?.interactions ?? []}
    />
  )
}
