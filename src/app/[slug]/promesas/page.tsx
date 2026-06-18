import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { PromesasClient } from './PromesasClient'

export function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function PromesasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  return (
    <DynamicPageShell slug={params.slug} title="Rastreador de Promesas" subtitle="Compromisos públicos verificados">
      <PromesasClient bundle={bundle} />
    </DynamicPageShell>
  )
}
