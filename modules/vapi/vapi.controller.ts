import { NextRequest, NextResponse } from 'next/server'
import { verifyVapiSignature } from './vapi.utils'
import { handleEndOfCallReport, handleToolCall, UnknownToolError } from './vapi.service'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifyVapiSignature(req.headers.get('x-vapi-signature'), rawBody)) {
    console.error('Invalid Vapi webhook signature')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = JSON.parse(rawBody) as Record<string, unknown>
  const msg  = (body.message ?? body) as Record<string, unknown>
  const msgType = msg.type as string | undefined

  // ── End-of-call report ────────────────────────────────────────────
  if (msgType === 'end-of-call-report') {
    handleEndOfCallReport(body).catch(err => console.error('End-of-call log failed:', err))
    return NextResponse.json({ ok: true })
  }

  // ── Acknowledge all non-tool-call event types ─────────────────────
  // Vapi sends many events (conversation-update, speech-update, status-update,
  // transfer-destination-request etc.) — return 200 for all so Vapi doesn't
  // mark the server unhealthy and drop the call.
  if (msgType && msgType !== 'tool-calls') {
    console.log(`Vapi event (ignored): ${msgType}`)
    return NextResponse.json({ ok: true })
  }

  // ── Tool calls ────────────────────────────────────────────────────
  try {
    const result = await handleToolCall(body)
    if (result === null) return NextResponse.json({ ok: true }) // no toolName
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof UnknownToolError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }
}
