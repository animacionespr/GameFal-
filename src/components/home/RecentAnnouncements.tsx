'use client'

import Link from 'next/link'
import { ChevronRight, ExternalLink, Radio } from 'lucide-react'
import { noticiasPR } from '@/lib/data/oficial-pr'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { LastUpdated } from '@/components/ui/LastUpdated'
import { useLiveData } from '@/lib/hooks/useLiveData'
import { formatDateShort } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

const categoryConfig: Record<string, { bg: string; color: string; dot: string }> = {
  Economía:        { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  Educación:       { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
  Salud:           { bg: '#dcfce7', color: '#15803d', dot: '#16A34A' },
  Infraestructura: { bg: '#ffedd5', color: '#c2410c', dot: '#f97316' },
  Presupuesto:     { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  Oficial:         { bg: '#dbeafe', color: '#1e40af', dot: '#0050B3' },
}

const defaultCfg = { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' }

export function RecentAnnouncements() {
  const { data } = useLiveData()

  let display: NewsItem[] = [...noticiasPR]

  if (data?.noticias && data.noticias.length > 0) {
    const liveItems: NewsItem[] = data.noticias.map((n, i) => ({
      id: `live-${i}`,
      titulo: n.titulo,
      resumen: n.resumen || n.titulo,
      contenido: '',
      fuente: n.fuente || 'La Fortaleza',
      urlFuente: n.urlFuente,
      fecha: n.fecha,
      categoria: n.categoria || 'Oficial',
      agencia: n.agencia || 'La Fortaleza',
      verificacion: 'pendiente' as const,
      etiquetas: n.etiquetas || ['comunicado', 'oficial'],
    }))
    const livePrefix = new Set(liveItems.map(n => n.titulo.slice(0, 30).toLowerCase()))
    const staticFiltered = noticiasPR.filter(n => !livePrefix.has(n.titulo.slice(0, 30).toLowerCase()))
    display = [...liveItems, ...staticFiltered]
  }

  const recientes = display.slice(0, 3)

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="section-title">Comunicados</h2>
          <div className="flex items-center gap-1 bg-green-500/10 dark:bg-green-500/15 px-2 py-0.5 rounded-full">
            <Radio size={8} className="text-green-500" />
            <span className="text-[9px] font-bold text-green-600 dark:text-green-400">Oficial</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LastUpdated />
          <Link href="/jenniffer-gonzalez-colon/noticias/"
            className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-blue-400">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="space-y-2.5 px-4">
        {recientes.map((n, i) => {
          const cfg = categoryConfig[n.categoria] || defaultCfg
          return (
            <div key={n.id} className={`card-deep p-4 card-lift fade-up stagger-${i + 1}`}>
              <div className="flex items-start gap-3">
                {/* Category color indicator */}
                <div className="w-1.5 self-stretch rounded-full shrink-0 mt-0.5"
                  style={{ background: cfg.dot }} />

                <div className="flex-1 min-w-0">
                  {/* Category tag + verification */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {n.categoria}
                    </span>
                    <VerificationBadge status={n.verificacion} />
                  </div>

                  <h3 className="text-[13px] font-bold text-gray-900 dark:text-white leading-snug mb-1.5">
                    {n.titulo}
                  </h3>
                  <p className="text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2.5">
                    {n.resumen}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      {formatDateShort(n.fecha)}
                    </span>
                    <a href={n.urlFuente} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold"
                      style={{ color: cfg.color }}>
                      {n.agencia.split(' ')[0]}
                      <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
