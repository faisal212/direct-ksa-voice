// scripts/setup-vapi.ts
// npx tsx scripts/setup-vapi.ts
// Creates OR updates (PATCH) all 11 agents + squad in Vapi
// Dual-language architecture: 1 greeter + 5 AR specialists + 5 EN specialists
// Supports UPDATE mode — won't create duplicate agents on re-run

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// ── Validate required env vars upfront ───────────────────────────────
const required = ['VAPI_API_KEY', 'HUMAN_AGENT_NUMBER'] as const
const recommended = ['VAPI_TOOL_URL'] as const
const missing = required.filter(k => !process.env[k])
if (missing.length) {
  console.error('❌ Missing required env vars:', missing.join(', '))
  console.error('Add them to .env.local and retry.')
  process.exit(1)
}
const missingRec = recommended.filter(k => !process.env[k])
if (missingRec.length) {
  console.warn('⚠️  Missing recommended env vars:', missingRec.join(', '))
  console.warn('   Falling back to NEXTAUTH_URL for tool URL.\n')
}

import { post, patch } from './vapi/api'
import { MODEL, STT_AR, STT_EN } from './vapi/config'
import { brand } from '../lib/brand'
import { greeterAgent } from './vapi/agents/greeter'
import { visaAgents } from './vapi/agents/visa'
import { statusAgents } from './vapi/agents/status'
import { documentsAgents } from './vapi/agents/documents'
import { appointmentAgents } from './vapi/agents/appointments'
import { careAgents } from './vapi/agents/care'

const TOOL_URL = `${process.env.VAPI_TOOL_URL ?? process.env.NEXTAUTH_URL!}/api/vapi/tools`
const HUMAN_NUMBER = process.env.HUMAN_AGENT_NUMBER!

const greeter = greeterAgent()
const agents = [
  greeter,
  ...visaAgents(),
  ...statusAgents(TOOL_URL),
  ...documentsAgents(),
  ...appointmentAgents(TOOL_URL),
  ...careAgents(HUMAN_NUMBER),
]

// ── Setup ─────────────────────────────────────────────────────────────
async function setup() {
  console.log(`🚀 Setting up ${brand.name} Vapi Squad (dual-language)...\n`)
  console.log(`Tool URL: ${TOOL_URL}\n`)

  const existingIds: Record<string, string | undefined> = {
    greeter:            process.env.VAPI_ASSISTANT_GREETER_ID,
    'visa-ar':          process.env.VAPI_ASSISTANT_VISA_AR_ID,
    'visa-en':          process.env.VAPI_ASSISTANT_VISA_EN_ID,
    'status-ar':        process.env.VAPI_ASSISTANT_STATUS_AR_ID,
    'status-en':        process.env.VAPI_ASSISTANT_STATUS_EN_ID,
    'documents-ar':     process.env.VAPI_ASSISTANT_DOCUMENTS_AR_ID,
    'documents-en':     process.env.VAPI_ASSISTANT_DOCUMENTS_EN_ID,
    'appointments-ar':  process.env.VAPI_ASSISTANT_APPOINTMENTS_AR_ID,
    'appointments-en':  process.env.VAPI_ASSISTANT_APPOINTMENTS_EN_ID,
    'care-ar':          process.env.VAPI_ASSISTANT_CARE_AR_ID,
    'care-en':          process.env.VAPI_ASSISTANT_CARE_EN_ID,
  }

  const ids: Record<string, string> = {}

  for (const agent of agents) {
    const existingId = existingIds[agent.key]

    const body = {
      name: agent.name,
      ...(agent.firstMessage
        ? { firstMessage: agent.firstMessage }
        : { firstMessageMode: 'assistant-speaks-first-with-model-generated-message' }
      ),
      model: {
        ...MODEL,
        ...(['status-ar', 'status-en', 'appointments-ar', 'appointments-en'].includes(agent.key)
          ? { temperature: 0.3 } : {}),
        messages: [{ role: 'system', content: agent.prompt }],
        tools: agent.tools,   // ← inside model, not top-level
      },
      voice: agent.voice,
      transcriber: agent.key.endsWith('-ar') ? STT_AR : STT_EN,
      // Vapi platform settings — voice experience optimization
      silenceTimeoutSeconds: 20,
      maxDurationSeconds: 480,
      backgroundSound: agent.key.startsWith('care') ? 'off' : 'office',
      backchannelingEnabled: true,
      backgroundSpeechDenoisingPlan: { smartDenoisingPlan: { enabled: true } },
      endCallPhrases: ['مع السلامة', 'goodbye', 'bye'],
    }

    if (existingId) {
      console.log(`🔄 Updating: ${agent.name} (${existingId})`)
      await patch(`/assistant/${existingId}`, body)
      ids[agent.key] = existingId
      console.log(`✅ Updated: ${agent.name}\n`)
    } else {
      console.log(`⏳ Creating: ${agent.name}`)
      const result = await post('/assistant', body)
      ids[agent.key] = result.id
      console.log(`✅ Created: ${agent.name}: ${result.id}\n`)
    }
  }

  // Squad
  const existingSquadId = process.env.VAPI_SQUAD_ID
  const squadBody = {
    name: `${brand.name} AI Squad`,
    members: Object.entries(ids).map(([key, id]) => ({
      assistantId: id,
      // Greeter is entry point — override firstMessage
      ...(key === 'greeter' && {
        assistantOverrides: { firstMessage: greeter.firstMessage },
      }),
    })),
    // Transcriber is set per-agent (AR uses 11labs Scribe, EN uses Deepgram)
  }

  if (existingSquadId) {
    console.log(`🔄 Updating squad (${existingSquadId})...`)
    await patch(`/squad/${existingSquadId}`, squadBody)
    console.log('✅ Squad updated\n')
  } else {
    console.log('⏳ Creating squad...')
    const squad = await post('/squad', squadBody)
    console.log(`✅ Squad created: ${squad.id}\n`)
    console.log(`VAPI_SQUAD_ID=${squad.id}`)
  }

  console.log('\n📋 Add to .env.local (only new IDs):')
  Object.entries(ids).forEach(([k, v]) => {
    if (!existingIds[k]) {
      const envKey = k.replace(/-/g, '_').toUpperCase()
      console.log(`VAPI_ASSISTANT_${envKey}_ID=${v}`)
    }
  })
  console.log('\n🎉 Done! Assign squad to your Vapi phone number in dashboard.')
  console.log('⚠️  Also set Server URL in Vapi → Phone Number settings to:')
  console.log(`    ${TOOL_URL}`)
}

setup().catch(console.error)
