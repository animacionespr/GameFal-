'use client'

import { gobernadorPR } from '@/lib/data/oficial-pr'

export function PerformanceScore() {
  const { puntajeRendimiento, promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR
  const score = puntajeRendimiento
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#00A3FF' : score >= 30 ? '#F59E0B' : '#DC2626'

  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor"
              className="text-gray-200 dark:text-gray-700" strokeWidth="10" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={color} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{score}</span>
            <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="label-text mb-1">Puntaje de Rendimiento</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {score >= 70 ? 'Rendimiento Bueno' : score >= 50 ? 'Rendimiento Moderado' : 'Necesita Mejoras'}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2">
              <p className="text-lg font-bold text-success">{promesasCompletadas}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Completadas</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2">
              <p className="text-lg font-bold text-secondary">{promesasEnProgreso}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">En Progreso</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-2">
              <p className="text-lg font-bold text-warning">{promesasRetrasadas}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Retrasadas</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-3 text-center">
        Basado en {promesasTotal} compromisos públicos verificados — Actualizado Mayo 2025
      </p>
    </div>
  )
}
