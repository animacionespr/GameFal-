'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Newspaper, TrendingUp, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',                                         icon: Home,        label: 'Inicio'   },
  { href: '/jenniffer-gonzalez-colon/promesas/',       icon: CheckSquare, label: 'Promesas' },
  { href: '/jenniffer-gonzalez-colon/noticias/',       icon: Newspaper,   label: 'Noticias' },
  { href: '/jenniffer-gonzalez-colon/finanzas/',       icon: TrendingUp,  label: 'Finanzas' },
  { href: '/jenniffer-gonzalez-colon/ajustes/',        icon: Settings,    label: 'Ajustes'  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 dark:border-gray-700/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch h-[70px] max-w-lg mx-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/'
            ? pathname === '/' || pathname === ''
            : pathname.startsWith(href.replace(/\/$/, ''))
          return (
            <Link key={href} href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95',
                active ? 'text-primary dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
              )}>
              <div className={cn(
                'w-11 h-8 rounded-2xl flex items-center justify-center transition-all duration-200',
                active ? 'bg-primary/10 dark:bg-blue-400/15' : ''
              )}>
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                'text-[10px] font-semibold leading-none',
                active ? 'font-bold' : ''
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
