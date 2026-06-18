'use client'

import { gobernadorPR } from '@/lib/data/oficial-pr'

export function PerformanceScore() {
  const { puntajeRendimiento: score, promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR

  const r = 48
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#00A3FF' : '#F59E0B'
  const label = score >= 70 ? 'Rendimiento Bueno' : score >= 50 ? 'Rendimiento Moderado' : 'Necesita Mejoras'

  return (
    <div className="card p-4">
      <div className="flex items-center gap-4">
        {/* Gauge */}
        <div className="relative w-28 h-28 shrink-0">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full opacity-20 blur-lg"
            style={{ background: color }} />
          <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r={r} fill="none"
              className="text-gray-100 dark:text-gray-700/60" stroke="currentColor" strokeWidth="9" />
            <circle cx="56" cy="56" r={r} fill="none"
              stroke={color} strokeWidth="9"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-[26px] font-black text-gray-900 dark:text-white leading-none">{score}</span>
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">pts</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="label-text mb-0.5">Rendimiento General</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight">{label}</p>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'Logradas', value: promesasCompletadas, bg: 'bg-green-500/10 dark:bg-green-500/15', text: 'text-green-600 dark:text-green-400' },
              { label: 'Activas', value: promesasEnProgreso, bg: 'bg-blue-500/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
              { label: 'Tardías', value: promesasRetrasadas, bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' },
            ].map(({ label: l, value, bg, text }) => (
              <div key={l} className={`${bg} rounded-xl p-2 text-center`}>
                <p className={`text-[17px] font-black ${text}`}>{value}</p>
                <p className="text-[8.5px] font-semibold text-gray-500 dark:text-gray-500 leading-tight">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[9.5px] text-gray-400 dark:text-gray-600 mt-3.5 text-center">
        Basado en {promesasTotal} compromisos públicos — Actualizado mayo 2025
      </p>
    </div>
  )
}
