import Image from 'next/image'
import { PageShell } from '@/components/layout/PageShell'
import { gobernadorPR } from '@/lib/data/oficial-pr'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Globe, Mail, Calendar, Award, Building2, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function PerfilPage() {
  const {
    nombre, cargo, partido, foto, fechaInicio, finMandato,
    biografia, sitioWeb, contacto, administracion,
    puntajeRendimiento, promesasTotal, promesasCompletadas,
    promesasEnProgreso, promesasRetrasadas,
  } = gobernadorPR

  const completionRate = Math.round((promesasCompletadas / promesasTotal) * 100)
  const monthsInOffice = Math.round(
    (new Date().getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  const totalMonths = Math.round(
    (new Date(finMandato).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30)
  )

  return (
    <PageShell title="Perfil Oficial" subtitle={nombre}>
      <div className="space-y-4 py-4">
        {/* Hero card */}
        <div className="mx-4 card overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-primary via-primary-600 to-secondary relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            />
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
                <Image src={foto} alt={nombre} fill className="object-cover object-top" />
              </div>
              <div className="pb-1">
                <div className="badge bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 mb-1">
                  {partido}
                </div>
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{nombre}</h1>
                <p className="text-sm text-primary dark:text-secondary font-semibold">{cargo}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{biografia}</p>

            {/* Term progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Duración del Mandato</span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">{monthsInOffice} / {totalMonths} meses</span>
              </div>
              <ProgressBar value={monthsInOffice} max={totalMonths} color="primary" height="sm" />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                <span>{formatDate(fechaInicio)}</span>
                <span>{formatDate(finMandato)}</span>
              </div>
            </div>

            {/* Contact links */}
            <div className="flex gap-2">
              <a href={sitioWeb} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-primary text-primary dark:text-secondary dark:border-secondary text-xs font-semibold">
                <Globe size={12} /> Sitio Web <ExternalLink size={10} />
              </a>
              <a href={`mailto:${contacto}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
                <Mail size={12} /> Contactar
              </a>
            </div>
          </div>
        </div>

        {/* Administration info */}
        <div className="mx-4 card p-4 space-y-3">
          <h2 className="section-title">Información de la Administración</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Building2 size={16} className="text-primary dark:text-secondary shrink-0" />
              <div>
                <p className="label-text">Administración</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{administracion}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Calendar size={16} className="text-primary dark:text-secondary shrink-0" />
              <div>
                <p className="label-text">Inicio del Mandato</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(fechaInicio)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Calendar size={16} className="text-primary dark:text-secondary shrink-0" />
              <div>
                <p className="label-text">Fin del Mandato</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(finMandato)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="mx-4 card p-4">
          <h2 className="section-title mb-4">Resumen de Desempeño</h2>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700" strokeWidth="8" />
                <circle cx="48" cy="48" r="42" fill="none"
                  stroke={puntajeRendimiento >= 70 ? '#16A34A' : '#00A3FF'} strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - puntajeRendimiento / 100)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900 dark:text-white">{puntajeRendimiento}</span>
                <span className="text-[9px] text-gray-500">Puntos</span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Completadas', val: promesasCompletadas, total: promesasTotal, color: 'success' as const },
              { label: 'En Progreso', val: promesasEnProgreso, total: promesasTotal, color: 'secondary' as const },
              { label: 'Retrasadas', val: promesasRetrasadas, total: promesasTotal, color: 'warning' as const },
            ].map(({ label, val, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{val} <span className="font-normal text-gray-400">/ {total}</span></span>
                </div>
                <ProgressBar value={val} max={total} color={color} height="sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/40">
          <div className="flex items-center gap-2 mb-1">
            <Award size={12} className="text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Nota de Transparencia</p>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-500 leading-relaxed">
            El puntaje de rendimiento se calcula con base en el cumplimiento de compromisos públicos verificados,
            velocidad de implementación y calidad de evidencia. Fuente: datos oficiales del Gobierno de PR.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
