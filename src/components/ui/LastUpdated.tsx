'use client'

import { RefreshCw } from 'lucide-react'
import { useLiveData } from '@/lib/hooks/useLiveData'

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'justo ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

export function LastUpdated() {
  const { data, loading } = useLiveData()

  if (loading) return null

  const ts = data?.ultimaActualizacion
  if (!ts) return null

  return (
    <span className="flex items-center gap-1 text-[9px] text-gray-400 dark:text-gray-600">
      <RefreshCw size={8} className={data?.fuentesActivas ? 'text-green-500' : ''} />
      {data?.fuentesActivas ? 'En vivo · ' : 'Actualizado · '}
      {timeAgo(ts)}
    </span>
  )
}
