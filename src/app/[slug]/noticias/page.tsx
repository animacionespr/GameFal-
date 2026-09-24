import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { NoticiasClient } from './NoticiasClient'

export function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function NoticiasPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  return (
    <DynamicPageShell slug={params.slug} title="Noticias Oficiales" subtitle="Cobertura de medios verificados">
      <NoticiasClient bundle={bundle} />
    </DynamicPageShell>
  )
}
