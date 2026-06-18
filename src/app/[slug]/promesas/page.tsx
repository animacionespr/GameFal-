'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { cn, getPromiseStatusLabel, getPromiseStatusColor, formatDate } from '@/lib/utils'
import type { PromiseStatus, Promise as OfficialPromise } from '@/lib/types'

export async function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

const FILTROS: { label: string; value: PromiseStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'En Progreso', value: 'en_progreso' },
  { label: 'Completadas', value: 'completada' },
  { label: 'Retrasadas', value: 'retrasada' },
  { label: 'Canceladas', value: 'cancelada' },
]

function PromiseCard({ promise }: { promise: OfficialPromise }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight flex-1">{promise.titulo}</h3>
        <span className={cn('badge shrink-0', getPromiseStatusColor(promise.estado))}>
          {getPromiseStatusLabel(promise.estado)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="info">{promise.categoria}</Badge>
        <VerificationBadge status={promise.nivelVerificacion} />
      </div>

      <div className="mb-3">
        <ProgressBar value={promise.progreso} showLabel height="md" />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
        {promise.descripcion}
      </p>

      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-1 text-xs text-primary dark:text-secondary font-medium"
      >
        {expanded ? <><ChevronUp size={12} /> Menos detalles</> : <><ChevronDown size={12} /> Ver evidencia</>}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Evidencia Oficial:</p>
          {promise.evidencia.map((e, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-success mt-0.5 shrink-0">✓</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">{e}</p>
            </div>
          ))}
          {promise.impacto && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2">
              <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 mb-0.5">Impacto Medible</p>
              <p className="text-xs text-blue-600 dark:text-blue-300">{promise.impacto}</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">Anunciado: {formatDate(promise.fechaAnuncio)}</span>
            <a href={promise.urlFuente} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-primary dark:text-secondary flex items-center gap-0.5 font-medium">
              Fuente <ExternalLink size={8} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props { params: { slug: string } }

export default function PromesasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()

  const { promesas, oficial } = bundle

  const [filtro, setFiltro] = useState<PromiseStatus | 'todas'>('todas')

  const filtradas = filtro === 'todas'
    ? promesas
    : promesas.filter(p => p.estado === filtro)

  return (
    <DynamicPageShell slug={params.slug} title="Rastreador de Promesas" subtitle="Compromisos públicos verificados">
      <div className="py-4">
        {/* Summary pills */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total', val: promesas.length, cls: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
              { label: 'Completadas', val: promesas.filter(p => p.estado === 'completada').length, cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
              { label: 'En Progreso', val: promesas.filter(p => p.estado === 'en_progreso').length, cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
            ].map(({ label, val, cls }) => (
              <div key={label} className={cn('rounded-xl p-3 text-center', cls)}>
                <p className="text-xl font-black">{val}</p>
                <p className="text-[10px] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-4 mb-4 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {FILTROS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFiltro(value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                  filtro === value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 px-4">
          {filtradas.map(p => <PromiseCard key={p.id} promise={p} />)}
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 px-4">
          Datos oficiales verificados — {oficial.nombre}
        </p>
      </div>
    </DynamicPageShell>
  )
}
