import Image from 'next/image'
import { PageShell } from '@/components/layout/PageShell'
import { gobernadorPR } from '@/lib/data/oficial-pr'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Globe, Mail, Calendar, ExternalLink, Award, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function PerfilPage() {
  const {
    nombre, cargo, partido, foto, fechaInicio, finMandato,
    biografia, sitioWeb, contacto, administracion,
    puntajeRendimiento, promesasTotal, promesasCompletadas,
    promesasEnProgreso, promesasRetrasadas,
  } = gobernadorPR

  const monthsInOffice = Math.round(
    (new Date().getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  const totalMonths = Math.round(
    (new Date(finMandato).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30)
  )

  return (
    <PageShell title="Perfil Oficial" subtitle={nombre}>
      <div className="space-y-4 pb-6">

        {/* Hero */}
        <div className="mx-4 mt-4 card overflow-hidden">
          {/* Banner */}
          <div className="h-28 gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 right-3">
              <span className="badge bg-white/20 text-white backdrop-blur-sm text-[10px]">
                {partido}
              </span>
            </div>
          </div>

          <div className="px-5 pb-5">
            {/* Avatar + name */}
            <div className="flex items-end gap-4 -mt-12 mb-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl shadow-black/30 shrink-0">
                <Image src={foto} alt={nombre} fill className="object-cover object-top" />
              </div>
              <div className="pb-1 flex-1 min-w-0">
                <h1 className="text-[17px] font-black text-gray-900 dark:text-white leading-tight truncate">{nombre}</h1>
                <p className="text-[12px] font-semibold text-gradient">{cargo}</p>
              </div>
            </div>

            <p className="text-[12.5px] text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{biografia}</p>

            {/* Term progress */}
            <div className="mb-5">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Progreso del mandato</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{monthsInOffice} / {totalMonths} meses</span>
              </div>
              <ProgressBar value={monthsInOffice} max={totalMonths} color="primary" height="sm" />
              <div className="flex justify-between text-[9.5px] text-gray-400 mt-1">
                <span>{formatDate(fechaInicio)}</span>
                <span>{formatDate(finMandato)}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2.5">
              <a href={sitioWeb} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-primary/30 dark:border-primary/40 text-primary dark:text-secondary text-[12px] font-bold">
                <Globe size={13} /> Sitio Web <ExternalLink size={10} />
              </a>
              <a href={`mailto:${contacto}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl gradient-primary text-white text-[12px] font-bold shadow-lg shadow-primary/30">
                <Mail size={13} /> Contacto
              </a>
            </div>
          </div>
        </div>

        {/* Score card */}
        <div className="mx-4 card-glow p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <h2 className="section-title">Puntaje de Rendimiento</h2>
          </div>

          <div className="flex items-center gap-5 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none"
                  className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none"
                  stroke={puntajeRendimiento >= 70 ? '#16A34A' : '#00A3FF'} strokeWidth="7"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - puntajeRendimiento / 100)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-black text-gray-900 dark:text-white">{puntajeRendimiento}</span>
                <span className="text-[8px] text-gray-400 font-bold">/ 100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Completadas', val: promesasCompletadas, pct: Math.round((promesasCompletadas/promesasTotal)*100), color: 'bg-green-500' },
                { label: 'En Progreso', val: promesasEnProgreso,  pct: Math.round((promesasEnProgreso/promesasTotal)*100),  color: 'bg-blue-500'  },
                { label: 'Retrasadas',  val: promesasRetrasadas,  pct: Math.round((promesasRetrasadas/promesasTotal)*100),  color: 'bg-amber-500' },
              ].map(({ label, val, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-[10.5px] mb-0.5">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{val} <span className="font-normal text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div className="mx-4 card p-4">
          <h2 className="section-title mb-3">Administración</h2>
          <div className="space-y-2.5">
            {[
              { icon: Award,    label: 'Administración', value: administracion },
              { icon: Calendar, label: 'Toma de posesión', value: formatDate(fechaInicio) },
              { icon: Calendar, label: 'Fin del mandato',  value: formatDate(finMandato) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/3 rounded-xl">
                <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-primary dark:text-secondary" />
                </div>
                <div>
                  <p className="label-text">{label}</p>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/20">
          <Award size={12} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
            El puntaje se calcula con base en compromisos públicos oficiales verificados y sus niveles de cumplimiento. Fuente: datos del Gobierno de Puerto Rico.
          </p>
        </div>

      </div>
    </PageShell>
  )
}
