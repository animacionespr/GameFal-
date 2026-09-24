import { TrendingDown, TrendingUp, Zap, Users } from 'lucide-react'

const stats = [
  { label: 'Desempleo',      value: '5.8%',   change: '−0.7%',  positive: true,  icon: TrendingDown, gradient: 'linear-gradient(145deg, #15803d, #16A34A, #22c55e)' },
  { label: 'Turismo',        value: '3.2M',   change: '+11.5%', positive: true,  icon: Users,        gradient: 'linear-gradient(145deg, #1d4ed8, #3b82f6, #60a5fa)'  },
  { label: 'Energía Renov.', value: '26%',    change: '+4pts',  positive: true,  icon: Zap,          gradient: 'linear-gradient(145deg, #d97706, #f59e0b, #fbbf24)'   },
  { label: 'PNB',            value: '$108B',  change: '+2.1%',  positive: true,  icon: TrendingUp,   gradient: 'linear-gradient(145deg, #003D8F, #0050B3, #00A3FF)'   },
]

export function QuickStats() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Indicadores Clave</h2>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          Jun 2025
        </span>
      </div>

      {/* Scroll wrapper with right fade hint */}
      <div className="relative">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
          {stats.map(({ label, value, change, positive, icon: Icon, gradient }) => (
            <div
              key={label}
              className="shrink-0 w-[136px] rounded-2xl overflow-hidden card-lift"
              style={{
                background: gradient,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              }}
            >
              <div className="p-4">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3.5 shadow-sm">
                  <Icon size={17} className="text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-white text-[26px] font-black leading-none mb-2">{value}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-white/25 text-white' : 'bg-red-500/30 text-red-100'}`}>
                    {change}
                  </span>
                  <span className="text-white/45 text-[9px] font-medium">vs ant.</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right fade gradient — scroll affordance */}
        <div
          className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--page-bg) 20%, transparent)' }}
        />
      </div>
    </div>
  )
}
