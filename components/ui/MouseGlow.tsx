'use client'

import { useEffect } from 'react'

export function MouseGlow() {
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--gx', ((e.clientX / window.innerWidth) * 100).toFixed(2))
      document.documentElement.style.setProperty('--gy', ((e.clientY / window.innerHeight) * 100).toFixed(2))
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return null
}
