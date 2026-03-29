// scripts/vapi/api.ts
// Vapi REST API helpers
// NOTE: process.env.VAPI_API_KEY is read lazily inside apiCall() (not at module init)
// because ES module imports are hoisted before dotenv.config() runs in the entry point.

const BASE_URL = 'https://api.vapi.ai'

export async function apiCall(method: string, endpoint: string, body?: object) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY!}`,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  })
  if (!res.ok) throw new Error(`${method} ${endpoint}: ${await res.text()}`)
  return res.json()
}

export const post  = (ep: string, b: object) => apiCall('POST',  ep, b)
export const patch = (ep: string, b: object) => apiCall('PATCH', ep, b)
