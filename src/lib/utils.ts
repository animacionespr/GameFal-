import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PromiseStatus, VerificationStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-PR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-PR', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getPromiseStatusLabel(status: PromiseStatus): string {
  const labels: Record<PromiseStatus, string> = {
    completada: 'Completada',
    en_progreso: 'En Progreso',
    parcialmente_completada: 'Parcialmente Completada',
    retrasada: 'Retrasada',
    cancelada: 'Cancelada',
    desconocida: 'Desconocida',
  }
  return labels[status]
}

export function getPromiseStatusColor(status: PromiseStatus): string {
  const colors: Record<PromiseStatus, string> = {
    completada: 'text-success bg-green-100 dark:bg-green-900/30',
    en_progreso: 'text-secondary bg-blue-100 dark:bg-blue-900/30',
    parcialmente_completada: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    retrasada: 'text-warning bg-amber-100 dark:bg-amber-900/30',
    cancelada: 'text-danger bg-red-100 dark:bg-red-900/30',
    desconocida: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
  }
  return colors[status]
}

export function getVerificationLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    verificado: 'Verificado',
    parcialmente_verificado: 'Parcial',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado',
  }
  return labels[status]
}

export function getVerificationColor(status: VerificationStatus): string {
  const colors: Record<VerificationStatus, string> = {
    verificado: 'text-success bg-green-100 dark:bg-green-900/30',
    parcialmente_verificado: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    pendiente: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    rechazado: 'text-danger bg-red-100 dark:bg-red-900/30',
  }
  return colors[status]
}

export function getEventCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    orden_ejecutiva: 'Orden Ejecutiva',
    proyecto_iniciado: 'Proyecto Iniciado',
    proyecto_completado: 'Proyecto Completado',
    presupuesto: 'Presupuesto',
    infraestructura: 'Infraestructura',
    ley_firmada: 'Ley Firmada',
    emergencia: 'Emergencia',
    evento_publico: 'Evento Público',
    anuncio: 'Anuncio',
    nombramiento: 'Nombramiento',
  }
  return labels[cat] || cat
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-PR').format(n)
}
