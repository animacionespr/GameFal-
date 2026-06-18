import { TrendingDown, TrendingUp, Zap, Users } from 'lucide-react'

const stats = [
  { label: 'Desempleo',      value: '5.8%',   change: '−0.7%',  positive: true,  icon: TrendingDown, gradient: 'linear-gradient(135deg, #16A34A, #15803d)' },
  { label: 'Turismo',        value: '3.2M',   change: '+11.5%', positive: true,  icon: Users,        gradient: 'linear-gradient(135deg, #3b82f6, #4f46e5)'  },
  { label: 'Energía Renov.', value: '26%',    change: '+4pts',  positive: true,  icon: Zap,          gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)'   },
  { label: 'PNB',            value: '$108B',  change: '+2.1%',  positive: true,  icon: TrendingUp,   gradient: 'linear-gradient(135deg, #0050B3, #00A3FF)'   },
]

export function QuickStats() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Indicadores Clave</h2>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          Mayo 2025
        </span>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-1">
        {stats.map(({ label, value, change, positive, icon: Icon, gradient }) => (
          <div key={label}
            className="shrink-0 w-[130px] rounded-2xl overflow-hidden card-lift"
            style={{ background: gradient }}>
            <div className="p-3.5">
              {/* Icon */}
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-white text-[24px] font-black leading-none mb-1.5">{value}</p>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${positive ? 'bg-white/20 text-white' : 'bg-red-500/30 text-red-100'}`}>
                  {change}
                </span>
                <span className="text-white/50 text-[9px]">vs ant.</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
