'use client'

interface BrandMarkProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export function BrandMark({ variant = 'light', size = 'md' }: BrandMarkProps) {
  const sizes      = { sm: 'text-xl',   md: 'text-3xl', lg: 'text-4xl' }
  const arabicSize = { sm: 'text-xs',   md: 'text-sm',  lg: 'text-base' }
  const textColor  = variant === 'light' ? 'text-[#0A1628]' : 'text-white'
  const arabicColor = variant === 'light' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className="text-center">
      <h1 className={`${sizes[size]} font-bold tracking-tight ${textColor}`}>
        Direct <span className="text-[#C9A84C]">KSA</span>
      </h1>
      <p className={`font-arabic ${arabicSize[size]} ${arabicColor} mt-0.5`} dir="rtl">دايركت</p>
    </div>
  )
}
