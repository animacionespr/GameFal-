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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top fade shadow */}
      <div className="absolute -top-6 left-0 right-0 h-6 pointer-events-none bg-gradient-to-t from-[var(--page-bg)] to-transparent opacity-80" />

      <div
        className="glass border-t border-gray-200/60 dark:border-white/[0.06]"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-stretch h-[68px] max-w-lg mx-auto px-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === '/'
              ? pathname === '/' || pathname === ''
              : pathname.startsWith(href.replace(/\/$/, ''))

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform duration-150"
              >
                {/* Icon pill */}
                <div
                  className={cn(
                    'w-12 h-8 rounded-2xl flex items-center justify-center transition-all duration-300',
                    active
                      ? 'shadow-sm'
                      : ''
                  )}
                  style={active ? {
                    background: 'linear-gradient(135deg, rgba(0,80,179,0.14), rgba(0,163,255,0.10))',
                  } : undefined}
                >
                  <Icon
                    size={active ? 21 : 20}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={cn(
                      'transition-colors duration-200',
                      active
                        ? 'text-primary dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'text-[10px] leading-none transition-all duration-200',
                    active
                      ? 'font-bold text-primary dark:text-blue-400'
                      : 'font-medium text-gray-400 dark:text-gray-500'
                  )}
                >
                  {label}
                </span>

                {/* Active dot */}
                <span
                  className={cn(
                    'w-1 h-1 rounded-full transition-all duration-300',
                    active
                      ? 'bg-primary dark:bg-blue-400 opacity-100 scale-100'
                      : 'opacity-0 scale-0'
                  )}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
