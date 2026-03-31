import { NextRequest, NextResponse } from 'next/server'
import { lookupStatus } from './status.service'
import { brandDerived } from '@/lib/brand'

export async function GET(req: NextRequest) {
  const applicationId = req.nextUrl.searchParams.get('id')

  if (!applicationId) {
    return NextResponse.json(
      { error: `Missing application ID. Use ?id=${brandDerived.idExample}` },
      { status: 400 }
    )
  }

  const data = await lookupStatus(applicationId)

  if (!data) {
    return NextResponse.json(
      { error: `No application found: ${applicationId}` },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}
