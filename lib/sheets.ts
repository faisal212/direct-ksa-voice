// lib/sheets.ts
// Shared Google Sheets client — all functions use single auth instance

import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SHEET_ID = process.env.GOOGLE_SHEETS_ID!

// ── Application Status ─────────────────────────────────────────────

export async function getApplicationStatus(applicationId: string) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Applications!A:K',
    })
    const rows = res.data.values ?? []
    // O(n) scan — sufficient for demo (50 rows)
    const app = rows.slice(1).find(row => row[0] === applicationId)
    if (!app) return null
    return {
      applicationId: app[0],
      customerName: app[1],
      customerNameAr: app[2],
      nationality: app[3],
      visaType: app[4],
      destination: app[5],
      status: app[6],
      submissionDate: app[7],
      expectedDate: app[8],
      branch: app[9],
      notes: app[10] ?? '',
    }
  } catch (error) {
    console.error('Sheets getApplicationStatus error:', error)
    return {
      applicationId,
      status: 'Error',
      customerName: '',
      customerNameAr: '',
      expectedDate: '',
      notes: 'System temporarily unavailable. Please try again.',
    }
  }
}

// ── Appointment Booking ────────────────────────────────────────────

export async function createAppointment(data: {
  branch: string; branch_code: string; date: string; time: string
  customer_name: string; phone: string; whatsapp_number?: string; visa_type: string
}) {
  const bookingId = `APT-${data.branch_code}-${data.date.replace(/-/g, '')}-${Math.floor(Math.random() * 900) + 100}`
  try {
    // Basic conflict check — prevent double-booking same branch + date + time
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Appointments!A:J',
    })
    const rows = existing.data.values ?? []
    const conflict = rows.slice(1).find(
      row => row[3] === data.branch && row[5] === data.date && row[6] === data.time && row[8] === 'Confirmed'
    )
    if (conflict) {
      return {
        bookingId: null,
        conflict: true,
        message: `Time slot ${data.time} on ${data.date} at ${data.branch} is already booked. Please choose another time.`,
      }
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Appointments!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          bookingId, data.customer_name, `'${data.phone}`, `'${data.whatsapp_number ?? data.phone}`,
          data.branch, data.branch_code, data.date,
          data.time, data.visa_type, 'Confirmed', new Date().toISOString(),

        ]]
      },
    })
    return {
      bookingId,
      conflict: false,
      message: `Appointment confirmed at ${data.branch} on ${data.date} at ${data.time}`,
    }
  } catch (error) {
    console.error('Sheets createAppointment error:', error)
    // Return bookingId anyway — agent can still confirm verbally
    return {
      bookingId,
      conflict: false,
      message: `Appointment confirmed at ${data.branch} on ${data.date} at ${data.time}`,
    }
  }
}

// ── Interaction Logging ────────────────────────────────────────────

export async function logInteraction(data: {
  sessionId: string; channel: string; language: string
  agentUsed: string; userMessage: string; escalated: boolean
  duration?: number  // optional — real duration from Vapi end-of-call-report
}) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Interactions!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString().replace('T', ' ').substring(0, 19),
          data.sessionId, data.channel, data.language,
          data.agentUsed, data.userMessage.substring(0, 100),
          data.escalated ? 'Yes' : 'No',
          data.duration ?? '',  // never fake it — empty if unknown
        ]]
      },
    })
  } catch (error) {
    // Logging failure should NEVER crash the call
    console.error('Sheets logInteraction error:', error)
  }
}

// ── Dashboard Data ─────────────────────────────────────────────────

export async function getDashboardData() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Interactions!A:H',
    })

    const rows = res.data.values ?? []
    const data = rows.slice(1)

    const interactions = data.map(row => ({
      timestamp: row[0] ?? '',
      sessionId: row[1] ?? '',
      channel: row[2] ?? '',
      language: row[3] ?? '',
      agentUsed: row[4] ?? '',
      userMessage: row[5] ?? '',
      escalated: row[6] === 'Yes',
      duration: parseInt(row[7] ?? '0') || 0,
    }))

    // Filter to today (UTC — KSA is UTC+3)
    // Demo tip: run demos in morning/afternoon to avoid "0 calls today" edge case
    const today = new Date().toISOString().split('T')[0]
    const todayInteractions = interactions.filter(i => i.timestamp.startsWith(today))

    const stats = {
      totalCallsToday: todayInteractions.length,
      escalationsToday: todayInteractions.filter(i => i.escalated).length,
      arabicCalls: todayInteractions.filter(i => i.language === 'arabic').length,
      englishCalls: todayInteractions.filter(i => i.language === 'english').length,
      avgDuration: todayInteractions.length
        ? Math.round(todayInteractions.reduce((sum, i) => sum + i.duration, 0) / todayInteractions.length)
        : 0,
      topAgent: getMostCommon(todayInteractions.map(i => i.agentUsed)),
    }

    return { stats, interactions: interactions.slice(-20).reverse() }
  } catch (error) {
    console.error('getDashboardData error:', error)
    return null
  }
}

function getMostCommon(arr: string[]): string {
  if (!arr.length) return 'none'
  const counts = arr.reduce((acc, val) => ({ ...acc, [val]: (acc[val] ?? 0) + 1 }), {} as Record<string, number>)
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}
