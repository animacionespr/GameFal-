import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  unit?: string
  icon?: React.ReactNode
  trend?: 'subida' | 'bajada' | 'estable'
  invertTrend?: boolean
  className?: string
}

export function StatCard({ label, value, change, unit, icon, trend, invertTrend = false, className }: StatCardProps) {
  const isPositive = trend
    ? invertTrend ? trend === 'bajada' : trend === 'subida'
    : change !== undefined
    ? invertTrend ? change < 0 : change > 0
    : null

  return (
    <div className={cn('card p-4', className)}>
      <div className="flex items-start justify-between mb-2">
        <p className="label-text">{label}</p>
        {icon && (
          <div className="text-primary dark:text-secondary opacity-80">{icon}</div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </p>
      {(change !== undefined || trend) && (
        <div className={cn(
          'flex items-center gap-1 mt-1 text-xs font-medium',
          isPositive === true ? 'text-success' :
          isPositive === false ? 'text-danger' :
          'text-gray-500 dark:text-gray-400'
        )}>
          {trend === 'subida' ? <TrendingUp size={12} /> :
           trend === 'bajada' ? <TrendingDown size={12} /> :
           <Minus size={12} />}
          {change !== undefined && (
            <span>{change > 0 ? '+' : ''}{change}{unit && ` ${unit}`} vs anterior</span>
          )}
        </div>
      )}
    </div>
  )
}
