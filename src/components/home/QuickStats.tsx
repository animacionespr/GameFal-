import { TrendingDown, TrendingUp, Zap, Users } from 'lucide-react'

const stats = [
  { label: 'Desempleo',       value: '5.8%',  change: '−0.7%',  positive: true,  icon: TrendingDown, color: 'from-green-500 to-emerald-600' },
  { label: 'Turismo',         value: '3.2M',  change: '+11.5%', positive: true,  icon: Users,        color: 'from-blue-500 to-indigo-600'  },
  { label: 'Energía Renov.',  value: '26%',   change: '+4pts',  positive: true,  icon: Zap,          color: 'from-amber-500 to-orange-500' },
  { label: 'PNB',             value: '$108B', change: '+2.1%',  positive: true,  icon: TrendingUp,   color: 'from-primary to-secondary'   },
]

export function QuickStats() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title">Indicadores Clave</h2>
        <span className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">Mayo 2025</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {stats.map(({ label, value, change, positive, icon: Icon, color }) => (
          <div key={label} className="card p-3.5 overflow-hidden relative">
            {/* Subtle gradient accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${color} opacity-[0.07] -translate-y-6 translate-x-6`} />
            <div className="relative z-10">
              <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2.5 shadow-sm`}>
                <Icon size={13} className="text-white" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-[21px] font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
              <p className={`text-[10.5px] font-semibold ${positive ? 'text-green-500 dark:text-green-400' : 'text-red-500'}`}>
                {change} vs año anterior
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
