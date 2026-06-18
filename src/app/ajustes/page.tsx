'use client'

import { PageShell } from '@/components/layout/PageShell'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, Bell, Globe, Shield, Info, ChevronRight, Database } from 'lucide-react'

export default function AjustesPage() {
  const { theme, toggleTheme } = useTheme()

  const sections = [
    {
      title: 'Apariencia',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Modo Oscuro',
          description: 'Activar/desactivar tema oscuro',
          action: (
            <button onClick={toggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Notificaciones',
      items: [
        { icon: Bell, label: 'Nuevas Leyes y Órdenes', description: 'Alertas de órdenes ejecutivas y leyes', action: <ChevronRight size={16} className="text-gray-400" /> },
        { icon: Bell, label: 'Anuncios Oficiales', description: 'Comunicados del gobierno', action: <ChevronRight size={16} className="text-gray-400" /> },
        { icon: Bell, label: 'Cambios en Estadísticas', description: 'Actualizaciones de datos clave', action: <ChevronRight size={16} className="text-gray-400" /> },
      ],
    },
    {
      title: 'Datos y Privacidad',
      items: [
        { icon: Database, label: 'Fuentes de Datos', description: 'Ver fuentes oficiales utilizadas', action: <ChevronRight size={16} className="text-gray-400" /> },
        { icon: Shield, label: 'Política de Privacidad', description: 'Sin datos personales recolectados', action: <ChevronRight size={16} className="text-gray-400" /> },
      ],
    },
    {
      title: 'Idioma y Región',
      items: [
        { icon: Globe, label: 'Idioma', description: 'Español (Puerto Rico)', action: <ChevronRight size={16} className="text-gray-400" /> },
      ],
    },
    {
      title: 'Acerca de',
      items: [
        { icon: Info, label: 'Versión', description: 'GovTracker PR v1.0.0 MVP', action: null },
        { icon: Shield, label: 'Política Editorial', description: 'Solo datos oficiales verificados', action: <ChevronRight size={16} className="text-gray-400" /> },
        { icon: Info, label: 'Contacto', description: 'transparencia@govtracker.pr', action: <ChevronRight size={16} className="text-gray-400" /> },
      ],
    },
  ]

  return (
    <PageShell title="Ajustes" subtitle="Personaliza tu experiencia">
      <div className="space-y-5 py-4">
        {sections.map(section => (
          <div key={section.title}>
            <p className="label-text px-4 mb-2">{section.title}</p>
            <div className="card mx-4 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-primary dark:text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mx-4 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-black">GT</span>
            </div>
          </div>
          <h3 className="text-sm font-black text-center text-gray-900 dark:text-white mb-1">Rastreador de Gobierno</h3>
          <p className="text-[10px] text-center text-gray-500 dark:text-gray-400">
            Plataforma de transparencia gubernamental basada en datos oficiales y verificables.
            Sin afiliación política. Sin opiniones. Solo hechos.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
