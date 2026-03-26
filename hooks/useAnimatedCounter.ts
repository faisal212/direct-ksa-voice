'use client'

import { useEffect, useRef, useCallback } from 'react'

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useAnimatedCounter(target: number, duration: number = 800) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevTarget = useRef(0)

  const animate = useCallback(() => {
    const el = ref.current
    if (!el) return

    const start = prevTarget.current
    const diff = target - start
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = Math.round(start + diff * eased)

      if (el) el.textContent = current.toString()

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        prevTarget.current = target
      }
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  useEffect(() => {
    animate()
  }, [animate])

  return ref
}
