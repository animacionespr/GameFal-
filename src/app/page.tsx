import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { PerformanceScore } from '@/components/home/PerformanceScore'
import { QuickStats } from '@/components/home/QuickStats'
import { ProjectsOverview } from '@/components/home/ProjectsOverview'
import { RecentAnnouncements } from '@/components/home/RecentAnnouncements'
import { gobernadorPR } from '@/lib/data/oficial-pr'
import { ChevronRight, Shield } from 'lucide-react'

export default function HomePage() {
  const { nombre, cargo, partido, foto } = gobernadorPR

  return (
    <PageShell title="GovTracker PR" subtitle="Transparencia basada en datos oficiales" showSearch>
      <div className="space-y-5 pb-6">

        {/* Hero banner */}
        <div className="relative overflow-hidden gradient-hero mx-0">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative px-4 pt-5 pb-6">
            <Link href="/perfil" className="flex items-center gap-3.5 active:opacity-80 transition-opacity">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-xl shrink-0">
                <Image src={foto} alt={nombre} fill className="object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-0.5">{partido}</p>
                <p className="text-white font-bold text-[16px] leading-tight">{nombre}</p>
                <p className="text-white/70 text-[12px] font-medium">{cargo}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <ChevronRight size={16} className="text-white/70" />
              </div>
            </Link>

            {/* Verified badge */}
            <div className="flex items-center gap-1.5 mt-4 bg-white/10 rounded-xl px-3 py-2 w-fit">
              <Shield size={11} className="text-green-400" />
              <p className="text-white/80 text-[10px] font-semibold">
                Datos verificados — Solo fuentes oficiales del Gobierno de PR
              </p>
            </div>
          </div>
        </div>

        {/* Performance score */}
        <div className="px-4 fade-up stagger-1">
          <PerformanceScore />
        </div>

        {/* Quick stats */}
        <div className="fade-up stagger-2">
          <QuickStats />
        </div>

        {/* Projects */}
        <div className="fade-up stagger-3">
          <ProjectsOverview />
        </div>

        {/* Announcements */}
        <div className="fade-up stagger-4">
          <RecentAnnouncements />
        </div>

      </div>
    </PageShell>
  )
}
