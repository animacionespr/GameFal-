import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { DollarSign, TrendingUp, TrendingDown, Landmark, Receipt, PieChart, ExternalLink } from 'lucide-react'

export async function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

// Public finance sources per country
const FINANCE_SOURCES: Record<string, {
  presupuesto: string
  deuda: string
  ingresos: string
  gastos: string
  portal: string
  urlPortal: string
}> = {
  'jenniffer-gonzalez-colon': {
    presupuesto: '$12.4B',
    deuda: '$71.2B',
    ingresos: '$10.8B',
    gastos: '$12.4B',
    portal: 'Oficina de Gerencia y Presupuesto PR',
    urlPortal: 'https://www.ogp.pr.gov',
  },
  'donald-trump': {
    presupuesto: '$6.75T',
    deuda: '$36.2T',
    ingresos: '$4.92T',
    gastos: '$6.75T',
    portal: 'USASpending.gov — Tesoro Federal',
    urlPortal: 'https://www.usaspending.gov',
  },
  'claudia-sheinbaum': {
    presupuesto: '$9.7T MXN',
    deuda: '$14.2T MXN',
    ingresos: '$8.1T MXN',
    gastos: '$9.7T MXN',
    portal: 'Secretaría de Hacienda y Crédito Público',
    urlPortal: 'https://www.gob.mx/hacienda',
  },
  'pedro-sanchez': {
    presupuesto: '€501B',
    deuda: '€1.64T',
    ingresos: '€476B',
    gastos: '€501B',
    portal: 'Ministerio de Hacienda — España',
    urlPortal: 'https://www.hacienda.gob.es',
  },
}

const SPENDING_AREAS: Record<string, { area: string; pct: number; color: string }[]> = {
  'jenniffer-gonzalez-colon': [
    { area: 'Educación', pct: 25, color: 'bg-purple-500' },
    { area: 'Salud', pct: 18, color: 'bg-green-500' },
    { area: 'Infraestructura', pct: 22, color: 'bg-orange-500' },
    { area: 'Seguridad', pct: 10, color: 'bg-red-500' },
    { area: 'Deuda / Intereses', pct: 14, color: 'bg-gray-400' },
    { area: 'Otros', pct: 11, color: 'bg-blue-400' },
  ],
  'donald-trump': [
    { area: 'Seguridad Social', pct: 22, color: 'bg-blue-500' },
    { area: 'Medicare / Medicaid', pct: 27, color: 'bg-green-500' },
    { area: 'Defensa', pct: 15, color: 'bg-red-600' },
    { area: 'Intereses deuda', pct: 13, color: 'bg-gray-400' },
    { area: 'Educación', pct: 6, color: 'bg-purple-500' },
    { area: 'Otros', pct: 17, color: 'bg-amber-400' },
  ],
  'claudia-sheinbaum': [
    { area: 'Desarrollo social', pct: 28, color: 'bg-red-500' },
    { area: 'Educación', pct: 18, color: 'bg-purple-500' },
    { area: 'Salud', pct: 16, color: 'bg-green-500' },
    { area: 'Infraestructura', pct: 15, color: 'bg-orange-500' },
    { area: 'Deuda', pct: 12, color: 'bg-gray-400' },
    { area: 'Otros', pct: 11, color: 'bg-blue-400' },
  ],
  'pedro-sanchez': [
    { area: 'Pensiones y SS', pct: 30, color: 'bg-blue-500' },
    { area: 'Salud', pct: 15, color: 'bg-green-500' },
    { area: 'Educación', pct: 10, color: 'bg-purple-500' },
    { area: 'Deuda / Intereses', pct: 11, color: 'bg-gray-400' },
    { area: 'Infraestructura', pct: 12, color: 'bg-orange-500' },
    { area: 'Otros', pct: 22, color: 'bg-amber-400' },
  ],
}

export default function FinanzasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  const { oficial } = bundle

  const finance = FINANCE_SOURCES[params.slug] ?? FINANCE_SOURCES['donald-trump']
  const spending = SPENDING_AREAS[params.slug] ?? SPENDING_AREAS['donald-trump']
  const deficit = true // all have deficit

  return (
    <DynamicPageShell slug={params.slug} title="Finanzas Públicas" subtitle={`Datos fiscales oficiales — ${oficial.pais}`}>
      <div className="py-4 space-y-4">

        {/* Disclaimer */}
        <div className="mx-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-[10px] text-primary dark:text-blue-300 text-center font-medium">
            Datos presupuestarios oficiales. Fuente: {finance.portal}
          </p>
        </div>

        {/* Key figures */}
        <div>
          <h2 className="section-title px-4 mb-3">Cifras Clave del Presupuesto</h2>
          <div className="grid grid-cols-2 gap-2.5 px-4">
            {[
              { label: 'Presupuesto Total', value: finance.presupuesto, icon: Landmark, color: 'from-primary to-secondary', positive: null },
              { label: 'Deuda Pública', value: finance.deuda, icon: Receipt, color: 'from-red-500 to-red-700', positive: false },
              { label: 'Ingresos Fiscales', value: finance.ingresos, icon: TrendingUp, color: 'from-green-500 to-emerald-600', positive: true },
              { label: 'Gasto Público', value: finance.gastos, icon: TrendingDown, color: 'from-amber-500 to-orange-500', positive: null },
            ].map(({ label, value, icon: Icon, color, positive }) => (
              <div key={label} className="card p-3.5 overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br ${color} opacity-[0.07] -translate-y-4 translate-x-4`} />
                <div className="relative z-10">
                  <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                    <Icon size={13} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">{value}</p>
                  {positive === true && <p className="text-[9.5px] text-green-500 font-semibold mt-0.5">Año fiscal actual</p>}
                  {positive === false && <p className="text-[9.5px] text-red-500 font-semibold mt-0.5">Pendiente de pago</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending breakdown */}
        <div className="px-4">
          <h2 className="section-title mb-3">Distribución del Gasto</h2>
          <div className="card p-4">
            {/* Stacked bar */}
            <div className="flex rounded-lg overflow-hidden h-4 mb-4">
              {spending.map(({ area, pct, color }) => (
                <div key={area} className={`${color} h-full`} style={{ width: `${pct}%` }} title={`${area}: ${pct}%`} />
              ))}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {spending.map(({ area, pct, color }) => (
                <div key={area} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${color}`} />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300 font-medium truncate">{area}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 font-bold ml-auto shrink-0">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget balance */}
        <div className="px-4">
          <h2 className="section-title mb-3">Balance Fiscal</h2>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <TrendingDown size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-900 dark:text-white">Déficit presupuestario</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Gastos superan los ingresos</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Ingresos</span>
                <span className="font-bold text-green-600 dark:text-green-400">{finance.ingresos}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Gastos</span>
                <span className="font-bold text-red-600 dark:text-red-400">{finance.gastos}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between text-[11px]">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Balance</span>
                <span className="font-black text-red-600 dark:text-red-400">Déficit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source link */}
        <div className="px-4">
          <a href={finance.urlPortal} target="_blank" rel="noopener noreferrer"
            className="card p-3.5 flex items-center justify-between active:opacity-70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <DollarSign size={14} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900 dark:text-white">Datos completos</p>
                <p className="text-[9.5px] text-gray-400 dark:text-gray-600">{finance.portal}</p>
              </div>
            </div>
            <ExternalLink size={14} className="text-primary dark:text-secondary shrink-0" />
          </a>
        </div>

        <p className="text-center text-[9.5px] text-gray-400 dark:text-gray-600 px-4">
          Datos del año fiscal vigente · Fuentes oficiales del gobierno de {oficial.pais}
        </p>
      </div>
    </DynamicPageShell>
  )
}
