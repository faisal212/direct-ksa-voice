'use client'

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
    </div>
  )
}
