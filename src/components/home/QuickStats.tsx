import { TrendingDown, TrendingUp, Zap, Users } from 'lucide-react'

const stats = [
  { label: 'Desempleo', value: '5.8%', change: '−0.7%', positive: true, icon: TrendingDown },
  { label: 'Turismo', value: '3.2M', change: '+11.5%', positive: true, icon: Users },
  { label: 'Energía Renovable', value: '26%', change: '+4pts', positive: true, icon: Zap },
  { label: 'PNB', value: '$108B', change: '+2.1%', positive: true, icon: TrendingUp },
]

export function QuickStats() {
  return (
    <div>
      <h2 className="section-title mb-3 px-4">Indicadores Clave</h2>
      <div className="grid grid-cols-2 gap-3 px-4">
        {stats.map(({ label, value, change, positive, icon: Icon }) => (
          <div key={label} className="card p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="label-text">{label}</p>
              <Icon size={14} className={positive ? 'text-success' : 'text-danger'} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className={`text-[11px] font-medium mt-0.5 ${positive ? 'text-success' : 'text-danger'}`}>
              {change} vs año anterior
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
