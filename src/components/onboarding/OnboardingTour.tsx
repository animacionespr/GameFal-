'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight, Shield, TrendingUp, BarChart2, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOUR_KEY = 'gt_tour_v1'

interface Rect { top: number; left: number; width: number; height: number }

interface Step {
  selector: string | null
  icon: React.ElementType
  title: string
  body: string
  calloutAbove?: boolean
}

const STEPS: Step[] = [
  {
    selector: null,
    icon: Shield,
    title: '¡Bienvenido a GovTracker PR!',
    body: 'La única plataforma de transparencia gubernamental de Puerto Rico. Todos los datos son verificados con fuentes oficiales del gobierno.',
  },
  {
    selector: '[data-tour="performance"]',
    icon: TrendingUp,
    title: 'Puntaje de Rendimiento',
    body: 'El rendimiento del gobernador calculado en tiempo real a partir del cumplimiento de promesas de campaña y proyectos activos.',
  },
  {
    selector: '[data-tour="stats"]',
    icon: BarChart2,
    title: 'Indicadores Económicos',
    body: 'Desliza estas tarjetas para ver desempleo, turismo, energía renovable y el Producto Nacional Bruto.',
  },
  {
    selector: '[data-tour="nav"]',
    icon: Compass,
    title: 'Explora Todo el App',
    body: 'Accede a las Promesas de campaña, Noticias, Cronología de acciones, Finanzas y Estadísticas oficiales desde aquí.',
    calloutAbove: true,
  },
]

export function OnboardingTour() {
  const [step, setStep] = useState(-1)
  const [rect, setRect] = useState<Rect | null>(null)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_KEY)
      if (!seen) {
        const t = setTimeout(() => { setStep(0); setVisible(true) }, 900)
        return () => clearTimeout(t)
      }
    } catch { /* localStorage not available */ }
  }, [])

  // Find and highlight the target element for the current step
  useEffect(() => {
    const s = STEPS[step]
    if (!s?.selector) { setRect(null); return }

    const el = document.querySelector(s.selector) as HTMLElement | null
    if (!el) { setRect(null); return }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const t = setTimeout(() => {
      const r = el.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }, 380)
    return () => clearTimeout(t)
  }, [step])

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => {
      try { localStorage.setItem(TOUR_KEY, '1') } catch { /* */ }
      setVisible(false)
      setExiting(false)
    }, 300)
  }, [])

  const next = useCallback(() => {
    if (step < STEPS.length - 1) {
      setRect(null)
      setStep(s => s + 1)
    } else {
      dismiss()
    }
  }, [step, dismiss])

  if (!visible || step < 0) return null

  const current = STEPS[step]
  const isWelcome = step === 0
  const isLast = step === STEPS.length - 1
  const Icon = current.icon

  return (
    <div className={cn('transition-opacity duration-300', exiting ? 'opacity-0' : 'opacity-100')}>

      {/* ── Overlay ──────────────────────────────────────────── */}
      {isWelcome || !rect ? (
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-[2px]" />
      ) : (
        // Spotlight: box-shadow creates the "hole" effect
        <div
          className="fixed z-[9998] rounded-[20px] pointer-events-none transition-all duration-400"
          style={{
            top:    rect.top    - 7,
            left:   rect.left   - 7,
            width:  rect.width  + 14,
            height: rect.height + 14,
            boxShadow: '0 0 0 3px rgba(0,163,255,0.85), 0 0 20px rgba(0,163,255,0.3), 0 0 0 9999px rgba(0,0,0,0.68)',
          }}
        />
      )}

      {/* ── Welcome modal (step 0) ────────────────────────────── */}
      {isWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-5">
          <div
            className="bg-white dark:bg-[#111827] rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            style={{ animation: 'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div
                className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center shadow-xl"
                style={{ background: 'linear-gradient(135deg, #001A4D, #0050B3 50%, #00A3FF)' }}
              >
                <Icon size={32} className="text-white" />
              </div>
            </div>

            <h2 className="text-[22px] font-black text-gray-900 dark:text-white text-center leading-tight mb-2.5">
              {current.title}
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">
              {current.body}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === step
                      ? 'w-7 bg-primary'
                      : 'w-1.5 bg-gray-200 dark:bg-gray-700'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-full py-3.5 rounded-2xl font-bold text-[15px] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #0050B3, #00A3FF)', boxShadow: '0 6px 20px rgba(0,80,179,0.4)' }}
            >
              Comenzar tour <ChevronRight size={18} />
            </button>

            <button onClick={dismiss} className="w-full mt-3 py-2 text-[12px] text-gray-400 font-medium">
              Saltar introducción
            </button>
          </div>
        </div>
      )}

      {/* ── Step callout (steps 1-3) ──────────────────────────── */}
      {!isWelcome && (
        <div
          className={cn(
            'fixed left-3 right-3 z-[9999]',
            current.calloutAbove ? 'bottom-[88px]' : 'bottom-4'
          )}
          style={{ animation: 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(10,15,30,0.96)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #0050B3, #00A3FF)' }}
              >
                <Icon size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[14px] leading-tight">{current.title}</p>
                <p className="text-[10px] text-blue-400 font-semibold">
                  Paso {step} de {STEPS.length - 1}
                </p>
              </div>
              <button
                onClick={dismiss}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0"
              >
                <X size={12} className="text-white/60" />
              </button>
            </div>

            <p className="text-[13px] text-gray-300 leading-relaxed mb-3.5">
              {current.body}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === step
                        ? 'w-5 bg-blue-400'
                        : i < step
                        ? 'w-1.5 bg-blue-400/40'
                        : 'w-1.5 bg-white/15'
                    )}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[13px] text-white active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #0050B3, #00A3FF)' }}
              >
                {isLast ? '¡Listo!' : 'Siguiente'}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
