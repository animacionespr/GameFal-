'use client'

import { useState } from 'react'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ExternalLink, Radio } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { NewsItem, OfficialBundle } from '@/lib/types'

const CAT_CONFIG: Record<string, { bg: string; color: string; border: string }> = {
  'Economía':        { bg: '#dbeafe', color: '#1d4ed8', border: '#3b82f6' },
  'Educación':       { bg: '#ede9fe', color: '#5b21b6', border: '#7c3aed' },
  'Salud':           { bg: '#d1fae5', color: '#065f46', border: '#059669' },
  'Infraestructura': { bg: '#ffedd5', color: '#9a3412', border: '#f97316' },
  'Presupuesto':     { bg: '#fef9c3', color: '#713f12', border: '#eab308' },
  'Energía':         { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
  'Política':        { bg: '#fce7f3', color: '#9d174d', border: '#ec4899' },
  'Seguridad':       { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
}

const DEFAULT_CAT = { bg: '#f1f5f9', color: '#475569', border: '#94a3b8' }

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem.`
  return formatDate(dateStr).split(' de ').slice(0, 2).join(' de ')
}

function NewsCard({ item }: { item: NewsItem }) {
  const cat = CAT_CONFIG[item.categoria] ?? DEFAULT_CAT

  return (
    <div
      className="bg-white dark:bg-gray-800/60 rounded-2xl overflow-hidden shadow-sm"
      style={{ borderLeft: `4px solid ${cat.border}` }}
    >
      <div className="p-4">
        {/* Top row: category chip + date */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.color }}
          >
            {item.categoria}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
            {getRelativeDate(item.fecha)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[13.5px] font-black text-gray-900 dark:text-white leading-snug mb-2">
          {item.titulo}
        </h3>

        {/* Summary */}
        <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {item.resumen}
        </p>

        {/* Tags */}
        {item.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.etiquetas.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: `${cat.border}18`, color: cat.border }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio size={9} className="text-gray-400 shrink-0" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[140px]">
              {item.agencia}
            </span>
            <VerificationBadge status={item.verificacion} />
          </div>
          <a
            href={item.urlFuente}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold shrink-0"
            style={{ color: cat.border }}
          >
            Leer <ExternalLink size={9} />
          </a>
        </div>
      </div>
    </div>
  )
}

const CAT_ACTIVE_COLORS: Record<string, string> = {
  'Economía': '#1d4ed8', 'Educación': '#5b21b6', 'Salud': '#065f46',
  'Infraestructura': '#9a3412', 'Presupuesto': '#713f12', 'Energía': '#065f46',
  'Política': '#9d174d', 'Seguridad': '#991b1b',
}

export function NoticiasClient({ bundle }: { bundle: OfficialBundle }) {
  const { noticias, oficial } = bundle
  const categorias = ['Todas', ...Array.from(new Set(noticias.map(n => n.categoria)))]
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const sorted = [...noticias]
    .filter(n => categoriaActiva === 'Todas' || n.categoria === categoriaActiva)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="py-4">
      {/* Stats header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          <span className="text-[18px] font-black text-gray-900 dark:text-white mr-1">{sorted.length}</span>
          {sorted.length === 1 ? 'noticia verificada' : 'noticias verificadas'}
        </p>
        <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Fuentes oficiales
        </span>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max pb-0.5">
          {categorias.map(cat => {
            const active = categoriaActiva === cat
            const color = cat === 'Todas' ? '#1d4ed8' : (CAT_ACTIVE_COLORS[cat] ?? '#475569')
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200',
                  active ? 'text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400'
                )}
                style={active ? { backgroundColor: color } : {}}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* News list */}
      <div className="space-y-3 px-4">
        {sorted.map(item => <NewsCard key={item.id} item={item} />)}
        {sorted.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-600">
            <p className="text-[13px]">Sin noticias en esta categoría</p>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-5 px-4">
        Cobertura verificada · {oficial.nombre}
      </p>
    </div>
  )
}
