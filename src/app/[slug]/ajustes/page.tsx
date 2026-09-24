import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS, ALL_OFFICIALS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { AjustesClient } from './AjustesClient'

export function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function AjustesPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()

  return (
    <DynamicPageShell slug={params.slug} title="Ajustes" subtitle="Preferencias y configuración">
      <AjustesClient bundle={bundle} allOfficials={ALL_OFFICIALS} />
    </DynamicPageShell>
  )
}
