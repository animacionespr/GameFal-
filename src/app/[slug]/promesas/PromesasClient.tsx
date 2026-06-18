'use client'

import { useState } from 'react'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { cn, getPromiseStatusLabel, formatDate } from '@/lib/utils'
import type { PromiseStatus, Promise as OfficialPromise, OfficialBundle } from '@/lib/types'

const FILTROS: { label: string; value: PromiseStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'En Progreso', value: 'en_progreso' },
  { label: 'Completadas', value: 'completada' },
  { label: 'Retrasadas', value: 'retrasada' },
  { label: 'Canceladas', value: 'cancelada' },
]

const FILTER_ACTIVE_BG: Record<string, string> = {
  todas: '',
  en_progreso: 'bg-blue-600',
  completada: 'bg-green-600',
  retrasada: 'bg-amber-600',
  cancelada: 'bg-red-500',
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Economía':        { bg: '#dbeafe', text: '#1d4ed8' },
  'Energía':         { bg: '#d1fae5', text: '#065f46' },
  'Educación':       { bg: '#ede9fe', text: '#5b21b6' },
  'Seguridad':       { bg: '#fee2e2', text: '#991b1b' },
  'Salud':           { bg: '#d1fae5', text: '#065f46' },
  'Infraestructura': { bg: '#ffedd5', text: '#9a3412' },
  'Política':        { bg: '#fef9c3', text: '#713f12' },
}

const STATUS_BORDER: Record<string, string> = {
  completada: '#059669',
  en_progreso: '#3b82f6',
  retrasada: '#d97706',
  cancelada: '#ef4444',
}

const STATUS_EMOJI: Record<string, string> = {
  completada: '✅',
  en_progreso: '🔵',
  retrasada: '⚠️',
  cancelada: '❌',
}

const STATUS_EXPAND_BG: Record<string, string> = {
  completada: 'bg-green-50 dark:bg-green-900/20',
  en_progreso: 'bg-blue-50 dark:bg-blue-900/20',
  retrasada: 'bg-amber-50 dark:bg-amber-900/20',
  cancelada: 'bg-red-50 dark:bg-red-900/20',
}

function PromiseCard({ promise }: { promise: OfficialPromise }) {
  const [expanded, setExpanded] = useState(false)

  const borderColor = STATUS_BORDER[promise.estado] ?? '#6b7280'
  const expandBg = STATUS_EXPAND_BG[promise.estado] ?? 'bg-gray-50 dark:bg-gray-800/40'
  const catColor = CAT_COLORS[promise.categoria]
  const statusEmoji = STATUS_EMOJI[promise.estado] ?? ''

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="p-4">
        {/* Category chip above title */}
        {catColor ? (
          <span
            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
            style={{ backgroundColor: catColor.bg, color: catColor.text }}
          >
            {promise.categoria}
          </span>
        ) : (
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {promise.categoria}
          </span>
        )}

        {/* Title + Status badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight flex-1">
            {promise.titulo}
          </h3>
          <span
            className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ backgroundColor: `${borderColor}18`, color: borderColor }}
          >
            {statusEmoji} {getPromiseStatusLabel(promise.estado)}
          </span>
        </div>

        {/* Verification badge */}
        <div className="mb-3">
          <VerificationBadge status={promise.nivelVerificacion} />
        </div>

        {/* Progress bar with prominent percentage */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Progreso</span>
            <span className="text-sm font-bold" style={{ color: borderColor }}>
              {promise.progreso}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${promise.progreso}%`, backgroundColor: borderColor }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
          {promise.descripcion}
        </p>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs font-semibold transition-colors"
          style={{ color: borderColor }}
        >
          {expanded ? (
            <><ChevronUp size={13} /> Menos detalles</>
          ) : (
            <><ChevronDown size={13} /> Ver evidencia</>
          )}
        </button>
      </div>

      {/* Expanded evidence section */}
      {expanded && (
        <div className={cn('px-4 pb-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2', expandBg)}>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Evidencia Oficial:</p>
          {promise.evidencia.map((e, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0" style={{ color: borderColor }}>✓</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">{e}</p>
            </div>
          ))}
          {promise.impacto && (
            <div className="p-2.5 rounded-xl mt-2" style={{ backgroundColor: `${borderColor}14` }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: borderColor }}>
                Impacto Medible
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{promise.impacto}</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">Anunciado: {formatDate(promise.fechaAnuncio)}</span>
            <a
              href={promise.urlFuente}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] flex items-center gap-0.5 font-semibold"
              style={{ color: borderColor }}
            >
              Fuente <ExternalLink size={8} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export function PromesasClient({ bundle }: { bundle: OfficialBundle }) {
  const { promesas, oficial } = bundle

  const [filtro, setFiltro] = useState<PromiseStatus | 'todas'>('todas')

  const filtradas = filtro === 'todas'
    ? promesas
    : promesas.filter(p => p.estado === filtro)

  const statCards = [
    {
      label: 'Total',
      val: promesas.length,
      gradient: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    },
    {
      label: 'Completadas',
      val: promesas.filter(p => p.estado === 'completada').length,
      gradient: 'linear-gradient(135deg, #065f46, #059669)',
    },
    {
      label: 'En Progreso',
      val: promesas.filter(p => p.estado === 'en_progreso').length,
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    },
    {
      label: 'Retrasadas',
      val: promesas.filter(p => p.estado === 'retrasada').length,
      gradient: 'linear-gradient(135deg, #92400e, #d97706)',
    },
  ]

  return (
    <div className="py-4">
      {/* Summary stat cards — horizontal scroll */}
      <div className="px-4 mb-5 overflow-x-auto">
        <div className="flex gap-3 w-max pb-1">
          {statCards.map(({ label, val, gradient }) => (
            <div
              key={label}
              className="shrink-0 rounded-2xl p-3.5 text-white flex flex-col justify-between"
              style={{ width: 120, background: gradient }}
            >
              <p className="text-[28px] font-black leading-none">{val}</p>
              <p className="text-[10px] font-medium mt-1 opacity-90">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {FILTROS.map(({ label, value }) => {
            const isActive = filtro === value
            const activeBg = FILTER_ACTIVE_BG[value]
            return (
              <button
                key={value}
                onClick={() => setFiltro(value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                  isActive
                    ? cn('text-white shadow-sm', activeBg || 'bg-primary')
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Promise list */}
      <div className="space-y-3 px-4">
        {filtradas.map(p => <PromiseCard key={p.id} promise={p} />)}
      </div>

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6 px-4">
        Datos oficiales verificados — {oficial.nombre}
      </p>
    </div>
  )
}
