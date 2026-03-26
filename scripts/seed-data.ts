// scripts/seed-data.ts
// npx tsx scripts/seed-data.ts
// Generates 50 realistic demo applications and writes to Google Sheets
// Idempotent: clears existing data and re-seeds on every run

import * as dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config({ path: '.env.local' })

if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
  console.error('❌ Missing GOOGLE_SHEETS_ID or GOOGLE_SERVICE_ACCOUNT_EMAIL in .env.local')
  process.exit(1)
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key:  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets   = google.sheets({ version: 'v4', auth })
const SHEET_ID = process.env.GOOGLE_SHEETS_ID!

// ── Data pools ─────────────────────────────────────────────────────

const NAMES = [
  { en: 'Ahmed Al-Rashidi',       ar: 'أحمد الراشدي' },
  { en: 'Sara Al-Otaibi',         ar: 'سارة العتيبي' },
  { en: 'Mohammed Al-Qahtani',    ar: 'محمد القحطاني' },
  { en: 'Fatima Al-Zahrani',      ar: 'فاطمة الزهراني' },
  { en: 'Khalid Al-Harbi',        ar: 'خالد الحربي' },
  { en: 'Noura Al-Ghamdi',        ar: 'نورة الغامدي' },
  { en: 'Omar Al-Shehri',         ar: 'عمر الشهري' },
  { en: 'Lama Al-Rashidi',        ar: 'لمى الراشدي' },
  { en: 'Turki Al-Otaibi',        ar: 'تركي العتيبي' },
  { en: 'Reem Al-Qahtani',        ar: 'ريم القحطاني' },
  { en: 'Sultan Al-Zahrani',      ar: 'سلطان الزهراني' },
  { en: 'Huda Al-Harbi',          ar: 'هدى الحربي' },
  { en: 'Faisal Al-Ghamdi',       ar: 'فيصل الغامدي' },
  { en: 'Maha Al-Shehri',         ar: 'مها الشهري' },
  { en: 'Abdulrahman Al-Rashidi', ar: 'عبدالرحمن الراشدي' },
  { en: 'Dalal Al-Otaibi',        ar: 'دلال العتيبي' },
  { en: 'Nasser Al-Qahtani',      ar: 'ناصر القحطاني' },
  { en: 'Aisha Al-Zahrani',       ar: 'عائشة الزهراني' },
  { en: 'Bandar Al-Harbi',        ar: 'بندر الحربي' },
  { en: 'Ghada Al-Ghamdi',        ar: 'غادة الغامدي' },
  { en: 'Youssef Al-Shehri',      ar: 'يوسف الشهري' },
  { en: 'Salma Al-Rashidi',       ar: 'سلمى الراشدي' },
  { en: 'Majed Al-Otaibi',        ar: 'ماجد العتيبي' },
  { en: 'Norah Al-Qahtani',       ar: 'نوره القحطاني' },
  { en: 'Hassan Al-Zahrani',      ar: 'حسن الزهراني' },
  { en: 'Mona Al-Harbi',          ar: 'منى الحربي' },
  { en: 'Ibrahim Al-Ghamdi',      ar: 'إبراهيم الغامدي' },
  { en: 'Layla Al-Shehri',        ar: 'ليلى الشهري' },
  { en: 'Saad Al-Rashidi',        ar: 'سعد الراشدي' },
  { en: 'Haifa Al-Otaibi',        ar: 'هيفاء العتيبي' },
  { en: 'Ali Al-Qahtani',         ar: 'علي القحطاني' },
  { en: 'Rania Al-Zahrani',       ar: 'رانيا الزهراني' },
  { en: 'Fahad Al-Harbi',         ar: 'فهد الحربي' },
  { en: 'Amira Al-Ghamdi',        ar: 'أميرة الغامدي' },
  { en: 'Nawaf Al-Shehri',        ar: 'نواف الشهري' },
  { en: 'Dina Al-Rashidi',        ar: 'دينا الراشدي' },
  { en: 'Mansour Al-Otaibi',      ar: 'منصور العتيبي' },
  { en: 'Wafa Al-Qahtani',        ar: 'وفاء القحطاني' },
  { en: 'Saud Al-Zahrani',        ar: 'سعود الزهراني' },
  { en: 'Basma Al-Harbi',         ar: 'بسمة الحربي' },
  { en: 'Tariq Al-Ghamdi',        ar: 'طارق الغامدي' },
  { en: 'Hayat Al-Shehri',        ar: 'حياة الشهري' },
  { en: 'Waleed Al-Rashidi',      ar: 'وليد الراشدي' },
  { en: 'Samira Al-Otaibi',       ar: 'سميرة العتيبي' },
  { en: 'Adel Al-Qahtani',        ar: 'عادل القحطاني' },
  { en: 'Jawahir Al-Zahrani',     ar: 'جواهر الزهراني' },
  { en: 'Mishal Al-Harbi',        ar: 'مشعل الحربي' },
  { en: 'Najla Al-Ghamdi',        ar: 'نجلاء الغامدي' },
  { en: 'Hamad Al-Shehri',        ar: 'حمد الشهري' },
  { en: 'Abeer Al-Rashidi',       ar: 'عبير الراشدي' },
]

// Destination mix: 20 UK, 10 USA, 8 Schengen, 7 Canada, 5 Australia
const DESTINATIONS = [
  ...Array(20).fill('UK'),
  ...Array(10).fill('USA'),
  ...Array(8).fill('Schengen'),
  ...Array(7).fill('Canada'),
  ...Array(5).fill('Australia'),
]

// Status mix: 15 Under Review, 12 Approved, 10 Submitted, 8 Additional Docs, 5 Rejected
const STATUSES = [
  ...Array(15).fill('Under Review'),
  ...Array(12).fill('Approved'),
  ...Array(10).fill('Submitted'),
  ...Array(8).fill('Additional Docs'),
  ...Array(5).fill('Rejected'),
]

const VISA_TYPES = ['Tourist', 'Student', 'Business', 'Family Visit']
const BRANCHES   = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah']

const NOTES_ADDITIONAL = [
  'Missing bank statement', 'Passport photo not recent',
  'Employment letter needed', 'Hotel reservation missing',
  'Travel insurance not provided', 'Invitation letter required',
  'Income proof insufficient', 'Missing flight itinerary',
]
const NOTES_REJECTED = [
  'Insufficient funds', 'Previous visa violation',
  'Incomplete documentation', 'Failed interview', 'Overstay history',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomDate(startDays: number, endDays: number): string {
  const offset = (startDays + Math.random() * (endDays - startDays)) * 86400000
  return new Date(Date.now() - offset).toISOString().split('T')[0]
}

function futureDate(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0]
}

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateRows(): string[][] {
  const shuffledDests    = shuffle(DESTINATIONS)
  const shuffledStatuses = shuffle(STATUSES)

  const header = [
    'application_id', 'customer_name', 'customer_name_ar', 'nationality',
    'visa_type', 'destination', 'status', 'submission_date', 'expected_date',
    'branch', 'notes',
  ]

  const rows: string[][] = [header]

  for (let i = 0; i < 50; i++) {
    const id     = `DK-2026-${String(i + 1).padStart(3, '0')}`
    const name   = NAMES[i]
    const dest   = shuffledDests[i]
    let   status = shuffledStatuses[i]

    // Force the 3 demo IDs to the correct statuses
    if (id === 'DK-2026-001') status = 'Under Review'
    if (id === 'DK-2026-007') status = 'Approved'
    if (id === 'DK-2026-012') status = 'Additional Docs'

    const visa    = randOf(VISA_TYPES)
    const branch  = randOf(BRANCHES)
    const subDate = randomDate(5, 60)

    let expectedDate = ''
    let notes        = ''

    switch (status) {
      case 'Submitted':       expectedDate = futureDate(14 + Math.floor(Math.random() * 14)); break
      case 'Under Review':    expectedDate = futureDate(7  + Math.floor(Math.random() * 14)); break
      case 'Additional Docs': expectedDate = futureDate(10 + Math.floor(Math.random() * 10)); notes = randOf(NOTES_ADDITIONAL); break
      case 'Approved':        expectedDate = randomDate(0, 5); break
      case 'Rejected':        expectedDate = '—'; notes = randOf(NOTES_REJECTED); break
    }

    rows.push([id, name.en, name.ar, 'Saudi', visa, dest, status, subDate, expectedDate, branch, notes])
  }

  return rows
}

async function seed() {
  console.log('🌱 Seeding demo data...\n')

  const rows = generateRows()

  // Clear then re-write Applications (idempotent)
  await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Applications!A:K' })
  console.log('🗑️  Cleared existing Applications data')

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Applications!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  })
  console.log(`✅ Wrote ${rows.length - 1} applications to Google Sheets`)

  // Write headers for Appointments + Interactions
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Appointments!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['appointment_id', 'customer_name', 'phone', 'whatsapp_number', 'branch', 'branch_code', 'date', 'time', 'visa_type', 'status', 'created_at']] },
  })
  console.log('✅ Appointments header written')

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Interactions!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [['timestamp', 'session_id', 'channel', 'language', 'agent_used', 'user_message_preview', 'escalated', 'duration_seconds']] },
  })
  console.log('✅ Interactions header written')

  console.log('\n📋 Demo IDs to memorize:')
  console.log('  DK-2026-001 → Under Review')
  console.log('  DK-2026-007 → Approved')
  console.log('  DK-2026-012 → Additional Docs')
  console.log('\n🎉 Done! All 3 sheets ready. Open your Google Sheet to verify.')
}

seed().catch(console.error)
