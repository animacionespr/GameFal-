'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Bell, Info, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OfficialBundle } from '@/lib/types'

export function AjustesClient({ bundle, allOfficials }: { bundle: OfficialBundle; allOfficials: OfficialBundle[] }) {
  const { oficial } = bundle
  const [dark, setDark] = useState(false)
  const [notifs, setNotifs] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
    }
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div className="py-4 space-y-5">
      {/* Current official */}
      <div className="px-4">
        <p className="label-text mb-2">Gobernante Activo</p>
        <div className="card p-3.5 flex items-center gap-3">
          <span className="text-2xl">{oficial.bandera}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-gray-900 dark:text-white truncate">{oficial.nombre}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">{oficial.cargo}</p>
          </div>
          <Link href="/" className="text-[10px] text-primary dark:text-secondary font-semibold flex items-center gap-0.5">
            Cambiar <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* Display */}
      <div className="px-4">
        <p className="label-text mb-2">Apariencia</p>
        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-amber-500" />}
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                {dark ? 'Modo oscuro' : 'Modo claro'}
              </span>
            </div>
            <button onClick={toggleDark}
              className={cn('w-11 h-6 rounded-full transition-colors relative', dark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600')}>
              <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                dark ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-4">
        <p className="label-text mb-2">Notificaciones</p>
        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-primary" />
              <div>
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Alertas de actualizaciones</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600">Nuevos comunicados y datos</p>
              </div>
            </div>
            <button onClick={() => setNotifs(!notifs)}
              className={cn('w-11 h-6 rounded-full transition-colors relative', notifs ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600')}>
              <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                notifs ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>
        </div>
      </div>

      {/* Other officials */}
      <div className="px-4">
        <p className="label-text mb-2">Otros Países Disponibles</p>
        <div className="card divide-y divide-gray-100 dark:divide-gray-700">
          {allOfficials.filter(b => b.oficial.slug !== oficial.slug).map(b => (
            <Link key={b.oficial.slug} href={`/${b.oficial.slug}/`}
              className="flex items-center gap-3 p-3.5 active:opacity-70">
              <span className="text-xl shrink-0">{b.oficial.bandera}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-white truncate">{b.oficial.nombre}</p>
                <p className="text-[9.5px] text-gray-400 dark:text-gray-600 truncate">{b.oficial.pais}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="px-4">
        <p className="label-text mb-2">Acerca de</p>
        <div className="card divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center gap-3 p-4">
            <Info size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-white">GovTracker v1.2</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600">
                Rastreador de gobernantes · {allOfficials.length} países
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Solo mostramos datos de fuentes oficiales verificadas: gobiernos, agencias estadísticas y registros públicos.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-[9.5px] text-gray-400 dark:text-gray-600 px-4">
        Actualización automática: 6:10am · 12:05pm · 11:10pm (hora PR)
      </p>
    </div>
  )
}
