'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, CheckSquare, Clock, BarChart2, Newspaper, Sparkles, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/',             icon: Home,        label: 'Inicio'    },
  { href: '/perfil',       icon: User,        label: 'Perfil'    },
  { href: '/promesas',     icon: CheckSquare, label: 'Promesas'  },
  { href: '/cronologia',   icon: Clock,       label: 'Historial' },
  { href: '/estadisticas', icon: BarChart2,   label: 'Datos'     },
  { href: '/noticias',     icon: Newspaper,   label: 'Noticias'  },
  { href: '/analisis',     icon: Sparkles,    label: 'IA'        },
  { href: '/ajustes',      icon: Settings,    label: 'Ajustes'   },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto px-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={cn('nav-pill', active ? 'bg-primary/10 dark:bg-primary/20' : '')}>
              <Icon
                size={19}
                strokeWidth={active ? 2.5 : 1.8}
                className={cn(
                  'transition-colors duration-200',
                  active ? 'text-primary dark:text-secondary' : 'text-gray-400 dark:text-gray-600'
                )}
              />
              <span className={cn(
                'text-[8.5px] font-semibold leading-tight transition-colors',
                active ? 'text-primary dark:text-secondary' : 'text-gray-400 dark:text-gray-600'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
