import { useEffect, useState } from 'react'

export interface LiveNewsItem {
  titulo: string
  resumen: string
  urlFuente: string
  fecha: string
  fuente?: string
  categoria?: string
  agencia?: string
  etiquetas?: string[]
}

export interface LiveUpdates {
  ultimaActualizacion: string
  noticias: LiveNewsItem[]
  estadisticas: {
    desempleo?: { valor: number; fecha: string }
  }
  fuentesActivas: boolean
}

export function useLiveData() {
  const [data, setData] = useState<LiveUpdates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${base}/data/updates.json`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then(r => r.json())
      .then((d: LiveUpdates) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
