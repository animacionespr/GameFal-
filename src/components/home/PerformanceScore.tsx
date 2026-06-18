'use client'

import { gobernadorPR } from '@/lib/data/oficial-pr'

export function PerformanceScore() {
  const { puntajeRendimiento: score, promesasCompletadas, promesasEnProgreso, promesasRetrasadas, promesasTotal } = gobernadorPR

  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D'
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#00A3FF' : '#F59E0B'
  const colorDark = score >= 70 ? '#15803d' : score >= 50 ? '#0080CC' : '#d97706'
  const label = score >= 70 ? 'Rendimiento Sólido' : score >= 50 ? 'Rendimiento Moderado' : 'Necesita Mejoras'

  // Half-circle arc
  const r = 52
  const cx = 80, cy = 80
  const startAngle = 200
  const endAngle = 340
  const totalAngle = endAngle - startAngle
  const fillAngle = (score / 100) * totalAngle

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const s = polarToCartesian(cx, cy, r, startDeg)
    const e = polarToCartesian(cx, cy, r, endDeg)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  const bgPath = arcPath(cx, cy, r, startAngle, endAngle)
  const fillPath = arcPath(cx, cy, r, startAngle, startAngle + fillAngle)

  return (
    <div className="card-deep overflow-hidden">
      {/* Top gradient accent */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${colorDark})` }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Arc gauge */}
          <div className="relative shrink-0" style={{ width: 100, height: 72 }}>
            <svg width="160" height="144" viewBox="0 0 160 144" style={{ width: 100, height: 72, overflow: 'visible' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Track */}
              <path d={bgPath} fill="none" stroke="currentColor" strokeWidth="11"
                className="text-gray-100 dark:text-gray-700/60" strokeLinecap="round" />
              {/* Fill */}
              <path d={fillPath} fill="none" stroke={color} strokeWidth="11"
                strokeLinecap="round" filter="url(#glow)"
                style={{ transition: 'all 1.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
            </svg>
            {/* Score centered */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ bottom: -4 }}>
              <span className="text-[28px] font-black leading-none text-gray-900 dark:text-white">{score}</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Rendimiento</span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg" style={{ color, background: color + '18' }}>
                {grade}
              </span>
            </div>
            <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight">{label}</p>

            {/* Stats row */}
            <div className="flex gap-2">
              {[
                { label: 'Logradas', value: promesasCompletadas, color: '#16A34A', bg: '#16A34A18' },
                { label: 'Activas',  value: promesasEnProgreso,  color: '#00A3FF', bg: '#00A3FF18' },
                { label: 'Tardías',  value: promesasRetrasadas,  color: '#F59E0B', bg: '#F59E0B18' },
              ].map(({ label: l, value, color: c, bg }) => (
                <div key={l} className="flex-1 rounded-xl p-2 text-center" style={{ background: bg }}>
                  <p className="text-[18px] font-black leading-none mb-0.5" style={{ color: c }}>{value}</p>
                  <p className="text-[8px] font-semibold text-gray-500 dark:text-gray-500 leading-tight">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="font-semibold text-gray-400">Progreso total</span>
            <span className="font-bold" style={{ color }}>
              {Math.round((promesasCompletadas / promesasTotal) * 100)}% completado
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(promesasCompletadas / promesasTotal) * 100}%`,
                background: `linear-gradient(90deg, ${color}, ${colorDark})`
              }} />
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1.5 text-right">
            {promesasTotal} compromisos · Actualizado jun 2025
          </p>
        </div>
      </div>
    </div>
  )
}
