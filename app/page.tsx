'use client'

// app/page.tsx
// CLIENT COMPONENT — brand color reads NEXT_PUBLIC_ vars inlined at build time

import Link from 'next/link'
import { brand } from '@/lib/brand'
import { TiltCard } from '@/components/ui/TiltCard'

export default function HomePage() {
  const namePrimary = brand.name.replace(brand.nameAccent, '').trim()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="text-center max-w-lg">
        {/* Brand */}
        <h1 className="font-display text-6xl tracking-tight text-white">
          {namePrimary} <span style={{ color: 'var(--brand-color)' }}>{brand.nameAccent}</span>
        </h1>
        <p className="font-arabic text-xl text-gray-500 mt-2" dir="rtl">{brand.nameAr}</p>

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 opacity-40" style={{ background: 'linear-gradient(to right, transparent, var(--brand-color))' }} />
          <div className="w-1.5 h-1.5 rounded-full opacity-60" style={{ background: 'var(--brand-color)' }} />
          <div className="h-px w-16 opacity-40" style={{ background: 'linear-gradient(to left, transparent, var(--brand-color))' }} />
        </div>

        <p className="text-gray-400 text-lg mb-10">
          AI Customer Experience Suite
        </p>

        {/* Navigation Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TiltCard>
            <Link
              href="/status"
              className="group block p-6 rounded-2xl glass-card glass-card-hover transition-all duration-300"
            >
              <div className="mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-color)' }}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M11 8v3l2 2" />
                  <path d="M16.5 16.5 21 21" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-white">Application Status</h2>
              <p className="text-sm text-gray-400 mt-1">Check your visa application</p>
              <p className="text-sm text-gray-500 font-arabic mt-1" dir="rtl">تحقق من حالة طلبك</p>
            </Link>
          </TiltCard>

          <TiltCard>
            <Link
              href="/dashboard"
              className="group block p-6 rounded-2xl glass-card glass-card-hover transition-all duration-300"
            >
              <div className="mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-color)' }}>
                  <rect x="3" y="12" width="4" height="9" rx="0.5" />
                  <rect x="10" y="7" width="4" height="14" rx="0.5" />
                  <rect x="17" y="3" width="4" height="18" rx="0.5" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-white">Operations Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">Live AI call analytics</p>
              <p className="text-sm text-gray-500 font-arabic mt-1" dir="rtl">تحليلات المكالمات الحية</p>
            </Link>
          </TiltCard>
        </div>

        <p className="text-xs text-gray-600 mt-10">
          Powered by Vapi AI Squads + GPT-5.2
        </p>
      </div>
    </div>
  )
}
