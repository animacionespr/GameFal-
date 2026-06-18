#!/usr/bin/env node
/**
 * Script de actualización automática de datos
 * Ejecutado por GitHub Actions 2x/día (7am y 7pm hora PR)
 *
 * Fuentes oficiales:
 *   - La Fortaleza: estado.pr.gov/es/comunicados
 *   - DTRH: trabajo.pr.gov (tasa de desempleo)
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '../public/data')
const OUTPUT = join(OUTPUT_DIR, 'updates.json')

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchPage(url, timeout = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GobTrackerPR/1.0)',
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-PR,es;q=0.9,en;q=0.8',
      },
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

function clean(str) {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú').replace(/&Ntilde;/g, 'Ñ')
    .replace(/\s+/g, ' ').trim()
}

const MESES = {
  enero: '01', febrero: '02', marzo: '03', abril: '04',
  mayo: '05', junio: '06', julio: '07', agosto: '08',
  septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
}

function parseSpanishDate(text) {
  const m = text.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})/i)
  if (!m) return null
  return `${m[3]}-${MESES[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`
}

function resolveUrl(href, base) {
  if (!href) return base
  if (href.startsWith('http')) return href
  if (href.startsWith('/')) return `https://www.estado.pr.gov${href}`
  return `${base}/${href}`
}

// ── Fuentes de noticias ───────────────────────────────────────────────────────

async function fetchFortalezaNews() {
  const urls = [
    'https://www.estado.pr.gov/es/comunicados/',
    'https://www.estado.pr.gov/comunicados/',
  ]

  for (const url of urls) {
    try {
      console.log(`  → Fetching ${url}`)
      const html = await fetchPage(url)
      const items = []

      // Attempt 1: <article> blocks with linked heading
      const articles = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)]
      for (const [, block] of articles.slice(0, 15)) {
        const link = block.match(/<a[^>]+href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/i)
        if (!link) continue
        const titulo = clean(link[2])
        if (titulo.length < 15) continue
        const href = resolveUrl(link[1], 'https://www.estado.pr.gov')
        const fecha = parseSpanishDate(block) || new Date().toISOString().split('T')[0]
        const summaryMatch = block.match(/<p[^>]*>([\s\S]{20,300}?)<\/p>/i)
        const resumen = summaryMatch ? clean(summaryMatch[1]) : titulo
        items.push({ titulo, resumen, urlFuente: href, fecha })
      }

      if (items.length > 0) {
        console.log(`  ✅ La Fortaleza: ${items.length} comunicados (article mode)`)
        return items.slice(0, 12)
      }

      // Attempt 2: headings inside any container with links
      const headings = [...html.matchAll(/<h[2-4][^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h[2-4]>/gi)]
      for (const [, href, rawTitle] of headings.slice(0, 15)) {
        const titulo = clean(rawTitle)
        if (titulo.length < 15) continue
        items.push({
          titulo,
          resumen: titulo,
          urlFuente: resolveUrl(href, 'https://www.estado.pr.gov'),
          fecha: new Date().toISOString().split('T')[0],
        })
      }

      if (items.length > 0) {
        console.log(`  ✅ La Fortaleza: ${items.length} comunicados (heading mode)`)
        return items.slice(0, 12)
      }

      console.log(`  ⚠️  ${url} — no se encontraron comunicados`)
    } catch (e) {
      console.warn(`  ⚠️  ${url} falló: ${e.message}`)
    }
  }

  return []
}

// ── Estadísticas ──────────────────────────────────────────────────────────────

async function fetchUnemploymentRate() {
  const urls = [
    'https://estadisticas.pr/es/inventario-de-estadisticas/tabla/5',
    'https://www.trabajo.pr.gov/',
  ]

  for (const url of urls) {
    try {
      console.log(`  → Fetching desempleo: ${url}`)
      const html = await fetchPage(url)

      for (const pattern of [
        /tasa de desempleo[^:]*:\s*([\d.]+)\s*%/gi,
        /desempleo[^:]*:\s*([\d.]+)\s*%/gi,
        /([\d.]+)\s*%[^<]*(?:desempleo|unemployment)/gi,
      ]) {
        const m = pattern.exec(html)
        if (m) {
          const rate = parseFloat(m[1])
          if (rate >= 2 && rate <= 25) {
            console.log(`  ✅ Desempleo: ${rate}%`)
            return { valor: rate, fecha: new Date().toISOString().split('T')[0] }
          }
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Desempleo fetch ${url} falló: ${e.message}`)
    }
  }

  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Actualización de datos — ' + new Date().toISOString())

  // Cargar datos anteriores para fallback
  let prev = { noticias: [], estadisticas: {} }
  try { prev = JSON.parse(readFileSync(OUTPUT, 'utf-8')) } catch {}

  console.log('\n📰 Buscando comunicados oficiales...')
  const noticias = await fetchFortalezaNews()

  console.log('\n📊 Buscando estadísticas...')
  const desempleo = await fetchUnemploymentRate()

  const estadisticas = {
    ...prev.estadisticas,
    ...(desempleo ? { desempleo } : {}),
  }

  const output = {
    ultimaActualizacion: new Date().toISOString(),
    noticias: noticias.length > 0 ? noticias : prev.noticias,
    estadisticas,
    fuentesActivas: noticias.length > 0,
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2))

  console.log(`\n✅ Completado:`)
  console.log(`   📰 Noticias: ${output.noticias.length} (${noticias.length > 0 ? 'en vivo' : 'caché'})`)
  console.log(`   📊 Desempleo: ${desempleo ? desempleo.valor + '%' : 'sin actualización'}`)
  console.log(`   🕐 ${output.ultimaActualizacion}`)
}

main().catch(e => {
  console.error('❌ Error crítico:', e.message)
  process.exit(0) // No fallar el build
})
