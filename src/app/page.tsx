import Image from 'next/image'
import Link from 'next/link'
import { ALL_OFFICIALS } from '@/lib/data/officials'
import { Globe, Shield, TrendingUp, ChevronRight, Search } from 'lucide-react'

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <span className={`${color} text-white text-[10px] font-black px-2 py-0.5 rounded-full tabular-nums`}>
      {score}
    </span>
  )
}

export default function DirectoryPage() {
  const americaOfficials = ALL_OFFICIALS.filter(b =>
    ['Puerto Rico', 'Estados Unidos', 'México'].includes(b.oficial.pais)
  )
  const europeOfficials = ALL_OFFICIALS.filter(b =>
    ['España'].includes(b.oficial.pais)
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }}>

      {/* Hero */}
      <div className="gradient-hero px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">GovTracker</span>
          </div>
          <h1 className="text-white text-[26px] font-black leading-tight mb-2">
            Rastreador de<br />Gobernantes
          </h1>
          <p className="text-white/70 text-[12px] font-medium mb-4">
            Datos reales · Solo fuentes oficiales · Actualización automática
          </p>
          <div className="flex items-center gap-1.5 justify-center bg-white/10 rounded-xl px-3 py-2 w-fit mx-auto">
            <Shield size={10} className="text-green-400" />
            <span className="text-white/80 text-[10px] font-semibold">
              {ALL_OFFICIALS.length} gobernantes rastreados en {new Set(ALL_OFFICIALS.map(b => b.oficial.pais)).size} países
            </span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex divide-x divide-gray-100 dark:divide-gray-800 max-w-lg mx-auto">
          {[
            { label: 'Gobernantes', value: ALL_OFFICIALS.length },
            { label: 'Promesas tracked', value: ALL_OFFICIALS.reduce((a, b) => a + b.oficial.promesasTotal, 0) },
            { label: 'Países', value: new Set(ALL_OFFICIALS.map(b => b.oficial.pais)).size },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 text-center py-3">
              <p className="text-[18px] font-black text-gray-900 dark:text-white">{value}</p>
              <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8">

        {/* América */}
        <div className="mt-6 mb-2">
          <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
            🌎 América
          </h2>
        </div>
        <div className="space-y-3">
          {americaOfficials.map((bundle, i) => {
            const { oficial } = bundle
            const promesasPct = Math.round((oficial.promesasCompletadas / oficial.promesasTotal) * 100)
            return (
              <Link
                key={oficial.slug}
                href={`/${oficial.slug}/`}
                className={`card p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform fade-up stagger-${i + 1}`}
              >
                {/* Photo */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700 shrink-0">
                  <Image src={oficial.foto} alt={oficial.nombre} fill className="object-cover object-top" sizes="56px" />
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-tl-lg px-1 text-[11px]">
                    {oficial.bandera}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                      {oficial.nombre}
                    </p>
                    <ScoreBadge score={oficial.puntajeRendimiento} />
                  </div>
                  <p className="text-[10.5px] text-gray-500 dark:text-gray-400 font-medium truncate mb-1.5">
                    {oficial.cargo}
                  </p>
                  {/* Mini progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${promesasPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 font-semibold tabular-nums shrink-0">
                      {oficial.promesasCompletadas}/{oficial.promesasTotal} promesas
                    </span>
                  </div>
                </div>

                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
              </Link>
            )
          })}
        </div>

        {/* Europa */}
        {europeOfficials.length > 0 && (
          <>
            <div className="mt-6 mb-2">
              <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
                🌍 Europa
              </h2>
            </div>
            <div className="space-y-3">
              {europeOfficials.map((bundle, i) => {
                const { oficial } = bundle
                const promesasPct = Math.round((oficial.promesasCompletadas / oficial.promesasTotal) * 100)
                return (
                  <Link
                    key={oficial.slug}
                    href={`/${oficial.slug}/`}
                    className={`card p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform fade-up stagger-${i + 1}`}
                  >
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700 shrink-0">
                      <Image src={oficial.foto} alt={oficial.nombre} fill className="object-cover object-top" sizes="56px" />
                      <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-tl-lg px-1 text-[11px]">
                        {oficial.bandera}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                          {oficial.nombre}
                        </p>
                        <ScoreBadge score={oficial.puntajeRendimiento} />
                      </div>
                      <p className="text-[10.5px] text-gray-500 dark:text-gray-400 font-medium truncate mb-1.5">
                        {oficial.cargo}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            style={{ width: `${promesasPct}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 dark:text-gray-600 font-semibold tabular-nums shrink-0">
                          {oficial.promesasCompletadas}/{oficial.promesasTotal} promesas
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Coming soon */}
        <div className="mt-6 mb-2">
          <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
            🔜 Próximamente
          </h2>
        </div>
        <div className="space-y-2">
          {[
            { nombre: 'Javier Milei', cargo: 'Presidente de Argentina', bandera: '🇦🇷' },
            { nombre: 'Lula da Silva', cargo: 'Presidente de Brasil', bandera: '🇧🇷' },
            { nombre: 'Gabriel Boric', cargo: 'Presidente de Chile', bandera: '🇨🇱' },
          ].map(item => (
            <div key={item.nombre} className="card p-3.5 flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl shrink-0">
                {item.bandera}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-300">{item.nombre}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600">{item.cargo}</p>
              </div>
              <span className="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                Pronto
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-[9.5px] text-gray-400 dark:text-gray-600 mt-6">
          GovTracker · Datos de fuentes gubernamentales oficiales · Actualización 3x/día
        </p>
      </div>
    </div>
  )
}
