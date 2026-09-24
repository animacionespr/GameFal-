import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { PerformanceScore } from '@/components/home/PerformanceScore'
import { QuickStats } from '@/components/home/QuickStats'
import { ProjectsOverview } from '@/components/home/ProjectsOverview'
import { RecentAnnouncements } from '@/components/home/RecentAnnouncements'
import { gobernadorPR } from '@/lib/data/oficial-pr'
import { OfficialPhoto } from '@/components/ui/OfficialPhoto'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { ApprovalRating } from '@/components/home/ApprovalRating'
import { ChevronRight, Shield, Dot } from 'lucide-react'

export default function HomePage() {
  const { nombre, cargo, partido, foto, fotoSources } = gobernadorPR

  return (
    <PageShell title="GovTracker PR" subtitle="Transparencia basada en datos oficiales" showSearch>
      <OnboardingTour />
      <div className="space-y-5 pb-6">

        {/* Hero banner — full bleed, immersive */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #001228 0%, #00307A 40%, #0060C0 75%, #0090D8 100%)' }}>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />
          {/* Radial glow center */}
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 40%, #00A3FF, transparent)' }}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F0F4FA] dark:from-[#0D1120] to-transparent" />

          <div className="relative px-4 pt-6 pb-10">
            <Link href="/jenniffer-gonzalez-colon/perfil/" className="flex items-center gap-4 active:opacity-80 transition-opacity">
              {/* Photo — larger, with glow ring */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl blur-md opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00A3FF, #0050B3)', transform: 'scale(1.1)' }} />
                <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden ring-2 ring-white/40 shadow-2xl">
                  <OfficialPhoto
                    sources={fotoSources ?? []}
                    fallback={foto}
                    alt={nombre}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Live dot */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 pulse-dot" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/50 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">{partido}</p>
                <p className="text-white font-black text-[19px] leading-tight tracking-tight">{nombre}</p>
                <p className="text-white/65 text-[12px] font-medium mt-0.5">{cargo}</p>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ChevronRight size={15} className="text-white/70" />
              </div>
            </Link>

            {/* Verified strip */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                <Shield size={10} className="text-green-400" />
                <span className="text-white/80 text-[10px] font-semibold">Datos verificados · Fuentes oficiales</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500/20 rounded-full px-2.5 py-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
                <span className="text-green-300 text-[10px] font-bold">En vivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance score */}
        <div className="px-4 -mt-3 relative z-10 fade-up stagger-1" data-tour="performance">
          <PerformanceScore />
        </div>

        {/* Approval rating */}
        <div className="fade-up stagger-2">
          <ApprovalRating />
        </div>

        {/* Quick stats */}
        <div className="fade-up stagger-3" data-tour="stats">
          <QuickStats />
        </div>

        {/* Projects */}
        <div className="fade-up stagger-4">
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
