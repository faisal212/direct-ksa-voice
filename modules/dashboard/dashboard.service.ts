import { getDashboardData } from '@/lib/sheets'

export type DashboardData = NonNullable<Awaited<ReturnType<typeof getDashboardData>>>

export async function fetchDashboard(): Promise<DashboardData | null> {
  return getDashboardData()
}
