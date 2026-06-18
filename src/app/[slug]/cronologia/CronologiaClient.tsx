'use client'

import { useState } from 'react'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ExternalLink, FileText, Gavel, DollarSign, Building2, AlertTriangle, Megaphone, UserCheck, CheckCircle2 } from 'lucide-react'
import { formatDate, getEventCategoryLabel, cn } from '@/lib/utils'
import type { OfficialBundle } from '@/lib/types'

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

const categoryColors: Record<string, string> = {
  orden_ejecutiva: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  proyecto_iniciado: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  proyecto_completado: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  presupuesto: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  infraestructura: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  ley_firmada: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  emergencia: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  evento_publico: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  anuncio: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  nombramiento: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

export function CronologiaClient({ bundle }: { bundle: OfficialBundle }) {
  const { eventos } = bundle

  const [expanded, setExpanded] = useState<string | null>(null)

  const sorted = [...eventos].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="py-4 px-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {sorted.map(event => {
            const Icon = categoryIcons[event.categoria] || Megaphone
            const isExpanded = expanded === event.id
            const colorClass = categoryColors[event.categoria] || categoryColors.anuncio

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon circle */}
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm', colorClass)}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 card p-3.5 -mt-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className={cn('badge text-[10px] mb-1', colorClass)}>
                        {getEventCategoryLabel(event.categoria)}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        {event.titulo}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 whitespace-nowrap">
                        {formatDate(event.fecha).split(' de ').slice(0, 2).join(' de ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                    {event.resumen}
                  </p>

                  <div className="flex items-center justify-between">
                    <VerificationBadge status={event.verificacion} />
                    <button
                      onClick={() => setExpanded(isExpanded ? null : event.id)}
                      className="text-[10px] text-primary dark:text-secondary font-medium"
                    >
                      {isExpanded ? 'Menos' : 'Ver fuente'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Evidencia</p>
                        <p className="text-[11px] text-gray-700 dark:text-gray-300">{event.evidencia}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400">Impacto</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className={cn(
                                'w-2 h-2 rounded-sm',
                                i < event.puntuacionImpacto ? 'bg-primary dark:bg-secondary' : 'bg-gray-200 dark:bg-gray-700'
                              )} />
                            ))}
                          </div>
                        </div>
                        <a href={event.urlFuente} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-primary dark:text-secondary font-medium">
                          {event.fuente.split('—')[0].trim()} <ExternalLink size={9} />
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

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6">
        Solo se muestran eventos con fuentes oficiales verificadas
      </p>
    </div>
  )
}
