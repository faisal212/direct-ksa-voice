import { createHmac } from 'crypto'

// ── Signature verification ─────────────────────────────────────────
export function verifyVapiSignature(signature: string | null, rawBody: string): boolean {
  const secret = process.env.VAPI_WEBHOOK_SECRET
  if (!secret) return true // Skip in dev if not set — SET IT before demo
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  return signature === expected
}

// ── Parse Vapi's actual webhook body format ─────────────────────────
// Vapi sends: { message: { type: "tool-calls", call: {...}, toolCallList: [...] } }
export function parseVapiToolCall(body: Record<string, unknown>): {
  toolName: string
  args: Record<string, unknown>
  callId: string
  toolCallId: string
  callerNumber: string
} {
  const msg = (body.message ?? body) as Record<string, unknown>
  const callObj = (msg.call ?? body.call) as Record<string, unknown> | undefined
  const callerNumber = ((callObj?.customer as Record<string, unknown>)?.number as string) ?? ''

  if (Array.isArray(msg.toolCallList) && msg.toolCallList.length > 0) {
    const toolCall = msg.toolCallList[0] as Record<string, unknown>
    const fn = toolCall.function as Record<string, unknown> | undefined
    return {
      toolName:   (fn?.name as string) ?? '',
      args:       typeof fn?.arguments === 'string'
                    ? JSON.parse(fn.arguments)
                    : (fn?.arguments as Record<string, unknown>) ?? {},
      callId:     (callObj?.id as string) ?? 'unknown',
      toolCallId: (toolCall.id as string) ?? '',
      callerNumber,
    }
  }

  // Fallback: direct format (curl tests / local dev)
  return {
    toolName:     (body.toolName as string) ?? '',
    args:         (body.parameters as Record<string, unknown>) ?? {},
    callId:       (callObj?.id as string) ?? 'unknown',
    toolCallId:   '',
    callerNumber,
  }
}

// ── Phone number normalization ──────────────────────────────────────
// Prefixes the spoken phone number with the country code inferred from
// the caller's own E.164 number (e.g. +923484036426).
//
// Logic: strip leading trunk zero from spoken → find that suffix in the
// E.164 digits → the prefix before it is the country code.
//
// Examples:
//   spoken "03484036426" + callerE164 "+923484036426" → "+923484036426"
//   spoken "0501234567"  + callerE164 "+966501234567" → "+966501234567"
//   spoken "+923484036426"  → returned unchanged
export function normalizePhoneNumber(spoken: string, callerE164?: string): string {
  const cleaned = spoken.replace(/[\s\-\.\(\)]/g, '')
  if (cleaned.startsWith('+')) return cleaned
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2)
  if (!callerE164?.startsWith('+')) return cleaned

  const national = cleaned.replace(/^0+/, '')
  if (!national) return cleaned

  const e164digits = callerE164.slice(1) // strip leading '+'

  // Find country code: national number should appear as a suffix of e164digits
  const idx = e164digits.indexOf(national)
  if (idx >= 1 && idx <= 3) {
    return `+${e164digits.slice(0, idx)}${national}`
  }

  // Fallback: customer gave a different number — infer cc length by matching
  // the spoken national digit count against the caller's national digit count
  for (const ccLen of [1, 2, 3]) {
    if (e164digits.slice(ccLen).length === national.length) {
      return `+${e164digits.slice(0, ccLen)}${national}`
    }
  }

  return cleaned
}

// ── Language detection from conversation context ────────────────────
// Detects language from user message content (Arabic Unicode vs Latin text).
// Also supports legacy metadata tags for backwards compatibility.
export function detectLanguage(body: Record<string, unknown>): 'arabic' | 'english' {
  const msg = (body.message ?? body) as Record<string, unknown>
  const artifact = msg.artifact as Record<string, unknown> | undefined
  const messages: unknown[] =
    (artifact?.messages as unknown[]) ??
    (msg.messages as unknown[]) ??
    ((msg.call as Record<string, unknown>)?.messages as unknown[]) ??
    []


  let arabicCount = 0
  let englishCount = 0

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i] as Record<string, unknown>

    // Skip system messages — they contain the instruction text
    // "Write exactly [LANGUAGE:ARABIC] or [LANGUAGE:ENGLISH]" which
    // would falsely trigger Arabic detection on every call.
    if (m.role === 'system') continue

    // Vapi uses 'content' in some message types and 'message' in others
    const content = ((m.content as string) ?? (m.message as string)) ?? ''
    const lower = content.toLowerCase()

    // Tag detection — only in bot/user messages now (not system prompt)
    if (lower.includes('language:arabic') || lower.includes('language: arabic') || lower.includes('language: عربي')) return 'arabic'
    if (lower.includes('language:english') || lower.includes('language: english')) return 'english'

    // Count by user speech only
    if (m.role === 'user') {
      if (/[\u0600-\u06FF]/.test(content)) arabicCount++
      else if (/[a-zA-Z]{3,}/.test(content)) englishCount++
    }
  }


  // Majority vote on user speech — system messages excluded above
  if (englishCount > arabicCount) return 'english'
  return 'arabic' // Default for Saudi customer base
}
