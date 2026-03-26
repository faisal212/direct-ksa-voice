'use client'

interface LanguageSplitBarProps {
  arabic:  number
  english: number
}

export function LanguageSplitBar({ arabic, english }: LanguageSplitBarProps) {
  const total = arabic + english
  if (total === 0) return null

  const arabicPct  = Math.round((arabic  / total) * 100)
  const englishPct = 100 - arabicPct

  return (
    <div className="w-full">
      <div className="h-1.5 rounded-full overflow-hidden flex bg-white/5">
        <div
          className="bg-emerald-500/80 transition-all duration-700 rounded-l-full"
          style={{ width: `${arabicPct}%` }}
        />
        <div
          className="bg-blue-500/80 transition-all duration-700 rounded-r-full"
          style={{ width: `${englishPct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
        <span>Arabic {arabicPct}%</span>
        <span>English {englishPct}%</span>
      </div>
    </div>
  )
}
