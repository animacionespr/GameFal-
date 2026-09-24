'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary'
  showLabel?: boolean
  height?: 'sm' | 'md' | 'lg'
}

const colors = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  secondary: 'bg-secondary',
}

const heights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
}

export function ProgressBar({
  value,
  max = 100,
  className,
  color = 'primary',
  showLabel = false,
  height = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor = pct >= 70 ? 'success' : pct >= 40 ? color : 'warning'

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progreso</span>
          <span className="font-semibold">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', heights[height])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[barColor])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
