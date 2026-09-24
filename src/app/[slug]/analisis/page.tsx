import { notFound } from 'next/navigation'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { CheckCircle2, AlertTriangle, TrendingUp, BookOpen, ExternalLink, Sparkles, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export async function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function AnalisisPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()

  const insight = bundle.insights

  return (
    <DynamicPageShell slug={params.slug} title="Análisis con IA" subtitle="Síntesis de datos oficiales verificados">
      <div className="space-y-4 py-4">
        {/* AI disclaimer */}
        <div className="mx-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-primary dark:text-secondary" />
            <p className="text-xs font-bold text-primary dark:text-secondary">Motor de Análisis Oficial</p>
          </div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
            Este análisis fue generado a partir exclusivamente de datos oficiales verificados. La IA no emite
            opiniones políticas, no especula sobre intenciones y no presenta predicciones. Solo resume hechos
            documentados con fuentes citadas. No se incluyen predicciones.
          </p>
        </div>

        {/* Summary card */}
        <div className="mx-4 card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 mb-1.5">
                Resumen {insight.tipo.charAt(0).toUpperCase() + insight.tipo.slice(1)}
              </span>
              <h2 className="text-base font-black text-gray-900 dark:text-white">{insight.titulo}</h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar size={10} />
              {formatDate(insight.fechaGeneracion)}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{insight.resumen}</p>
        </div>

        {/* Achievements */}
        <div className="mx-4 card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-success" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Logros Documentados</h3>
          </div>
          <div className="space-y-2.5">
            {insight.logros.map((logro, i) => {
              const parts = logro.split('(Fuente:')
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-success">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{parts[0].trim()}</p>
                    {parts[1] && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Fuente: {parts[1].replace(')', '').trim()}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Challenges */}
        <div className="mx-4 card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle size={14} className="text-warning" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Desafíos Identificados</h3>
          </div>
          <div className="space-y-2.5">
            {insight.desafios.map((desafio, i) => {
              const parts = desafio.split('(Fuente:')
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-warning">!</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{parts[0].trim()}</p>
                    {parts[1] && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Fuente: {parts[1].replace(')', '').trim()}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trends */}
        <div className="mx-4 card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp size={14} className="text-secondary" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Tendencias Detectadas</h3>
          </div>
          <div className="space-y-2">
            {insight.tendencias.map((tendencia, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-secondary text-xs font-bold shrink-0 mt-0.5">→</span>
                <p className="text-xs text-gray-700 dark:text-gray-300">{tendencia}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy analysis */}
        <div className="mx-4 card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BookOpen size={14} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Análisis de Políticas</h3>
          </div>
          <div className="space-y-2">
            {insight.analisisPoliticas.map((analisis, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-purple-500 text-xs mt-0.5 shrink-0">▪</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{analisis}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="mx-4 card p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Fuentes Utilizadas</h3>
          <div className="flex flex-wrap gap-2">
            {insight.fuentes.map((fuente, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">
                <ExternalLink size={8} /> {fuente}
              </span>
            ))}
          </div>
        </div>

        {/* AI limitations notice */}
        <div className="mx-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            <strong>Nota:</strong> El análisis de IA distingue entre hechos, estadísticas y declaraciones oficiales.
            No se incluyen predicciones ni especulaciones. Las predicciones están explícitamente prohibidas en esta plataforma.
            Todo análisis es verificable en las fuentes citadas.
          </p>
        </div>
      </div>
    </DynamicPageShell>
  )
}
