'use client'

import { useState } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { eventosPR } from '@/lib/data/oficial-pr'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ExternalLink, FileText, Gavel, DollarSign, Building2, AlertTriangle, Megaphone, UserCheck, CheckCircle2 } from 'lucide-react'
import { formatDate, getEventCategoryLabel, cn } from '@/lib/utils'

// ── Icon map ──────────────────────────────────────────────────────────────────
const categoryIcons: Record<string, React.ElementType> = {
  orden_ejecutiva: FileText,
  proyecto_iniciado: Building2,
  proyecto_completado: CheckCircle2,
  presupuesto: DollarSign,
  infraestructura: Building2,
  ley_firmada: Gavel,
  emergencia: AlertTriangle,
  evento_publico: Megaphone,
  anuncio: Megaphone,
  nombramiento: UserCheck,
}

// ── Gradient definitions ──────────────────────────────────────────────────────
const categoryGradients: Record<string, { bg: string; color: string; border: string }> = {
  orden_ejecutiva:     { bg: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: '#7c3aed' },
  proyecto_iniciado:   { bg: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)', color: '#fff', border: '#1d4ed8' },
  proyecto_completado: { bg: 'linear-gradient(135deg,#065f46,#059669)', color: '#fff', border: '#065f46' },
  presupuesto:         { bg: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: '#92400e' },
  infraestructura:     { bg: 'linear-gradient(135deg,#9a3412,#f97316)', color: '#fff', border: '#9a3412' },
  ley_firmada:         { bg: 'linear-gradient(135deg,#1e1b4b,#4338ca)', color: '#fff', border: '#1e1b4b' },
  emergencia:          { bg: 'linear-gradient(135deg,#7f1d1d,#ef4444)', color: '#fff', border: '#7f1d1d' },
  evento_publico:      { bg: 'linear-gradient(135deg,#0e7490,#06b6d4)', color: '#fff', border: '#0e7490' },
  anuncio:             { bg: 'linear-gradient(135deg,#065f46,#10b981)', color: '#fff', border: '#065f46' },
  nombramiento:        { bg: 'linear-gradient(135deg,#374151,#6b7280)', color: '#fff', border: '#374151' },
}

// ── Badge colors (category tags) ──────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  orden_ejecutiva:     'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  proyecto_iniciado:   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  proyecto_completado: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  presupuesto:         'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  infraestructura:     'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  ley_firmada:         'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  emergencia:          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  evento_publico:      'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  anuncio:             'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  nombramiento:        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

// ── Filter definitions ────────────────────────────────────────────────────────
type FilterKey = 'todos' | 'leyes' | 'proyectos' | 'ordenes' | 'anuncios' | 'presupuesto'

const filters: { key: FilterKey; label: string; categories: string[]; activeClass: string }[] = [
  { key: 'todos',       label: 'Todos',       categories: [],                                           activeClass: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' },
  { key: 'leyes',       label: 'Leyes',       categories: ['ley_firmada'],                              activeClass: 'bg-indigo-600 text-white' },
  { key: 'proyectos',   label: 'Proyectos',   categories: ['proyecto_iniciado', 'proyecto_completado'], activeClass: 'bg-blue-600 text-white' },
  { key: 'ordenes',     label: 'Ordenes',     categories: ['orden_ejecutiva'],                          activeClass: 'bg-purple-600 text-white' },
  { key: 'anuncios',    label: 'Anuncios',    categories: ['anuncio', 'evento_publico'],                activeClass: 'bg-teal-600 text-white' },
  { key: 'presupuesto', label: 'Presupuesto', categories: ['presupuesto'],                              activeClass: 'bg-yellow-500 text-white' },
]

// ── Impact pill ───────────────────────────────────────────────────────────────
function ImpactPill({ score }: { score: number }) {
  if (score >= 8) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
        Alto impacto
      </span>
    )
  }
  if (score >= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
        Impacto medio
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
      Bajo impacto
    </span>
  )
}

export default function CronologiaPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos')

  const sorted = [...eventosPR].sort((a, b) => b.fecha.localeCompare(a.fecha))

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalEventos = sorted.length
  const completados = sorted.filter(e => e.categoria === 'proyecto_completado').length
  const leyes = sorted.filter(e => e.categoria === 'ley_firmada').length

  // ── Filtered events ───────────────────────────────────────────────────────
  const activeCategories = filters.find(f => f.key === activeFilter)?.categories ?? []
  const filtered = activeFilter === 'todos'
    ? sorted
    : sorted.filter(e => activeCategories.includes(e.categoria))

  // ── Group by year ─────────────────────────────────────────────────────────
  const years = Array.from(new Set(filtered.map(e => e.fecha.slice(0, 4)))).sort((a, b) => b.localeCompare(a))

  return (
    <PageShell title="Cronologia" subtitle="Historial de acciones de gobierno">
      <div className="py-4">

        {/* ── Stat summary ───────────────────────────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="shrink-0 flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm">
              <span className="text-xl font-black leading-none">{totalEventos}</span>
              <span className="text-[9px] font-medium mt-0.5 opacity-70">eventos</span>
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-green-600 text-white shadow-sm">
              <span className="text-xl font-black leading-none">{completados}</span>
              <span className="text-[9px] font-medium mt-0.5 opacity-80">completados</span>
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-indigo-600 text-white shadow-sm">
              <span className="text-xl font-black leading-none">{leyes}</span>
              <span className="text-[9px] font-medium mt-0.5 opacity-80">leyes</span>
            </div>
          </div>
        </div>

        {/* ── Filter chips ────────────────────────────────────────────────── */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all',
                  activeFilter === f.key
                    ? f.activeClass
                    : 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        <div className="px-4">
          <div className="relative">
            {/* Vertical line — centered under w-11 (44px) icon = left 21px */}
            <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700/70" />

            <div className="space-y-0">
              {years.map(year => {
                const yearEvents = filtered.filter(e => e.fecha.startsWith(year))
                return (
                  <div key={year}>
                    {/* Year divider */}
                    <div className="relative flex items-center justify-center py-4">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mr-2" />
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                        {year} &bull; {yearEvents.length} evento{yearEvents.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-2" />
                    </div>

                    {/* Events */}
                    <div className="space-y-4 pb-2">
                      {yearEvents.map(event => {
                        const Icon = categoryIcons[event.categoria] || Megaphone
                        const isExpanded = expanded === event.id
                        const grad = categoryGradients[event.categoria] || categoryGradients.anuncio
                        const colorClass = categoryColors[event.categoria] || categoryColors.anuncio

                        return (
                          <div key={event.id} className="relative flex gap-3.5">
                            {/* Icon node */}
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md"
                              style={{ background: grad.bg, color: grad.color }}
                            >
                              <Icon size={17} />
                            </div>

                            {/* Card */}
                            <div
                              className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3.5 -mt-0.5"
                              style={{ borderLeft: `3px solid ${grad.border}` }}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="min-w-0">
                                  <span className={cn('inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mb-1', colorClass)}>
                                    {getEventCategoryLabel(event.categoria)}
                                  </span>
                                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                                    {event.titulo}
                                  </h3>
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 mt-0.5">
                                  {formatDate(event.fecha).split(' de ').slice(0, 2).join(' de ')}
                                </span>
                              </div>

                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2.5 leading-relaxed">
                                {event.resumen}
                              </p>

                              <div className="flex items-center justify-between">
                                <VerificationBadge status={event.verificacion} />
                                <button
                                  onClick={() => setExpanded(isExpanded ? null : event.id)}
                                  className="text-[10px] font-semibold text-primary dark:text-secondary"
                                >
                                  {isExpanded ? 'Cerrar' : 'Ver fuente'}
                                </button>
                              </div>

                              {/* Expanded section */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
                                  <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Evidencia</p>
                                    <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">{event.evidencia}</p>
                                  </div>

                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-gray-400 dark:text-gray-500">Impacto:</span>
                                      <ImpactPill score={event.puntuacionImpacto} />
                                    </div>
                                    <a
                                      href={event.urlFuente}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[10px] text-primary dark:text-secondary font-semibold shrink-0"
                                    >
                                      {event.fuente.split('—')[0].trim()}
                                      <ExternalLink size={9} />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6 px-4">
          Solo se muestran eventos con fuentes oficiales verificadas
        </p>
      </div>
    </PageShell>
  )
}
