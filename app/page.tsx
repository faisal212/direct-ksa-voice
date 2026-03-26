// app/page.tsx
// SERVER COMPONENT — no 'use client'
// Branded landing page with links to status portal and dashboard

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-white to-[#F5F0E8] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        {/* Brand */}
        <h1 className="text-5xl font-bold tracking-tight text-[#0A1628]">
          Direct <span className="text-[#C9A84C]">KSA</span>
        </h1>
        <p className="font-arabic text-xl text-gray-400 mt-2" dir="rtl">دايركت</p>

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
        </div>

        <p className="text-gray-500 text-lg mb-10">
          AI Customer Experience Suite
        </p>

        {/* Navigation Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/status"
            className="group block p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h2 className="text-lg font-semibold text-[#0A1628]">Application Status</h2>
            <p className="text-sm text-gray-400 mt-1">Check your visa application</p>
            <p className="text-sm text-gray-400 font-arabic" dir="rtl">تحقق من حالة طلبك</p>
          </Link>

          <Link
            href="/dashboard"
            className="group block p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-2xl mb-2">📊</div>
            <h2 className="text-lg font-semibold text-[#0A1628]">Operations Dashboard</h2>
            <p className="text-sm text-gray-400 mt-1">Live AI call analytics</p>
            <p className="text-sm text-gray-400 font-arabic" dir="rtl">تحليلات المكالمات الحية</p>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-10">
          Powered by Vapi AI Squads + GPT-4o-mini
        </p>
      </div>
    </div>
  )
}
