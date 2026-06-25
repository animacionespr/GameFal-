import Link from 'next/link'
import { ChevronRight, CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react'
import { gobernadorPR } from '@/lib/data/oficial-pr'

export function ProjectsOverview() {
  const { promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR
  const pending = promesasTotal - promesasCompletadas - promesasEnProgreso - promesasRetrasadas

  const segments = [
    { val: promesasCompletadas, color: '#16A34A' },
    { val: promesasEnProgreso,  color: '#3b82f6' },
    { val: promesasRetrasadas,  color: '#F59E0B' },
    { val: pending,             color: '#d1d5db' },
  ]

  const items = [
    { label: 'Completadas', value: promesasCompletadas, icon: CheckCircle2, color: '#16A34A', bg: '#16A34A12' },
    { label: 'En Progreso', value: promesasEnProgreso,  icon: Clock,        color: '#3b82f6', bg: '#3b82f612' },
    { label: 'Retrasadas',  value: promesasRetrasadas,  icon: AlertCircle,  color: '#F59E0B', bg: '#F59E0B12' },
    { label: 'Sin datos',   value: pending,             icon: Circle,       color: '#9ca3af', bg: '#9ca3af12' },
  ]

  const pct = Math.round((promesasCompletadas / promesasTotal) * 100)

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Promesas de Campaña</h2>
        <Link href="/jenniffer-gonzalez-colon/promesas/"
          className="flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-blue-400">
          Ver todas <ChevronRight size={12} />
        </Link>
      </div>

      <div className="card-deep mx-4 p-4">
        {/* Segmented progress bar — taller, rounder */}
        <div className="h-4 rounded-full overflow-hidden flex gap-0.5 mb-4">
          {segments.map(({ val, color }, i) => (
            val > 0 && (
              <div key={i} className="h-full rounded-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
                style={{ width: `${(val / promesasTotal) * 100}%`, background: color }} />
            )
          ))}
        </div>

        {/* Percentage callout */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[32px] font-black text-gray-900 dark:text-white leading-none">{pct}</span>
            <span className="text-[16px] font-bold text-gray-400 ml-0.5">%</span>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">cumplido de {promesasTotal} compromisos</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-gray-400">Mandato activo</p>
            <p className="text-[11px] font-bold text-primary dark:text-blue-400">2025 – 2028</p>
          </div>
        </div>

        {/* 2x2 items */}
        <div className="grid grid-cols-2 gap-2">
          {items.filter(i => i.value > 0).map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: bg }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: color + '25' }}>
                <Icon size={14} style={{ color }} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[16px] font-black leading-none" style={{ color }}>{value}</p>
                <p className="text-[9.5px] font-semibold text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
