// scripts/vapi/config.ts
// Shared configuration constants for all Vapi agents

// ── Voice configs ─────────────────────────────────────────────────────
export const VOICE_AR = { provider: '11labs', voiceId: 'QsV9PCczMIklRM6xLPAS', model: 'eleven_multilingual_v2' }
export const VOICE_EN = { provider: '11labs', voiceId: 'QsV9PCczMIklRM6xLPAS', model: 'eleven_multilingual_v2' }

// ── Speech-to-text configs ────────────────────────────────────────────
export const STT_EN = { provider: 'deepgram', model: 'nova-2', language: 'multi' }
export const STT_AR = { provider: '11labs', model: 'scribe_v2', language: 'ar' }

// ── LLM model config ──────────────────────────────────────────────────
export const MODEL = { provider: 'openai', model: 'gpt-5.2-chat-latest', temperature: 0.6 }

// ── Country lists (single source of truth) ────────────────────────────
export const COUNTRIES_SUPPORTED = `UK, USA, Schengen, Canada, Australia, UAE, Turkey, Malaysia, Thailand, Japan`
export const COUNTRIES_SCHENGEN  = `France, Germany, Italy, Spain, Netherlands, Belgium, Austria`
export const COUNTRIES_BLOCKED   = `Russia, India, China, Pakistan, Brazil`

export const COUNTRY_BLOCK = `SUPPORTED COUNTRIES (exact list only):
${COUNTRIES_SUPPORTED}
Schengen aliases: ${COUNTRIES_SCHENGEN} → treat as Schengen ✅
Blocked — transfer immediately, no exceptions: ${COUNTRIES_BLOCKED}`

export const COUNTRY_BLOCK_CARE = `SUPPORTED COUNTRIES (we DO cover these):
${COUNTRIES_SUPPORTED}
Schengen aliases: ${COUNTRIES_SCHENGEN} → Schengen ✅
UNSUPPORTED — do NOT cover: ${COUNTRIES_BLOCKED}`
