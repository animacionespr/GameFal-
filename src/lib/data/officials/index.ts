import type { OfficialBundle } from '@/lib/types'
import { prBundle } from '@/lib/data/oficial-pr'
import { officialBundle as trumpBundle } from './donald-trump'
import { officialBundle as sheinbaumBundle } from './claudia-sheinbaum'
import { officialBundle as sanchezBundle } from './pedro-sanchez'

export const ALL_OFFICIALS: OfficialBundle[] = [
  prBundle,
  trumpBundle,
  sheinbaumBundle,
  sanchezBundle,
]

export const OFFICIAL_SLUGS = ALL_OFFICIALS.map(b => b.oficial.slug)

export function getOfficialBundle(slug: string): OfficialBundle | null {
  return ALL_OFFICIALS.find(b => b.oficial.slug === slug) ?? null
}

// Grouped by continent for the directory
export const OFFICIALS_BY_REGION = {
  'América': ALL_OFFICIALS.filter(b =>
    ['Puerto Rico', 'Estados Unidos', 'México'].includes(b.oficial.pais)
  ),
  'Europa': ALL_OFFICIALS.filter(b =>
    ['España', 'Francia', 'Alemania', 'Italia', 'Portugal'].includes(b.oficial.pais)
  ),
  'Resto': ALL_OFFICIALS.filter(b =>
    !['Puerto Rico', 'Estados Unidos', 'México', 'España', 'Francia', 'Alemania', 'Italia', 'Portugal'].includes(b.oficial.pais)
  ),
}
