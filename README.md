# vapi-nextjs-squad-starter

A production-ready starter kit for building bilingual (Arabic + English) voice AI customer service systems using Vapi's multi-agent squad architecture, Next.js, and Google Sheets.

Designed for service agencies in the Gulf region — fully white-label, configurable via environment variables.

---

## What you get

- **11-agent Vapi squad** — 1 bilingual greeter + 5 specialist pairs (AR + EN each)
- **Live call dashboard** — real-time stats, today's interactions, appointment counts
- **Application status lookup** — customers check their status by voice or web
- **Appointment booking** — agents collect branch, date, time, phone, and WhatsApp
- **White-label brand system** — swap name, logo color, and ID prefix without touching code
- **Google Sheets backend** — zero infrastructure, immediate visibility for non-technical staff

---

## Architecture

```
Phone call → Vapi → Greeter (detects language, routes by intent)
                        ↓
               Specialist agent (AR or EN)
                        ↓
               POST /api/vapi/tools → Google Sheets
                        ↓
               end-of-call-report → Interactions log
                        ↓
               Dashboard polls /api/dashboard every 30s
```

---

## Agent Squad

| Key | Agent Name | Language | Tools |
|-----|-----------|----------|-------|
| `greeter` | Greeter | Bilingual | `transferCall` → all 10 specialists |
| `visa-ar` | Visa Specialist AR | Gulf Arabic | `transferCall` |
| `visa-en` | Visa Specialist EN | English | `transferCall` |
| `status-ar` | Status Specialist AR | Gulf Arabic | `get_application_status` + `transferCall` |
| `status-en` | Status Specialist EN | English | `get_application_status` + `transferCall` |
| `documents-ar` | Documents Specialist AR | Gulf Arabic | `transferCall` |
| `documents-en` | Documents Specialist EN | English | `transferCall` |
| `appointments-ar` | Appointments Specialist AR | Gulf Arabic | `create_appointment` + `transferCall` |
| `appointments-en` | Appointments Specialist EN | English | `create_appointment` + `transferCall` |
| `care-ar` | Care Specialist AR | Gulf Arabic | `transferCall` → human agent |
| `care-en` | Care Specialist EN | English | `transferCall` → human agent |

The Greeter detects language from the first utterance and routes to the correct specialist. If a customer switches language mid-call, the Care Specialist can re-route to the Greeter.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Voice platform | [Vapi](https://vapi.ai) |
| LLM | OpenAI GPT-5.2 |
| TTS (both languages) | ElevenLabs `eleven_multilingual_v2` |
| STT (Arabic) | ElevenLabs Scribe v2 |
| STT (English) | Deepgram nova-2 (multi-language) |
| Database | Google Sheets |
| Language | TypeScript |

---

## Prerequisites

Before starting, you need accounts and credentials for:

- **Vapi** — [vapi.ai](https://vapi.ai) — voice AI platform, API key + phone number
- **ElevenLabs** — voice ID and Scribe v2 (configured in `scripts/vapi/config.ts`, used via Vapi)
- **Google Cloud** — service account with Google Sheets API enabled
- **Google Sheet** — three tabs: `Applications`, `Appointments`, `Interactions`
- **Node.js 18+**
- **ngrok** — for local webhook tunneling during development

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/vapi-nextjs-squad-starter.git
cd vapi-nextjs-squad-starter
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`. At minimum you need:

```
NEXT_PUBLIC_BRAND_NAME=Your Agency Name
NEXT_PUBLIC_BRAND_ID_PREFIX=XX
VAPI_API_KEY=...
HUMAN_AGENT_NUMBER=+9665XXXXXXXX
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
DASHBOARD_API_KEY=any-random-string
NEXT_PUBLIC_DASHBOARD_API_KEY=same-value-as-above
```

See [Environment Variables](#environment-variables) for the full reference.

### 3. Set up Google Sheets

Create a Google Sheet with three tabs named exactly:

- **Applications** — columns: `application_id, customer_name, customer_name_ar, nationality, visa_type, destination, status, submission_date, notes, fee_sar, passport_number`
- **Appointments** — columns: `booking_id, branch, branch_code, date, time, customer_name, phone, whatsapp_number, visa_type, status`
- **Interactions** — columns: `timestamp, call_id, language, intent, duration_seconds, outcome, agent, notes`

Share the sheet with your service account email (Editor access).

Seed 50 demo applications:

```bash
npx tsx scripts/seed-data.ts
```

### 4. Start ngrok (dev only)

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g. `https://abc123.ngrok.io`) and set it in `.env.local`:

```
VAPI_TOOL_URL=https://abc123.ngrok.io
```

### 5. Deploy agents to Vapi

```bash
npx tsx scripts/setup-vapi.ts
```

This creates all 11 agents and the squad in your Vapi account. On first run it prints the agent IDs — copy them into `.env.local`:

```
VAPI_SQUAD_ID=...
VAPI_ASSISTANT_GREETER_ID=...
VAPI_ASSISTANT_VISA_AR_ID=...
# ... (all 11 IDs printed by the script)
```

### 6. Configure your Vapi phone number

In the [Vapi dashboard](https://dashboard.vapi.ai):

1. Go to **Phone Numbers** and select your number
2. Set **Squad** to the squad you just created
3. Set **Server URL** to `https://your-ngrok-url/api/vapi/tools`
4. Set **Server Secret** — must match `VAPI_WEBHOOK_SECRET` in `.env.local`

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Brand (white-label)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BRAND_NAME` | Full English name | `Direct KSA` |
| `NEXT_PUBLIC_BRAND_NAME_AR` | Arabic display name | `دايركت` |
| `NEXT_PUBLIC_BRAND_NAME_ACCENT` | Highlighted suffix in the logo | `KSA` |
| `NEXT_PUBLIC_BRAND_ID_PREFIX` | Application ID prefix (e.g. `MS-2026-001`) | `DK` |
| `NEXT_PUBLIC_BRAND_ID_PREFIX_AR` | Arabic phonetic of prefix (spoken by voice agents) | `دي كي` |
| `NEXT_PUBLIC_BRAND_COLOR` | Hex accent color | `#C9A84C` |

### Vapi

| Variable | Description |
|----------|-------------|
| `VAPI_API_KEY` | Vapi API key |
| `VAPI_WEBHOOK_SECRET` | HMAC secret — set in both `.env.local` and Vapi dashboard |
| `VAPI_TOOL_URL` | ngrok URL (dev) or Vercel URL (prod) — base URL for `/api/vapi/tools` |
| `VAPI_SQUAD_ID` | Populated by `setup-vapi.ts` on first run |
| `VAPI_ASSISTANT_GREETER_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_VISA_AR_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_VISA_EN_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_STATUS_AR_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_STATUS_EN_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_DOCUMENTS_AR_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_DOCUMENTS_EN_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_APPOINTMENTS_AR_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_APPOINTMENTS_EN_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_CARE_AR_ID` | Populated by `setup-vapi.ts` |
| `VAPI_ASSISTANT_CARE_EN_ID` | Populated by `setup-vapi.ts` |

### Human agent

| Variable | Description | Example |
|----------|-------------|---------|
| `HUMAN_AGENT_NUMBER` | E.164 phone number for Care Specialist transfers | `+9665XXXXXXXX` |

### Google Sheets

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEETS_ID` | The spreadsheet ID from the URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | JSON private key — use literal `\n` (not actual newlines) in `.env.local` |

### Dashboard

| Variable | Description |
|----------|-------------|
| `DASHBOARD_API_KEY` | Any random string — protects `/api/dashboard` |
| `NEXT_PUBLIC_DASHBOARD_API_KEY` | Must match `DASHBOARD_API_KEY` |

### NextAuth (production)

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Full URL of your deployment (e.g. `https://your-domain.com`) |

---

## White-label Customization

All brand values live in `lib/brand.ts` and are read from `NEXT_PUBLIC_BRAND_*` env vars at runtime. No code changes are needed to rebrand.

```ts
// lib/brand.ts
export const brand = {
  get name()       { return process.env.NEXT_PUBLIC_BRAND_NAME        ?? 'Direct KSA' },
  get nameAr()     { return process.env.NEXT_PUBLIC_BRAND_NAME_AR     ?? 'دايركت'     },
  get idPrefix()   { return process.env.NEXT_PUBLIC_BRAND_ID_PREFIX   ?? 'DK'         },
  // ...
}
```

To deploy for a new client: duplicate `.env.local`, update the `NEXT_PUBLIC_BRAND_*` values, re-run `setup-vapi.ts`. The agents, dashboard, status page, and UI all pick up the new brand automatically.

---

## Customization Guide

### Supported countries

Edit `scripts/vapi/config.ts`:

```ts
export const COUNTRIES_SUPPORTED = `UK, USA, Schengen, Canada, Australia, UAE, Turkey, Malaysia`
export const COUNTRIES_BLOCKED   = `Russia, India, China`
```

Re-run `npx tsx scripts/setup-vapi.ts` after any change — agent prompts are not live-updated until the script runs.

### Branches and hours

Edit the branch list and hours in `scripts/vapi/agents/appointments.ts`. The same information appears in both the AR and EN agent prompts — update both sections.

### Adding a specialist

1. Create `scripts/vapi/agents/your-specialist.ts` following the pattern of an existing file
2. Export a function returning `AgentDef[]` (AR + EN pair)
3. Import and call it in `scripts/setup-vapi.ts`
4. Add transfer destinations in the Greeter and Care agents
5. Run `setup-vapi.ts`

### Changing the voice

Edit `scripts/vapi/config.ts`:

```ts
export const VOICE_AR = { provider: '11labs', voiceId: 'your-voice-id', model: 'eleven_multilingual_v2' }
export const VOICE_EN = { provider: '11labs', voiceId: 'your-voice-id', model: 'eleven_multilingual_v2' }
```

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── dashboard/          # GET — live dashboard stats
│   │   ├── status/             # GET — public application status lookup
│   │   └── vapi/tools/         # POST — Vapi webhook (tool calls + end-of-call reports)
│   ├── dashboard/              # Live call dashboard page
│   ├── status/                 # Customer-facing status check page
│   └── layout.tsx
├── components/
│   ├── dashboard/              # DashboardClient.tsx
│   ├── status/                 # StatusClient.tsx
│   └── ui/                     # BrandMark.tsx and shared UI
├── lib/
│   ├── brand.ts                # White-label config (single source of truth)
│   └── sheets.ts               # Google Sheets read/write helpers
├── modules/
│   └── status/                 # Status lookup controller
├── scripts/
│   ├── vapi/
│   │   ├── agents/             # One file per agent pair (AR + EN)
│   │   │   ├── greeter.ts
│   │   │   ├── visa.ts
│   │   │   ├── status.ts
│   │   │   ├── documents.ts
│   │   │   ├── appointments.ts
│   │   │   └── care.ts
│   │   ├── api.ts              # Vapi REST client (post / patch)
│   │   ├── config.ts           # Voices, STT, LLM, country lists
│   │   └── types.ts            # AgentDef type
│   ├── setup-vapi.ts           # Deploy/update all agents + squad
│   └── seed-data.ts            # Seed Google Sheets with demo data
├── .env.example
└── README.md
```

---

## Scripts

```bash
npm run dev                        # Start Next.js dev server (localhost:3000)
npm run build                      # Production build
npm run lint                       # ESLint check
npx tsx scripts/setup-vapi.ts      # Deploy/update all Vapi agents (run after any prompt change)
npx tsx scripts/seed-data.ts       # Reset Google Sheets with 50 demo applications
```

> Run `setup-vapi.ts` every time you change agent prompts, tools, or config. Vapi agents are not live-updated until the script executes.

---

## Demo Data

After running `seed-data.ts`, use these IDs to test the status lookup flow:

| Application ID | Status |
|---------------|--------|
| `XX-2026-001` | Under Review |
| `XX-2026-007` | Approved |
| `XX-2026-012` | Additional Docs Required |

Replace `XX` with your `NEXT_PUBLIC_BRAND_ID_PREFIX`.

---

## Deploying to Production

1. Deploy to [Vercel](https://vercel.com) (zero config for Next.js)
2. Set all environment variables in the Vercel dashboard
3. Set `VAPI_TOOL_URL` to your production Vercel URL
4. Update the **Server URL** in Vapi dashboard to `https://your-domain.vercel.app/api/vapi/tools`
5. Re-run `setup-vapi.ts` locally (with `VAPI_TOOL_URL` pointing to production) to update the tool endpoint in all agents

---

## License

MIT
