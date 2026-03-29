import { getApplicationStatus, createAppointment, logInteraction } from '@/lib/sheets'
import { detectLanguage, parseVapiToolCall, normalizePhoneNumber } from './vapi.utils'

// ── Vapi response shape ────────────────────────────────────────────
export function buildVapiResult(toolCallId: string, result: unknown) {
  if (toolCallId) {
    return { results: [{ toolCallId, result: JSON.stringify(result) }] }
  }
  // Fallback for direct / curl calls
  return { result }
}

// ── End-of-call report handler ────────────────────────────────────
export async function handleEndOfCallReport(body: Record<string, unknown>): Promise<void> {
  const msg = (body.message ?? body) as Record<string, unknown>

  const startMs  = new Date(msg.startedAt as string).getTime()
  const endMs    = new Date(msg.endedAt as string).getTime()
  const duration = Math.round((endMs - startMs) / 1000)

  const assistantName = (msg.assistant as Record<string, unknown>)?.name as string
    ?? (msg.call as Record<string, unknown>)?.assistantId as string
    ?? 'call-summary'

  const an = assistantName.toLowerCase()
  const agentKey = an.includes('visa')        ? 'visa-specialist'
    : an.includes('status')      ? 'status-specialist'
    : an.includes('document')    ? 'documents-specialist'
    : an.includes('appointment') ? 'appointments-specialist'
    : an.includes('care')        ? 'care-specialist'
    : an.includes('greeter')     ? 'greeter'
    : 'call-summary'

  await logInteraction({
    sessionId:   (msg.call as Record<string, unknown>)?.id as string ?? 'unknown',
    channel:     'voice',
    language:    detectLanguage(body),
    agentUsed:   agentKey,
    userMessage: ((msg.summary as string) ?? '').substring(0, 100),
    escalated:   agentKey === 'care-specialist',
    duration,
  })
}

// ── Tool call handler ─────────────────────────────────────────────
export async function handleToolCall(body: Record<string, unknown>): Promise<unknown> {
  const { toolName, args, toolCallId, callerNumber } = parseVapiToolCall(body)

  console.log(`Tool called: ${toolName}`, args)

  switch (toolName) {

    case 'get_application_status': {
      const data = await getApplicationStatus(args.application_id as string)

      const isNotFound  = data === null
      const isSystemErr = data?.status === 'Error'

      if (isNotFound)  return buildVapiResult(toolCallId, { found: false, applicationId: args.application_id })
      if (isSystemErr) return buildVapiResult(toolCallId, { systemError: true })
      return buildVapiResult(toolCallId, data)
    }

    case 'create_appointment': {
      const normalized = {
        ...args,
        phone:           normalizePhoneNumber(args.phone as string, callerNumber),
        whatsapp_number: normalizePhoneNumber((args.whatsapp_number ?? args.phone) as string, callerNumber),
      }
      const result = await createAppointment(normalized as Parameters<typeof createAppointment>[0])
      return buildVapiResult(toolCallId, result)
    }

    default:
      if (!toolName) return null // Not a tool call — caller should return { ok: true }
      console.warn(`Unknown tool called: ${toolName}`)
      throw new UnknownToolError(toolName)
  }
}

export class UnknownToolError extends Error {
  constructor(public readonly toolName: string) {
    super(`Unknown tool: ${toolName}`)
  }
}
