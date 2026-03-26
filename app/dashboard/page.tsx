// app/dashboard/page.tsx
// SERVER COMPONENT — fetches initial data server-side for instant first render

import { getDashboardData } from '@/lib/sheets'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const initialData = await getDashboardData()

  return (
    <DashboardClient
      initialStats={initialData?.stats ?? null}
      initialInteractions={initialData?.interactions ?? []}
    />
  )
}
