'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BrandMark } from '@/components/ui/BrandMark'
import { ShimmerSkeleton } from '@/components/ui/ShimmerSkeleton'
import { StatCard } from '@/components/dashboard/StatCard'
import { InteractionFeed, AGENT_LABELS, type Interaction } from '@/components/dashboard/InteractionFeed'
import { LanguageSplitBar } from '@/components/dashboard/LanguageSplitBar'

interface DashboardStats {
  totalCallsToday:  number
  escalationsToday: number
  arabicCalls:      number
  englishCalls:     number
  avgDuration:      number
  topAgent:         string
}

interface DashboardClientProps {
  initialStats:        DashboardStats | null
  initialInteractions: Interaction[]
}

export function DashboardClient({ initialStats, initialInteractions }: DashboardClientProps) {
  const [stats,        setStats]        = useState<DashboardStats | null>(initialStats)
  const [interactions, setInteractions] = useState<Interaction[]>(initialInteractions)
  const [error,        setError]        = useState('')
  const [refreshing,   setRefreshing]   = useState(false)
  const [lastUpdated,  setLastUpdated]  = useState<Date>(new Date())

  async function fetchData() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/dashboard', {
        headers: { 'x-dashboard-key': process.env.NEXT_PUBLIC_DASHBOARD_API_KEY ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setStats(json.stats)
      setInteractions(json.interactions)
      setError('')
      setLastUpdated(new Date())
    } catch {
      setError('Failed to reload dashboard data')
    } finally {
      setTimeout(() => setRefreshing(false), 500)
    }
  }

  useEffect(() => {
    // Auto-refresh every 30 seconds — initial data served by Server Component
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060E1E] via-[#0A1628] to-[#060E1E] text-white relative">
      {/* Faint grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 40px)`,
        }}
      />

      {/* Gold refresh progress line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#E4CC7A] to-[#C9A84C] z-50"
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: refreshing ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-[#060E1E]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              Direct <span className="text-[#C9A84C]">KSA</span>
              <span className="text-gray-500 font-normal ml-3 text-sm">AI Operations</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden sm:block">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchData}
              className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/[0.04]"
            >
              Refresh
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 text-xs font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-300 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats grid */}
        {stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
              <StatCard
                label="Calls Today"
                value={stats.totalCallsToday}
                icon={<svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
              />
              <StatCard
                label="Escalations"
                value={stats.escalationsToday}
                icon={<svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.5a1 1 0 01-.87 1.5H3.21a1 1 0 01-.87-1.5L12 3z" /></svg>}
                accentColor={stats.escalationsToday > 0 ? 'text-red-400' : 'text-white'}
              />
              <StatCard
                label="Arabic"
                value={stats.arabicCalls}
                icon={<span className="text-emerald-400 font-arabic text-xs font-bold">ع</span>}
                accentColor="text-emerald-400"
              />
              <StatCard
                label="English"
                value={stats.englishCalls}
                icon={<span className="text-blue-400 text-xs font-bold">EN</span>}
                accentColor="text-blue-400"
              />
              <StatCard
                label="Avg Duration"
                value={`${stats.avgDuration}s`}
                icon={<svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                accentColor="text-[#C9A84C]"
                animate={false}
              />
              <StatCard
                label="Top Agent"
                value={AGENT_LABELS[stats.topAgent] ?? stats.topAgent}
                icon={<svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
                accentColor="text-[#C9A84C]"
                animate={false}
              />
            </div>

            {/* Language split bar */}
            <div className="mb-8">
              <LanguageSplitBar arabic={stats.arabicCalls} english={stats.englishCalls} />
            </div>
          </>
        ) : (
          /* Skeleton loading for stats */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] rounded-2xl p-5 space-y-3">
                <ShimmerSkeleton width="80px" height="12px" />
                <ShimmerSkeleton width="60px" height="32px" />
              </div>
            ))}
          </div>
        )}

        {/* Interactions feed */}
        <InteractionFeed interactions={interactions} />
      </div>
    </div>
  )
}
