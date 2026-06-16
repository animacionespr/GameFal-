'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, User, CheckSquare, Clock, BarChart2,
  Newspaper, Sparkles, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/perfil', icon: User, label: 'Perfil' },
  { href: '/promesas', icon: CheckSquare, label: 'Promesas' },
  { href: '/cronologia', icon: Clock, label: 'Historial' },
  { href: '/estadisticas', icon: BarChart2, label: 'Datos' },
  { href: '/noticias', icon: Newspaper, label: 'Noticias' },
  { href: '/analisis', icon: Sparkles, label: 'IA' },
  { href: '/ajustes', icon: Settings, label: 'Ajustes' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200 dark:border-gray-700"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200',
                active
                  ? 'text-primary dark:text-secondary'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Icon
                size={20}
                className={cn(active && 'drop-shadow-[0_0_6px_rgba(0,163,255,0.6)]')}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={cn('text-[9px] font-medium leading-tight', active && 'font-bold')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
