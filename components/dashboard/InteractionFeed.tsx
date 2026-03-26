'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'

// Single source of truth for Interaction type — imported by DashboardClient too
export interface Interaction {
  timestamp:   string
  sessionId:   string
  channel:     string
  language:    string
  agentUsed:   string
  userMessage: string
  escalated:   boolean
  duration:    number
}

export const AGENT_LABELS: Record<string, string> = {
  'greeter':                 'Greeter',
  'visa-specialist':         'Visa',
  'status-specialist':       'Status',
  'documents-specialist':    'Documents',
  'appointments-specialist': 'Appointments',
  'care-specialist':         'Care',
  'call-summary':            'Summary',
}

export function InteractionFeed({ interactions }: { interactions: Interaction[] }) {
  return (
    <GlassCard variant="dark" className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Recent Interactions</h2>
        <span className="text-xs text-gray-500">{interactions.length} entries</span>
      </div>

      {/* List */}
      {interactions.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No interactions yet</p>
          <p className="text-gray-600 text-xs mt-1">Make a test call to see live data</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.03]">
          <AnimatePresence initial={false}>
            {interactions.map((interaction, i) => (
              <motion.div
                key={`${interaction.sessionId}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors duration-200"
              >
                {/* Left: Language + Agent + Message */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                    interaction.language === 'arabic'
                      ? 'bg-emerald-500/10 text-emerald-400 font-arabic'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {interaction.language === 'arabic' ? 'ع' : 'EN'}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-gray-300 text-xs font-medium shrink-0">
                    {AGENT_LABELS[interaction.agentUsed] ?? interaction.agentUsed}
                  </span>

                  <span
                    className={`text-gray-500 text-sm truncate max-w-[300px] xl:max-w-md ${
                      interaction.language === 'arabic' ? 'font-arabic' : ''
                    }`}
                    dir={interaction.language === 'arabic' ? 'rtl' : 'ltr'}
                  >
                    {interaction.userMessage}
                  </span>
                </div>

                {/* Right: Escalation + Duration + Time */}
                <div className="flex items-center gap-4 shrink-0">
                  {interaction.escalated && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.5a1 1 0 01-.87 1.5H3.21a1 1 0 01-.87-1.5L12 3z" />
                      </svg>
                      Escalated
                    </span>
                  )}
                  <span className="text-xs text-gray-500 tabular-nums min-w-[40px] text-right">
                    {interaction.duration}s
                  </span>
                  <span className="text-xs text-gray-600 tabular-nums min-w-[50px] text-right">
                    {interaction.timestamp.split(' ')[1] ?? interaction.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </GlassCard>
  )
}
