import { notFound } from 'next/navigation'
import { getOfficialBundle, OFFICIAL_SLUGS } from '@/lib/data/officials'
import { DynamicPageShell } from '@/components/layout/DynamicPageShell'
import { CronologiaClient } from './CronologiaClient'

export function generateStaticParams() {
  return OFFICIAL_SLUGS.map(slug => ({ slug }))
}

interface Props { params: { slug: string } }

export default function CronologiaPage({ params }: Props) {
  const bundle = getOfficialBundle(params.slug)
  if (!bundle) notFound()
  return (
    <DynamicPageShell slug={params.slug} title="Cronología" subtitle="Historial de acciones de gobierno">
      <CronologiaClient bundle={bundle} />
    </DynamicPageShell>
  )
}
