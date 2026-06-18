'use client'

import Link from 'next/link'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { noticiasPR } from '@/lib/data/oficial-pr'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { LastUpdated } from '@/components/ui/LastUpdated'
import { useLiveData } from '@/lib/hooks/useLiveData'
import { formatDateShort } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

const categoryColors: Record<string, string> = {
  Economía:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Educación:       'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Salud:           'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Infraestructura: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  Presupuesto:     'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Oficial:         'bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300',
}

export function RecentAnnouncements() {
  const { data } = useLiveData()

  // Merge live items first, then static fallback (deduplicate by title prefix)
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
    const staticFiltered = noticiasPR.filter(
      n => !livePrefix.has(n.titulo.slice(0, 30).toLowerCase())
    )
    display = [...liveItems, ...staticFiltered]
  }

  const recientes = display.slice(0, 3)

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Comunicados Oficiales</h2>
        <div className="flex items-center gap-2">
          <LastUpdated />
          <Link href="/noticias" className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-secondary">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="space-y-2.5 px-4">
        {recientes.map((n, i) => (
          <div key={n.id} className={`card p-4 fade-up stagger-${i + 1}`}>
            <div className="flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary to-secondary shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className={`badge text-[9.5px] ${categoryColors[n.categoria] || 'bg-gray-100 text-gray-600'}`}>
                    {n.categoria}
                  </span>
                  <VerificationBadge status={n.verificacion} />
                </div>

                <h3 className="text-[13px] font-bold text-gray-900 dark:text-white leading-snug mb-1.5">
                  {n.titulo}
                </h3>
                <p className="text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                  {n.resumen}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">{formatDateShort(n.fecha)}</span>
                  <a href={n.urlFuente} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-primary dark:text-secondary font-semibold">
                    {n.agencia.split(' ')[0]} <ExternalLink size={9} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
