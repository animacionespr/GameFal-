import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { EstadisticasClient } from './EstadisticasClient'

export function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function EstadisticasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  return (
    <DynamicPageShell slug={params.slug} title="Estadísticas Oficiales" subtitle="Datos de agencias gubernamentales">
      <EstadisticasClient bundle={bundle} />
    </DynamicPageShell>
  )
}
