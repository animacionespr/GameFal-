'use client'

import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { encuestasPR } from '@/lib/data/oficial-pr'
import { cn } from '@/lib/utils'

export function ApprovalRating() {
  const [expanded, setExpanded] = useState(false)

  // Latest management poll (primary)
  const gestion = encuestasPR.find(e => e.tipo === 'gestion')!
  // Image/perception poll (secondary)
  const imagen  = encuestasPR.find(e => e.tipo === 'imagen')!

  const approveColor  = gestion.aprueba  >= 50 ? '#16A34A' : '#f97316'
  const disapColor    = '#DC2626'

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Aprobación Ciudadana</h2>
        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full pulse-dot" />
          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Encuestas
          </span>
        </div>
      </div>

      <div className="mx-4 card-deep overflow-hidden">
        {/* Top accent */}
        <div className="h-[3px]" style={{
          background: `linear-gradient(90deg, ${approveColor} ${gestion.aprueba}%, ${disapColor} ${gestion.aprueba}%)`
        }} />

        <div className="p-4">
          {/* ── Main numbers ───────────────────────── */}
          <div className="flex items-end gap-3 mb-3">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Aprueba gestión
              </p>
              <div className="flex items-end gap-1.5">
                <span
                  className="text-[38px] font-black leading-none"
                  style={{ color: approveColor }}
                >
                  {gestion.aprueba}
                </span>
                <span className="text-[16px] font-bold text-gray-400 mb-1">%</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-100 dark:bg-white/5" />

            <div className="flex-1 text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Desaprueba
              </p>
              <div className="flex items-end gap-1.5 justify-end">
                <span className="text-[38px] font-black leading-none" style={{ color: disapColor }}>
                  {gestion.desaprueba}
                </span>
                <span className="text-[16px] font-bold text-gray-400 mb-1">%</span>
              </div>
            </div>
          </div>

          {/* Segmented bar */}
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            <div
              className="h-full rounded-l-full transition-all duration-700"
              style={{ width: `${gestion.aprueba}%`, background: approveColor }}
            />
            <div
              className="h-full rounded-r-full flex-1"
              style={{ background: disapColor }}
            />
          </div>

          {/* ── Party breakdown ─────────────────────── */}
          {gestion.desglosePorPartido && (
            <div className="space-y-2 mb-4">
              {[
                { label: 'PNP',  data: gestion.desglosePorPartido.pnp,  color: '#0050B3' },
                { label: 'PPD',  data: gestion.desglosePorPartido.ppd,  color: '#C8102E' },
              ].filter(r => r.data).map(({ label, data, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shrink-0"
                    style={{ background: color }}
                  >
                    {label}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700/60">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${data!.aprueba}%`,
                        background: data!.aprueba > 40 ? '#16A34A' : data!.aprueba > 20 ? '#f97316' : '#DC2626',
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px] font-bold shrink-0 tabular-nums"
                    style={{ color: data!.aprueba > 40 ? '#16A34A' : data!.aprueba > 20 ? '#f97316' : '#DC2626' }}
                  >
                    {data!.aprueba}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Nota de gestión ─────────────────────── */}
          {gestion.notaGestion && (
            <div className="flex gap-2 mb-4">
              {[
                { label: 'A / B', pct: gestion.notaGestion.buena,   color: '#16A34A', bg: '#16A34A15' },
                { label: 'C',     pct: gestion.notaGestion.regular, color: '#f59e0b', bg: '#f59e0b15' },
                { label: 'D / F', pct: gestion.notaGestion.mala,    color: '#DC2626', bg: '#DC262615' },
              ].map(({ label, pct, color, bg }) => (
                <div
                  key={label}
                  className="flex-1 rounded-xl p-2.5 text-center"
                  style={{ background: bg }}
                >
                  <p className="text-[18px] font-black leading-none mb-0.5" style={{ color }}>
                    {pct}%
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color }}>
                    Nota {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Expandable: Imagen section (Peter Hart) */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between text-[10px] text-gray-400 font-semibold"
          >
            <span>Encuesta de imagen (Peter Hart, ago 2025)</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 mb-1">Percepción positiva</p>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500"
                      style={{ width: `${imagen.aprueba}%` }} />
                  </div>
                </div>
                <span className="text-[13px] font-black text-orange-500">{imagen.aprueba}%</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 mb-1">Percepción negativa</p>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-red-500"
                      style={{ width: `${imagen.desaprueba}%` }} />
                  </div>
                </div>
                <span className="text-[13px] font-black text-red-500">{imagen.desaprueba}%</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-relaxed">{imagen.notas}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5">
            <div>
              <p className="text-[9px] text-gray-400">
                {gestion.firma} · {gestion.fechaTrabajoCampo}
              </p>
              <p className="text-[9px] text-gray-400">
                n={gestion.muestra.toLocaleString()} · ±{gestion.margenError}%
              </p>
            </div>
            <a
              href={gestion.urlFuente}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-blue-400"
            >
              Ver encuesta <ExternalLink size={9} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
