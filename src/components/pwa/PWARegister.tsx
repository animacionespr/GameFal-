'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/GameFal-/sw.js', { scope: '/GameFal-/' }).catch(() => {})
    }

    // Detect iOS Safari
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone = (navigator as Navigator & { standalone?: boolean }).standalone
    setIsIOS(ios)

    if (ios && !standalone) {
      const dismissed = sessionStorage.getItem('ios-hint-dismissed')
      if (!dismissed) setShowIOSHint(true)
    }

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      const dismissed = sessionStorage.getItem('install-dismissed')
      if (!dismissed) setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setInstallPrompt(null)
  }

  const dismissBanner = () => {
    setShowBanner(false)
    sessionStorage.setItem('install-dismissed', '1')
  }

  const dismissIOSHint = () => {
    setShowIOSHint(false)
    sessionStorage.setItem('ios-hint-dismissed', '1')
  }

  if (showBanner) {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-50 bg-blue-600 text-white rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Download size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[13px]">Instalar GovTracker PR</p>
          <p className="text-white/70 text-[11px]">Acceso rápido desde tu pantalla principal</p>
        </div>
        <button onClick={handleInstall} className="bg-white text-blue-600 font-bold text-[12px] px-3 py-1.5 rounded-xl shrink-0">
          Instalar
        </button>
        <button onClick={dismissBanner} className="text-white/60 shrink-0 p-1">
          <X size={16} />
        </button>
      </div>
    )
  }

  if (showIOSHint) {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-50 bg-gray-800 border border-white/10 text-white rounded-2xl p-3.5 shadow-2xl">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-bold text-[13px] mb-1">Instalar como app en iPhone</p>
            <p className="text-white/60 text-[11px] leading-relaxed">
              Toca <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">Compartir</span> en Safari y luego{' '}
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">Añadir a inicio</span>
            </p>
          </div>
          <button onClick={dismissIOSHint} className="text-white/40 p-1 shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  return null
}
