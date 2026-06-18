import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { gobernadorPR } from '@/lib/data/oficial-pr'

export function ProjectsOverview() {
  const { promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR

  const bars = [
    { label: 'Completadas', val: promesasCompletadas, color: 'bg-green-500',         textColor: 'text-green-600 dark:text-green-400' },
    { label: 'En Progreso', val: promesasEnProgreso,  color: 'bg-blue-500',          textColor: 'text-blue-600 dark:text-blue-400'   },
    { label: 'Retrasadas',  val: promesasRetrasadas,  color: 'bg-amber-500',         textColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'Sin datos',   val: promesasTotal - promesasCompletadas - promesasEnProgreso - promesasRetrasadas,
                                                       color: 'bg-gray-300 dark:bg-gray-600', textColor: 'text-gray-400' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Promesas de Campaña</h2>
        <Link href="/promesas" className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-secondary">
          Ver todas <ChevronRight size={12} />
        </Link>
      </div>

      <div className="card mx-4 p-4">
        {/* Stacked bar */}
        <div className="h-3 rounded-full overflow-hidden flex mb-4">
          {bars.map(({ val, color }) => (
            val > 0 && (
              <div key={color} className={`h-full ${color} transition-all duration-700`}
                style={{ width: `${(val / promesasTotal) * 100}%` }} />
            )
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {bars.filter(b => b.val > 0).map(({ label, val, color, textColor }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{label}</span>
                <span className={`text-[12px] font-bold ${textColor}`}>{val}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 dark:text-gray-600">{promesasTotal} compromisos rastreados</span>
          <span className="text-[11px] font-bold text-green-500">
            {Math.round((promesasCompletadas / promesasTotal) * 100)}% completado
          </span>
        </div>
      </div>
    </div>
  )
}
