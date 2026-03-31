'use client'

import { useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({ children, className = '', maxTilt = 3 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * maxTilt)
    rx.set(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * maxTilt)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
