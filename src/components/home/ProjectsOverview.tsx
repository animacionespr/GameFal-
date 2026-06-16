import Link from 'next/link'
import { ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { gobernadorPR } from '@/lib/data/oficial-pr'

export function ProjectsOverview() {
  const { promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="section-title">Proyectos y Promesas</h2>
        <Link href="/promesas" className="text-xs text-primary dark:text-secondary font-medium flex items-center gap-0.5">
          Ver todos <ChevronRight size={12} />
        </Link>
      </div>
      <div className="card mx-4 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Completadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 rounded-full bg-green-200 dark:bg-green-900/40 overflow-hidden" style={{ width: 80 }}>
                <div className="h-full bg-success rounded-full"
                  style={{ width: `${(promesasCompletadas / promesasTotal) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-success w-6 text-right">{promesasCompletadas}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-secondary" />
              <span className="text-sm text-gray-700 dark:text-gray-300">En Progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 rounded-full bg-blue-200 dark:bg-blue-900/40 overflow-hidden" style={{ width: 80 }}>
                <div className="h-full bg-secondary rounded-full"
                  style={{ width: `${(promesasEnProgreso / promesasTotal) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-secondary w-6 text-right">{promesasEnProgreso}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Retrasadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 rounded-full bg-amber-200 dark:bg-amber-900/40 overflow-hidden" style={{ width: 80 }}>
                <div className="h-full bg-warning rounded-full"
                  style={{ width: `${(promesasRetrasadas / promesasTotal) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-warning w-6 text-right">{promesasRetrasadas}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex">
            <div className="h-full bg-success" style={{ width: `${(promesasCompletadas / promesasTotal) * 100}%` }} />
            <div className="h-full bg-secondary" style={{ width: `${(promesasEnProgreso / promesasTotal) * 100}%` }} />
            <div className="h-full bg-warning" style={{ width: `${(promesasRetrasadas / promesasTotal) * 100}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5 text-center">
            {promesasTotal} compromisos totales rastreados
          </p>
        </div>
      </div>
    </div>
  )
}
