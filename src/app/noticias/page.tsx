'use client'

import { useState } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { noticiasPR } from '@/lib/data/oficial-pr'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, Tag } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

const categorias = ['Todas', ...Array.from(new Set(noticiasPR.map(n => n.categoria)))]

export default function NoticiasPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtradas = categoriaActiva === 'Todas'
    ? noticiasPR
    : noticiasPR.filter(n => n.categoria === categoriaActiva)

  return (
    <PageShell title="Comunicados Oficiales" subtitle="Solo fuentes gubernamentales verificadas">
      <div className="py-4">
        {/* Disclaimer banner */}
        <div className="mx-4 mb-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-[10px] text-primary dark:text-blue-300 text-center font-medium">
            Esta sección muestra únicamente comunicados y anuncios de fuentes oficiales del Gobierno de Puerto Rico.
            No se incluyen opiniones, rumores ni información no verificada.
          </p>
        </div>

        {/* Category filter */}
        <div className="px-4 mb-4 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                  categoriaActiva === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-4">
          {filtradas.map(noticia => {
            const isExpanded = expanded === noticia.id
            return (
              <div key={noticia.id} className="card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge variant="info">{noticia.categoria}</Badge>
                      <VerificationBadge status={noticia.verificacion} />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0">
                      {formatDate(noticia.fecha).split(' de ').slice(0, 2).join(' de ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {noticia.titulo}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    {isExpanded ? noticia.contenido : noticia.resumen}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {noticia.etiquetas.map(tag => (
                      <span key={tag} className="flex items-center gap-0.5 text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                        <Tag size={7} /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{noticia.agencia}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setExpanded(isExpanded ? null : noticia.id)}
                        className="text-[10px] text-primary dark:text-secondary font-medium">
                        {isExpanded ? 'Menos' : 'Leer más'}
                      </button>
                      <a href={noticia.urlFuente} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-[10px] text-primary dark:text-secondary font-medium">
                        Fuente <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Color accent bar */}
                <div className="h-0.5 bg-gradient-to-r from-primary to-secondary" />
              </div>
            )
          })}
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 px-4">
          {filtradas.length} comunicados oficiales — Solo fuentes gubernamentales verificadas
        </p>
      </div>
    </PageShell>
  )
}
