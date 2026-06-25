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
    <header className="sticky top-0 z-40" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div
        className="glass"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: 'linear-gradient(135deg, #003D8F 0%, #0060CC 60%, #00A3FF 100%)',
                boxShadow: '0 4px 10px rgba(0,80,179,0.4)',
              }}
            >
              <span className="text-white text-[10px] font-black tracking-tight">GT</span>
            </div>

            <div>
              <h1 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {showSearch && (
              <Link
                href="/buscar"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Search size={17} />
              </Link>
            )}
            {showNotifications && (
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative">
                <Bell size={17} />
                <span className="absolute top-[9px] right-[9px] w-1.5 h-1.5 bg-danger rounded-full ring-1 ring-white dark:ring-[#0D1120]" />
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

        {/* Gradient accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, #0050B3 0%, #00A3FF 50%, transparent 100%)', opacity: 0.5 }}
        />
      </div>
    </header>
  )
}
