import { ShieldCheck, ShieldAlert, Clock, ShieldX } from 'lucide-react'
import type { VerificationStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const config: Record<VerificationStatus, { icon: React.ElementType; label: string; className: string }> = {
  verificado:              { icon: ShieldCheck, label: 'Verificado', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  parcialmente_verificado: { icon: ShieldAlert, label: 'Parcial',    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  pendiente:               { icon: Clock,       label: 'Pendiente',  className: 'bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400' },
  rechazado:               { icon: ShieldX,     label: 'Rechazado',  className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { icon: Icon, label, className } = config[status]
  return (
    <span className={cn('badge text-[9.5px]', className)}>
      <Icon size={9} strokeWidth={2.5} />
      {label}
    </span>
  )
}
