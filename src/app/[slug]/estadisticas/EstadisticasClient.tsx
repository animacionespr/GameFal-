'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import type { OfficialBundle, Statistic } from '@/lib/types'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'

function StatChart({ stat }: { stat: Statistic }) {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area')
  const data = stat.historial.map(h => ({ fecha: h.fecha, valor: h.valor }))
  const color = stat.tendencia === 'subida' ? '#16A34A' : stat.tendencia === 'bajada' ? '#DC2626' : '#00A3FF'

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="label-text">{stat.categoria}</p>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{stat.nombre}</h3>
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
          stat.tendencia === 'subida' ? 'bg-green-100 dark:bg-green-900/30 text-success' :
          stat.tendencia === 'bajada' ? 'bg-red-100 dark:bg-red-900/30 text-danger' :
          'bg-gray-100 dark:bg-gray-700 text-gray-500'
        )}>
          {stat.tendencia === 'subida' ? <TrendingUp size={11} /> :
           stat.tendencia === 'bajada' ? <TrendingDown size={11} /> :
           <Minus size={11} />}
          {stat.tendencia === 'subida' ? 'Subida' : stat.tendencia === 'bajada' ? 'Bajada' : 'Estable'}
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {typeof stat.valor === 'number' && stat.valor > 10000
              ? formatNumber(stat.valor)
              : stat.valor}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{stat.unidad}</p>
        </div>
        <div className="flex gap-1">
          {(['area', 'bar'] as const).map(t => (
            <button key={t} onClick={() => setChartType(t)}
              className={cn('px-2 py-1 rounded text-[10px] font-medium transition-colors',
                chartType === t
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              )}>
              {t === 'area' ? 'Área' : 'Barras'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: color }}
              />
              <Area type="monotone" dataKey="valor" stroke={color} strokeWidth={2}
                fill={`url(#grad-${stat.id})`} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: color }}
              />
              <Bar dataKey="valor" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[10px] text-gray-400">Actualizado: {stat.fechaActualizacion}</p>
        <p className="text-[10px] text-primary dark:text-secondary font-medium">{stat.fuente.split('—')[0]}</p>
      </div>
    </div>
  )
}

export function EstadisticasClient({ bundle }: { bundle: OfficialBundle }) {
  const { estadisticas } = bundle

  const categorias = ['Todas', ...Array.from(new Set(estadisticas.map(s => s.categoria)))]
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const filtradas = categoriaActiva === 'Todas'
    ? estadisticas
    : estadisticas.filter(s => s.categoria === categoriaActiva)

  return (
    <div className="py-4">
      {/* Category filter */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                categoriaActiva === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4">
        {filtradas.map(stat => <StatChart key={stat.id} stat={stat} />)}
      </div>

      <div className="mx-4 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
          Todos los datos provienen de fuentes oficiales verificadas.
          Los gráficos reflejan datos históricos verificados.
        </p>
      </div>
    </div>
  )
}
