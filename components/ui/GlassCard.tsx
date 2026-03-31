'use client'

interface GlassCardProps {
  variant?: 'light' | 'dark'
  hoverable?: boolean
  className?: string
  children: React.ReactNode
}

export function GlassCard({ variant = 'light', hoverable = false, className = '', children }: GlassCardProps) {
  const base = variant === 'light'
    ? 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-black/5'
    : 'glass-card'

  const hover = hoverable
    ? variant === 'light'
      ? 'hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:bg-white/90 transition-all duration-300'
      : 'glass-card-hover transition-all duration-300'
    : ''

  return (
    <div className={`rounded-2xl ${base} ${hover} ${className}`}>
      {children}
    </div>
  )
}
