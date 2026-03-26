'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { BrandMark } from '@/components/ui/BrandMark'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { StatusBadge } from '@/components/status/StatusBadge'

interface StatusData {
  applicationId:  string
  customerName:   string
  customerNameAr: string
  status:         string
  expectedDate:   string
  notes:          string
}

const STATUS_MESSAGES: Record<string, { ar: string; en: string }> = {
  'Approved':        { ar: 'تهانينا! تم الموافقة على طلبك',     en: 'Congratulations! Your application has been approved.' },
  'Under Review':    { ar: 'طلبك قيد المراجعة من فريقنا',       en: 'Your application is under review by our team.' },
  'Submitted':       { ar: 'تم استلام طلبك بنجاح',              en: 'Your application has been received successfully.' },
  'Additional Docs': { ar: 'يحتاج طلبك وثائق إضافية',           en: 'Your application requires additional documents.' },
  'Rejected':        { ar: 'لم يتم الموافقة على طلبك',          en: 'Your application was not approved.' },
}

export function StatusClient() {
  const [appId,   setAppId]   = useState('')
  const [data,    setData]    = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function checkStatus() {
    if (!appId.trim()) return
    setLoading(true)
    setError('')
    setData(null)

    try {
      const res  = await fetch(`/api/status?id=${encodeURIComponent(appId.trim().toUpperCase())}`)
      const json = await res.json()

      if (!res.ok || json.error) {
        setError(json.error ?? 'No application found with this ID. Please check and try again.')
      } else {
        setData(json)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-white to-[#F5F0E8] relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#0A1628]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Faint Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <GlassCard variant="light" className="p-10 w-full max-w-lg relative overflow-hidden">
          {/* Gold accent top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C]/0 via-[#C9A84C] to-[#C9A84C]/0" />

          {/* Brand + Header */}
          <div className="mb-10">
            <BrandMark variant="light" size="md" />
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
              <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">Application Status</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
            </div>
            <p className="font-arabic text-lg text-gray-400 mt-1 text-center" dir="rtl">حالة الطلب</p>
          </div>

          {/* Input */}
          <div className="space-y-3">
            <input
              type="text"
              value={appId}
              onChange={e => setAppId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkStatus()}
              placeholder="DK-2026-001"
              className="w-full bg-[#F5F0E8]/50 border border-[#E8DFD0] rounded-2xl px-6 py-4 text-center text-lg font-mono tracking-widest text-[#0A1628] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C]/30 transition-all duration-300 uppercase"
            />
            <button
              onClick={checkStatus}
              disabled={loading || !appId.trim()}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E4CC7A] text-[#0A1628] rounded-2xl py-4 font-bold text-base tracking-wide hover:shadow-lg hover:shadow-[#C9A84C]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-[#0A1628]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span>Check Status <span className="font-arabic text-sm opacity-80">| تحقق من الحالة</span></span>
              )}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 p-5 rounded-2xl bg-red-50/80 border border-red-200/30 backdrop-blur-sm text-red-700 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mt-8 space-y-5"
              >
                <StatusBadge
                  status={data.status}
                  messages={STATUS_MESSAGES[data.status] ?? { ar: '', en: '' }}
                />

                <GoldDivider />

                {/* Detail rows */}
                <div className="space-y-0">
                  {[
                    { label: 'Application ID', value: data.applicationId, mono: true },
                    { label: 'Name',            value: data.customerName },
                    ...(data.expectedDate && data.expectedDate !== '—'
                      ? [{ label: 'Expected Date', value: data.expectedDate, mono: false }]
                      : []),
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex justify-between items-center py-3 border-b border-[#E8DFD0]/30 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{row.label}</span>
                      <span className={`text-base font-semibold text-[#0A1628] ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Notes */}
                {data.notes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.5a1 1 0 01-.87 1.5H3.21a1 1 0 01-.87-1.5L12 3z" />
                      </svg>
                      <p className="text-sm text-amber-800">Note: {data.notes}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-xs text-center text-gray-400 mt-8 pt-6 border-t border-[#E8DFD0]/20">
            Questions? Visit any Direct KSA branch or call us
            <br />
            <span className="font-arabic" dir="rtl">لأي استفسار، زوروا أي فرع أو تواصلوا معنا</span>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
