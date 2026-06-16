import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { PerformanceScore } from '@/components/home/PerformanceScore'
import { QuickStats } from '@/components/home/QuickStats'
import { ProjectsOverview } from '@/components/home/ProjectsOverview'
import { RecentAnnouncements } from '@/components/home/RecentAnnouncements'
import { gobernadorPR } from '@/lib/data/oficial-pr'
import { ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { nombre, cargo, partido, foto, administracion } = gobernadorPR

  return (
    <PageShell title="GovTracker PR" subtitle="Transparencia basada en datos oficiales" showSearch>
      <div className="space-y-5 py-4">
        {/* Official banner */}
        <Link href="/perfil" className="mx-4 flex items-center gap-3 card p-3.5 active:scale-[0.98] transition-transform">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0">
            <Image src={foto} alt={nombre} fill className="object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{partido}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">{nombre}</p>
            <p className="text-xs text-primary dark:text-secondary font-medium truncate">{cargo}</p>
          </div>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        </Link>

        {/* Performance score */}
        <div className="px-4">
          <PerformanceScore />
        </div>

        {/* Quick stats */}
        <QuickStats />

        {/* Projects overview */}
        <ProjectsOverview />

        {/* Recent announcements */}
        <RecentAnnouncements />

        {/* Disclaimer */}
        <div className="mx-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40">
          <p className="text-[10px] text-blue-700 dark:text-blue-400 text-center leading-relaxed">
            Toda la información proviene exclusivamente de fuentes oficiales y verificables del Gobierno de Puerto Rico.
            Esta plataforma es neutral, no afiliada a ningún partido político.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
