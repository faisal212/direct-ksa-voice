import { NextRequest, NextResponse } from 'next/server'
import { fetchDashboard } from './dashboard.service'

export async function GET(req: NextRequest) {
  const key      = req.headers.get('x-dashboard-key')
  const expected = process.env.DASHBOARD_API_KEY
  if (expected && key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await fetchDashboard()
  if (!data) {
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }

  return NextResponse.json(data)
}
