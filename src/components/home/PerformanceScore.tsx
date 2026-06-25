'use client'

import { gobernadorPR } from '@/lib/data/oficial-pr'

// Gauge geometry: arc from 210° to 150° going CLOCKWISE through the TOP (300° sweep)
// Convention: 0° = top, clockwise positive
const CX = 65   // center x in viewBox
const CY = 62   // center y in viewBox
const R  = 42   // radius
const START = 210  // lower-left
const SPAN  = 300  // total degrees (300° arc with 60° gap at bottom)

function pt(angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

function arc(startDeg: number, spanDeg: number) {
  if (spanDeg <= 0) return ''
  const s = pt(startDeg)
  const e = pt(startDeg + spanDeg)
  const large = spanDeg > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export function PerformanceScore() {
  const {
    puntajeRendimiento: score,
    promesasCompletadas,
    promesasEnProgreso,
    promesasRetrasadas,
    promesasTotal,
  } = gobernadorPR

  const grade     = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D'
  const color     = score >= 70 ? '#16A34A' : score >= 50 ? '#00A3FF' : '#F59E0B'
  const colorDark = score >= 70 ? '#0f7a30' : score >= 50 ? '#0070BB' : '#c47b00'
  const label     = score >= 70 ? 'Rendimiento Sólido' : score >= 50 ? 'Rendimiento Moderado' : 'Necesita Mejoras'

  const bgArc   = arc(START, SPAN)
  const fillArc = arc(START, (score / 100) * SPAN)
  const pct     = Math.round((promesasCompletadas / promesasTotal) * 100)

  return (
    <div className="card-deep overflow-hidden">
      {/* Top color bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${colorDark}, ${color})` }} />

      <div className="p-4">
        <div className="flex items-start gap-3">

          {/* ── Gauge ─────────────────────────────────── */}
          <div className="shrink-0">
            <svg
              viewBox="0 0 130 100"
              width="130"
              height="100"
            >
              <defs>
                <filter id="glow-perf" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="fill-perf" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colorDark} />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              </defs>

              {/* Track */}
              <path
                d={bgArc}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="9"
                strokeLinecap="round"
                className="dark:hidden"
              />
              <path
                d={bgArc}
                fill="none"
                stroke="#374151"
                strokeWidth="9"
                strokeLinecap="round"
                className="hidden dark:block"
              />

              {/* Fill */}
              {fillArc && (
                <path
                  d={fillArc}
                  fill="none"
                  stroke="url(#fill-perf)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  filter="url(#glow-perf)"
                />
              )}

              {/* Score number */}
              <text
                x={CX}
                y={CY + 9}
                textAnchor="middle"
                fontSize="28"
                fontWeight="900"
                fontFamily="Inter, system-ui, sans-serif"
                fill="currentColor"
                className="text-gray-900 dark:text-white"
              >
                {score}
              </text>

              {/* Unit */}
              <text
                x={CX}
                y={CY + 23}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill="#9ca3af"
              >
                / 100
              </text>
            </svg>
          </div>

          {/* ── Right content ──────────────────────────── */}
          <div className="flex-1 min-w-0 pt-1.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Rendimiento
              </span>
              <span
                className="text-[13px] font-black px-2 py-0.5 rounded-lg"
                style={{ color, background: color + '20' }}
              >
                {grade}
              </span>
            </div>
            <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100 mb-3 leading-snug">
              {label}
            </p>

            {/* Mini stat chips */}
            <div className="flex gap-1.5">
              {[
                { label: 'Logradas', value: promesasCompletadas, color: '#16A34A', bg: '#16A34A18' },
                { label: 'Activas',  value: promesasEnProgreso,  color: '#3b82f6', bg: '#3b82f618' },
                { label: 'Tardías',  value: promesasRetrasadas,  color: '#F59E0B', bg: '#F59E0B18' },
              ].map(({ label: l, value, color: c, bg }) => (
                <div
                  key={l}
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{ background: bg }}
                >
                  <p className="text-[17px] font-black leading-none mb-0.5" style={{ color: c }}>
                    {value}
                  </p>
                  <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 leading-tight">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="font-semibold text-gray-400">Progreso total</span>
            <span className="font-bold" style={{ color }}>{pct}% completado</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${colorDark}, ${color})`,
              }}
            />
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1.5 text-right">
            {promesasTotal} compromisos · Actualizado jun 2025
          </p>
        </div>
      </div>
    </div>
  )
}
