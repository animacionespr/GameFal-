'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { ExternalLink, Newspaper } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { NewsItem } from '@/lib/types'

export async function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] shrink-0">
          {item.categoria}
        </span>
        <span className="text-[10px] text-gray-400 whitespace-nowrap">
          {formatDate(item.fecha).split(' de ').slice(0, 2).join(' de ')}
        </span>
      </div>

      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2">
        {item.titulo}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">
        {item.resumen}
      </p>

      {item.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.etiquetas.map((tag, i) => (
            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <Newspaper size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.agencia}</span>
          <VerificationBadge status={item.verificacion} />
        </div>
        <a href={item.urlFuente} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-[10px] text-primary dark:text-secondary font-medium">
          Leer <ExternalLink size={9} />
        </a>
      </div>
    </div>
  )
}

interface Props { params: { slug: string } }

export default function NoticiasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()

  const { noticias, oficial } = bundle

  const categorias = ['Todas', ...Array.from(new Set(noticias.map(n => n.categoria)))]
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const filtradas = categoriaActiva === 'Todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaActiva)

  const sorted = [...filtradas].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <DynamicPageShell slug={params.slug} title="Noticias Oficiales" subtitle="Cobertura de medios verificados">
      <div className="py-4">
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

        {/* Summary */}
        <div className="px-4 mb-4">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {sorted.length} {sorted.length === 1 ? 'noticia' : 'noticias'} encontradas
          </p>
        </div>

        {/* List */}
        <div className="space-y-3 px-4">
          {sorted.map(item => <NewsCard key={item.id} item={item} />)}
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 px-4">
          Noticias verificadas — {oficial.nombre}
        </p>
      </div>
    </DynamicPageShell>
  )
}
