import { getApplicationStatus } from '@/lib/sheets'

export type ApplicationResult =
  | Awaited<ReturnType<typeof getApplicationStatus>>

export async function lookupStatus(applicationId: string): Promise<ApplicationResult> {
  return getApplicationStatus(applicationId.trim().toUpperCase())
}
