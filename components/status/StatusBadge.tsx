'use client'

import { motion } from 'framer-motion'

interface StatusBadgeProps {
  status: string
  messages: { ar: string; en: string }
}

const STATUS_CONFIG: Record<string, {
  bg: string; text: string; glow: string; icon: string
}> = {
  'Approved':        { bg: 'from-emerald-950/80 to-emerald-900/60', text: 'text-emerald-300', glow: 'bg-emerald-500/20', icon: '✓' },
  'Under Review':    { bg: 'from-blue-950/80 to-blue-900/60',       text: 'text-sky-300',     glow: 'bg-blue-500/20',    icon: '⏳' },
  'Submitted':       { bg: 'from-amber-950/80 to-amber-900/60',     text: 'text-amber-200',   glow: 'bg-amber-500/20',   icon: '📥' },
  'Additional Docs': { bg: 'from-orange-950/80 to-orange-900/60',   text: 'text-orange-300',  glow: 'bg-orange-500/20',  icon: '📄' },
  'Rejected':        { bg: 'from-red-950/80 to-red-900/60',         text: 'text-red-300',     glow: 'bg-red-500/20',     icon: '✕' },
}

const FALLBACK = { bg: 'from-gray-950/80 to-gray-900/60', text: 'text-gray-300', glow: 'bg-gray-500/20', icon: '?' }

export function StatusBadge({ status, messages }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? FALLBACK

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${config.bg} border border-white/10 text-center overflow-hidden`}
    >
      {/* Animated glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`${config.glow} blur-2xl rounded-full w-32 h-32 animate-pulse`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-3xl mb-2">{config.icon}</div>
        <p className={`${config.text} text-xl font-bold`}>{status}</p>
        <p className={`${config.text}/70 text-sm mt-2`}>{messages.en}</p>
        <p className={`${config.text}/70 text-sm mt-1 font-arabic`} dir="rtl">{messages.ar}</p>
      </div>
    </motion.div>
  )
}
