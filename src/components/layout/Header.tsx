'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, Bell, Search } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showNotifications?: boolean
}

export function Header({ title, subtitle, showSearch = false, showNotifications = true }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 glass" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white text-[11px] font-black tracking-tight">GT</span>
          </div>
          <div>
            <h1 className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {showSearch && (
            <Link href="/buscar"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <Search size={17} />
            </Link>
          )}
          {showNotifications && (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-danger rounded-full ring-1 ring-white dark:ring-gray-900" />
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  )
}
