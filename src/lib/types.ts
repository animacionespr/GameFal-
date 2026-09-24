export type VerificationStatus = 'verificado' | 'parcialmente_verificado' | 'pendiente' | 'rechazado'

export type PromiseStatus =
  | 'completada'
  | 'en_progreso'
  | 'parcialmente_completada'
  | 'retrasada'
  | 'cancelada'
  | 'desconocida'

export type EventCategory =
  | 'orden_ejecutiva'
  | 'proyecto_iniciado'
  | 'proyecto_completado'
  | 'presupuesto'
  | 'infraestructura'
  | 'ley_firmada'
  | 'emergencia'
  | 'evento_publico'
  | 'anuncio'
  | 'nombramiento'

export interface Official {
  id: string
  slug: string
  nombre: string
  cargo: string
  partido: string
  pais: string
  bandera: string
  fechaInicio: string
  finMandato: string
  foto: string
  fotoSources?: string[]
  biografia: string
  sitioWeb: string
  contacto: string
  administracion: string
  puntajeRendimiento: number
  promesasTotal: number
  promesasCompletadas: number
  promesasEnProgreso: number
  promesasRetrasadas: number
}

export interface OfficialBundle {
  oficial: Official
  promesas: Promise[]
  eventos: TimelineEvent[]
  estadisticas: Statistic[]
  noticias: NewsItem[]
  insights: AIInsight
}

export interface Promise {
  id: string
  titulo: string
  descripcion: string
  fechaAnuncio: string
  fuente: string
  urlFuente: string
  categoria: string
  estado: PromiseStatus
  progreso: number
  evidencia: string[]
  nivelVerificacion: VerificationStatus
  impacto: string
}

export interface TimelineEvent {
  id: string
  fecha: string
  categoria: EventCategory
  titulo: string
  resumen: string
  fuente: string
  urlFuente: string
  evidencia: string
  puntuacionImpacto: number
  verificacion: VerificationStatus
}

export interface Statistic {
  id: string
  categoria: string
  nombre: string
  valor: number
  unidad: string
  variacion: number
  tendencia: 'subida' | 'bajada' | 'estable'
  fuente: string
  fechaActualizacion: string
  historial: { fecha: string; valor: number }[]
}

export interface NewsItem {
  id: string
  titulo: string
  resumen: string
  contenido: string
  fuente: string
  urlFuente: string
  fecha: string
  categoria: string
  agencia: string
  verificacion: VerificationStatus
  etiquetas: string[]
}

export interface AIInsight {
  id: string
  tipo: 'semanal' | 'mensual' | 'trimestral' | 'anual'
  titulo: string
  resumen: string
  logros: string[]
  desafios: string[]
  tendencias: string[]
  analisisPoliticas: string[]
  fuentes: string[]
  fechaGeneracion: string
}

export interface ApprovalPoll {
  id: string
  firma: string
  fechaPublicacion: string           // YYYY-MM
  fechaTrabajoCampo: string          // human-readable span
  muestra: number
  margenError: number | null
  tipo: 'imagen' | 'gestion'         // image/perception vs management approval
  aprueba: number                    // %
  desaprueba: number                 // %
  neutro: number                     // %
  desglosePorPartido?: {
    pnp?: { aprueba: number; desaprueba: number; neutro: number }
    ppd?: { aprueba: number; desaprueba: number; neutro: number }
    pip?: { aprueba: number; desaprueba: number; neutro: number }
  }
  notaGestion?: { buena: number; regular: number; mala: number }  // A/B / C / D/F
  fuente: string
  urlFuente: string
  metodologia: string
  notas?: string
}
