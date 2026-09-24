import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { OfficialPhoto } from '@/components/ui/OfficialPhoto'
import { ChevronRight, Shield, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export async function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function OfficialDashboard({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  const { oficial, estadisticas, noticias, promesas } = bundle

  const score = oficial.puntajeRendimiento
  const scoreColor = score >= 70 ? '#16A34A' : score >= 50 ? '#00A3FF' : '#F59E0B'
  const scoreLabel = score >= 70 ? 'Rendimiento Bueno' : score >= 50 ? 'Rendimiento Moderado' : 'Necesita Mejoras'
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  const keyStats = estadisticas.slice(0, 4)
  const recentNews = noticias.slice(0, 3)

  return (
    <DynamicPageShell slug={params.slug} title={oficial.bandera + ' ' + oficial.pais} subtitle="Datos oficiales verificados">
      <div className="space-y-5 pb-6">

        {/* Hero */}
        <div className="gradient-hero px-4 pt-5 pb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='1.2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px',
            }}
          />
          <Link href={`/${params.slug}/perfil`} className="relative flex items-center gap-3.5 active:opacity-80">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-xl shrink-0">
              <OfficialPhoto sources={oficial.fotoSources ?? []} fallback={oficial.foto} alt={oficial.nombre} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-[9.5px] font-semibold uppercase tracking-widest mb-0.5">
                {oficial.partido}
              </p>
              <p className="text-white font-bold text-[16px] leading-tight">{oficial.nombre}</p>
              <p className="text-white/70 text-[11.5px] font-medium">{oficial.cargo}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ChevronRight size={16} className="text-white/70" />
            </div>
          </Link>
          <div className="relative flex items-center gap-1.5 mt-4 bg-white/10 rounded-xl px-3 py-2 w-fit">
            <Shield size={10} className="text-green-400" />
            <p className="text-white/80 text-[9.5px] font-semibold">Solo fuentes oficiales verificadas</p>
          </div>
        </div>

        {/* Score + promises */}
        <div className="px-4">
          <div className="card p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <div className="absolute inset-0 rounded-full opacity-20 blur-lg" style={{ background: scoreColor }} />
                <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r={r} fill="none" className="text-gray-100 dark:text-gray-700/60" stroke="currentColor" strokeWidth="8" />
                  <circle cx="48" cy="48" r={r} fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <span className="text-[24px] font-black text-gray-900 dark:text-white leading-none">{score}</span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">pts</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-text mb-0.5">Rendimiento General</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight">{scoreLabel}</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Logradas', value: oficial.promesasCompletadas, bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
                    { label: 'Activas',  value: oficial.promesasEnProgreso,  bg: 'bg-blue-500/10',  text: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Tardías',  value: oficial.promesasRetrasadas,   bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
                  ].map(({ label, value, bg, text }) => (
                    <div key={label} className={`${bg} rounded-xl p-2 text-center`}>
                      <p className={`text-[16px] font-black ${text}`}>{value}</p>
                      <p className="text-[8px] font-semibold text-gray-500 dark:text-gray-500 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-3 text-center">
              Basado en {oficial.promesasTotal} compromisos públicos verificados
            </p>
          </div>
        </div>

        {/* Key stats */}
        {keyStats.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="section-title">Indicadores Clave</h2>
              <Link href={`/${params.slug}/estadisticas`} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-secondary">
                Ver todos <ChevronRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 px-4">
              {keyStats.map(stat => (
                <div key={stat.id} className="card p-3.5">
                  <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{stat.nombre}</p>
                  <p className="text-[20px] font-black text-gray-900 dark:text-white leading-none">
                    {typeof stat.valor === 'number' && stat.valor > 999
                      ? stat.valor.toLocaleString('es')
                      : stat.valor}
                    <span className="text-[11px] font-semibold text-gray-400 ml-1">{stat.unidad}</span>
                  </p>
                  <p className={`text-[10px] font-semibold mt-1 ${stat.tendencia === 'bajada' && stat.variacion < 0 ? 'text-green-500' : stat.tendencia === 'subida' ? 'text-green-500' : 'text-gray-400'}`}>
                    {stat.variacion > 0 ? '+' : ''}{stat.variacion}{stat.unidad === '%' ? 'pp' : ''} tendencia
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent news */}
        {recentNews.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="section-title">Comunicados Recientes</h2>
              <Link href={`/${params.slug}/noticias`} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-secondary">
                Ver todos <ChevronRight size={11} />
              </Link>
            </div>
            <div className="space-y-2.5 px-4">
              {recentNews.map((n, i) => (
                <div key={n.id} className={`card p-3.5 fade-up stagger-${i + 1}`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary to-secondary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-semibold text-primary dark:text-blue-400 uppercase tracking-wide">{n.categoria}</span>
                      <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-snug mt-0.5 mb-1">{n.titulo}</p>
                      <p className="text-[10.5px] text-gray-500 dark:text-gray-400 line-clamp-2">{n.resumen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick nav */}
        <div className="px-4">
          <h2 className="section-title mb-3">Explorar</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: `/${params.slug}/promesas`, label: 'Promesas', icon: CheckCircle2, desc: `${oficial.promesasTotal} compromisos` },
              { href: `/${params.slug}/finanzas`, label: 'Finanzas Públicas', icon: TrendingUp, desc: 'Presupuesto y gastos' },
              { href: `/${params.slug}/cronologia`, label: 'Historial', icon: Clock, desc: 'Línea de tiempo' },
              { href: `/${params.slug}/analisis`, label: 'Análisis IA', icon: AlertCircle, desc: 'Reporte mensual' },
            ].map(({ href, label, icon: Icon, desc }) => (
              <Link key={href} href={href} className="card p-3.5 flex items-center gap-2.5 active:scale-[0.97] transition-transform">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-[9.5px] text-gray-400 dark:text-gray-600">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </DynamicPageShell>
  )
}
