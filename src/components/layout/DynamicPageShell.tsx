'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Newspaper, TrendingUp, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  slug: string
  title: string
  subtitle?: string
  children: React.ReactNode
}

const NAV_ITEMS = [
  { key: '',          icon: Home,        label: 'Inicio'   },
  { key: 'promesas',  icon: CheckSquare, label: 'Promesas' },
  { key: 'noticias',  icon: Newspaper,   label: 'Noticias' },
  { key: 'finanzas',  icon: TrendingUp,  label: 'Finanzas' },
  { key: 'ajustes',   icon: Settings,    label: 'Ajustes'  },
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

      <main className="flex-1" style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 dark:border-gray-700/50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-[70px] max-w-lg mx-auto">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
            const href = key ? `/${slug}/${key}/` : `/${slug}/`
            const active = key === ''
              ? pathname === `/${slug}` || pathname === `/${slug}/`
              : pathname.startsWith(`/${slug}/${key}`)
            return (
              <Link key={key} href={href}
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
                <span className={cn('text-[10px] font-semibold leading-none', active ? 'font-bold' : '')}>
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
