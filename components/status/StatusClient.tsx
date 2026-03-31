'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { BrandMark } from '@/components/ui/BrandMark'
import { brand, brandDerived } from '@/lib/brand'
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
  const [seqInput, setSeqInput] = useState('')
  const [data,     setData]     = useState<StatusData | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const currentYear = new Date().getFullYear()
  const fullId = `${brand.idPrefix}-${currentYear}-${seqInput.trim().padStart(3, '0')}`

  async function checkStatus() {
    if (!seqInput.trim()) return
    setLoading(true)
    setError('')
    setData(null)

    try {
      const res  = await fetch(`/api/status?id=${encodeURIComponent(fullId)}`)
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
    <div className="min-h-screen relative flex items-center justify-center p-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <GlassCard variant="dark" className="p-10 w-full max-w-lg relative overflow-hidden">
          {/* Gold accent top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#C9A84C]/0 via-[#C9A84C] to-[#C9A84C]/0" />

          {/* Brand + Header */}
          <div className="mb-10">
            <BrandMark variant="dark" size="md" />
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
              <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">Application Status</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
            </div>
            <p className="font-arabic text-lg text-gray-500 mt-1 text-center" dir="rtl">حالة الطلب</p>
          </div>

          {/* Segmented ID input */}
          <div className="space-y-4">
            <p className="text-xs text-gray-500 text-center tracking-wider uppercase">Enter your application number</p>

            <div className="flex items-center justify-center gap-2">
              {/* Fixed: Brand prefix */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, type: 'spring', stiffness: 400, damping: 28 }}
                className="h-13 px-4 py-3.5 flex items-center justify-center rounded-xl bg-[#C9A84C]/[0.07] border border-[#C9A84C]/20"
                title="Brand prefix — fixed"
              >
                <span className="font-mono text-sm tracking-[0.25em] select-none" style={{ color: 'var(--brand-color)', opacity: 0.65 }}>
                  {brand.idPrefix}
                </span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-mono text-sm select-none text-[#C9A84C]/25"
              >—</motion.span>

              {/* Fixed: Year */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 28 }}
                className="h-13 px-4 py-3.5 flex items-center justify-center rounded-xl bg-[#C9A84C]/[0.07] border border-[#C9A84C]/20"
                title="Application year — fixed"
              >
                <span className="font-mono text-sm tracking-[0.25em] select-none" style={{ color: 'var(--brand-color)', opacity: 0.65 }}>
                  {currentYear}
                </span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-sm select-none text-[#C9A84C]/25"
              >—</motion.span>

              {/* Editable: Sequence number */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 400, damping: 28 }}
                className="h-13 px-4 py-3.5 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.14] focus-within:border-[#C9A84C]/55 focus-within:bg-[#C9A84C]/[0.05] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.13)] transition-all duration-300 cursor-text"
                onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={seqInput}
                  onChange={e => setSeqInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                  onKeyDown={e => e.key === 'Enter' && checkStatus()}
                  placeholder="001"
                  maxLength={3}
                  autoFocus
                  className="w-14 bg-transparent text-center font-mono text-sm tracking-[0.25em] text-white placeholder:text-gray-600 focus:outline-none"
                />
              </motion.div>
            </div>

            <button
              onClick={checkStatus}
              disabled={loading || !seqInput.trim()}
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
                className="mt-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm text-red-300 text-sm text-center"
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
                      className="flex justify-between items-center py-3 border-b border-white/[0.06] last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{row.label}</span>
                      <span className={`text-base font-semibold text-white ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Notes */}
                {data.notes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.5a1 1 0 01-.87 1.5H3.21a1 1 0 01-.87-1.5L12 3z" />
                      </svg>
                      <p className="text-sm text-amber-200">Note: {data.notes}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-8 pt-6 border-t border-white/[0.06]">
            Questions? Visit any {brand.name} branch or call us
            <br />
            <span className="font-arabic" dir="rtl">لأي استفسار، زوروا أي فرع أو تواصلوا معنا</span>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
