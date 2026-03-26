'use client'

interface ShimmerSkeletonProps {
  width?: string
  height?: string
  rounded?: string
  className?: string
}

export function ShimmerSkeleton({
  width = '100%',
  height = '20px',
  rounded = 'rounded-lg',
  className = '',
}: ShimmerSkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer ${rounded} ${className}`}
      style={{ width, height, backgroundColor: 'rgba(255,255,255,0.05)' }}
    />
  )
}
