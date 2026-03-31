'use client'

import { motion } from 'framer-motion'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'
import { GlassCard } from '@/components/ui/GlassCard'

interface StatCardProps {
  label:        string
  value:        number | string
  icon:         React.ReactNode
  accentColor?: string
  animate?:     boolean
}

export function StatCard({ label, value, icon, accentColor = 'text-white', animate = true }: StatCardProps) {
  const isNumeric  = typeof value === 'number'
  const counterRef = useAnimatedCounter(isNumeric && animate ? value : 0)

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <GlassCard variant="dark" hoverable className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-sm">
            {icon}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <p className={`font-bold tabular-nums leading-tight ${accentColor} ${
          isNumeric || String(value).length <= 6
            ? 'text-3xl'
            : String(value).length <= 10
              ? 'text-2xl'
              : 'text-lg'
        }`}>
          {isNumeric && animate ? (
            <span ref={counterRef}>{value}</span>
          ) : (
            value
          )}
        </p>
      </GlassCard>
    </motion.div>
  )
}
