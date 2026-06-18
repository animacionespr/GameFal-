'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, CheckSquare, Clock, BarChart2, Newspaper, Sparkles, Settings, TrendingUp, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  slug: string
  title: string
  subtitle?: string
  children: React.ReactNode
}

const NAV_ITEMS = [
  { key: '',           icon: Home,         label: 'Inicio'    },
  { key: 'promesas',   icon: CheckSquare,  label: 'Promesas'  },
  { key: 'finanzas',   icon: TrendingUp,   label: 'Finanzas'  },
  { key: 'cronologia', icon: Clock,        label: 'Historial' },
  { key: 'estadisticas',icon: BarChart2,   label: 'Datos'     },
  { key: 'noticias',   icon: Newspaper,    label: 'Noticias'  },
  { key: 'analisis',   icon: Sparkles,     label: 'IA'        },
  { key: 'perfil',     icon: User,         label: 'Perfil'    },
]

export function DynamicPageShell({ slug, title, subtitle, children }: Props) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          <Link href="/" className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
            <ArrowLeft size={15} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[14px] font-black gradient-text truncate">{title}</h1>
            {subtitle && <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">{subtitle}</p>}
          </div>
        </div>
      </header>

      <main className="flex-1" style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 dark:border-gray-700/50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center h-[60px] max-w-lg mx-auto overflow-x-auto no-scrollbar px-1">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
            const href = key ? `/${slug}/${key}` : `/${slug}/`
            const active = key === ''
              ? pathname === `/${slug}` || pathname === `/${slug}/`
              : pathname.startsWith(`/${slug}/${key}`)
            return (
              <Link key={key} href={href}
                className={cn('nav-pill shrink-0', active ? 'bg-primary/10 dark:bg-primary/20' : '')}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8}
                  className={cn('transition-colors', active ? 'text-primary dark:text-secondary' : 'text-gray-400 dark:text-gray-600')} />
                <span className={cn('text-[8px] font-semibold leading-tight transition-colors',
                  active ? 'text-primary dark:text-secondary' : 'text-gray-400 dark:text-gray-600')}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
