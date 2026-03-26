# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npx tsx scripts/setup-vapi.ts   # Deploy all 6 Vapi agents + squad (run after ANY prompt change)
npx tsx scripts/seed-data.ts    # Reset Google Sheets with 50 demo applications + empty headers
```

All scripts read from `.env.local`. Run `setup-vapi.ts` every time `scripts/setup-vapi.ts` is edited — Vapi agents are not updated until the script is executed.

## Architecture

**This is a voice AI customer service system** for a Saudi visa agency. Customers call a Vapi phone number; AI agents handle their queries in Arabic and English. A web dashboard shows live call stats. Google Sheets is the only database.

### Data flow

```
Phone call → Vapi → Greeter agent (routes by intent)
              ↓
         Specialist agent → POST /api/vapi/tools → lib/sheets.ts → Google Sheets
              ↓
         end-of-call-report → logInteraction() → Interactions sheet
              ↓
         Dashboard polls /api/dashboard every 30s → getDashboardData()
```

### Vapi agent squad

Six agents defined in `scripts/setup-vapi.ts`, deployed as a Vapi Squad:

| Key | Name | Tools |
|-----|------|-------|
| `greeter` | Direct KSA Greeter | `transferCall` (routes to all 5 specialists) |
| `visa` | Visa Specialist | `transferCall` |
| `status` | Status Specialist | `get_application_status` + `transferCall` |
| `documents` | Documents Specialist | `transferCall` |
| `appointments` | Appointments Specialist | `create_appointment` + `transferCall` |
| `care` | Care Specialist | `transferCall` to human phone number |

**Model split:** Appointments agent uses `gpt-5.2`; all others use `gpt-5.2-chat-latest`.
**STT:** Deepgram nova-2, `language: 'multi'`.
**Voice:** OpenAI shimmer, speed 0.95.

### Vapi webhook (`app/api/vapi/tools/route.ts`)

Handles three event types from Vapi:
- `tool-calls` → execute tool against Google Sheets, return `{ results: [{ toolCallId, result }] }`
- `end-of-call-report` → log real call duration; only source of actual duration values
- everything else → acknowledge with `{ ok: true }` (critical — Vapi marks server unhealthy if non-200)

Language detection scans conversation message history for Arabic Unicode (`\u0600-\u06FF`); defaults to `'arabic'` for Saudi customer base.

### Google Sheets schema (`lib/sheets.ts`)

Three tabs in `GOOGLE_SHEETS_ID`:

- **Applications** `A:K` — read-only seed data; O(n) scan by `application_id` (format: `DK-YYYY-NNN`)
- **Appointments** `A:J` — append-only; conflict check before insert (same branch + date + time + Confirmed = blocked)
- **Interactions** `A:H` — append-only log; dashboard filters to today by ISO timestamp prefix

### API routes

- `POST /api/vapi/tools` — Vapi webhook; HMAC-SHA256 verified via `VAPI_WEBHOOK_SECRET`
- `GET /api/status?id=DK-2026-001` — public status lookup
- `GET /api/dashboard` — requires `x-dashboard-key` header matching `DASHBOARD_API_KEY`

## Key environment variables

```
# Google Sheets
GOOGLE_SHEETS_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY              # JSON private key; \n must be literal \\n in .env.local

# Vapi
VAPI_API_KEY
VAPI_WEBHOOK_SECRET             # Set in both .env.local AND Vapi dashboard → Phone Number → Server URL
VAPI_TOOL_URL                   # ngrok URL for dev; Vercel URL for prod
HUMAN_AGENT_NUMBER              # E.164 format; used by Care Specialist for human transfer

# Vapi agent IDs (populated by setup-vapi.ts on first run)
VAPI_SQUAD_ID
VAPI_ASSISTANT_GREETER_ID
VAPI_ASSISTANT_VISA_ID
VAPI_ASSISTANT_STATUS_ID
VAPI_ASSISTANT_DOCUMENTS_ID
VAPI_ASSISTANT_APPOINTMENTS_ID
VAPI_ASSISTANT_CARE_ID

# Dashboard
DASHBOARD_API_KEY
NEXT_PUBLIC_DASHBOARD_API_KEY   # Must match DASHBOARD_API_KEY
```

## Demo data

After running `seed-data.ts`, these application IDs are useful for testing:
- `DK-2026-001` → Under Review
- `DK-2026-007` → Approved
- `DK-2026-012` → Additional Docs Required
