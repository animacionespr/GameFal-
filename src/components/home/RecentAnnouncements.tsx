import Link from 'next/link'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { noticiasPR } from '@/lib/data/oficial-pr'
import { VerificationBadge } from '@/components/ui/VerificationBadge'
import { formatDateShort } from '@/lib/utils'

export function RecentAnnouncements() {
  const recientes = noticiasPR.slice(0, 3)

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="section-title">Anuncios Recientes</h2>
        <Link href="/noticias" className="text-xs text-primary dark:text-secondary font-medium flex items-center gap-0.5">
          Ver todos <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-2.5 px-4">
        {recientes.map(n => (
          <div key={n.id} className="card p-3.5">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight flex-1">{n.titulo}</h3>
              <VerificationBadge status={n.verificacion} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{n.resumen}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">{formatDateShort(n.fecha)}</span>
              <a href={n.urlFuente} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-primary dark:text-secondary flex items-center gap-0.5 font-medium">
                {n.agencia} <ExternalLink size={9} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
