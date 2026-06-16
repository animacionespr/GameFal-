import { ShieldCheck, ShieldAlert, Clock, ShieldX } from 'lucide-react'
import type { VerificationStatus } from '@/lib/types'
import { getVerificationLabel, getVerificationColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

const icons: Record<VerificationStatus, React.ElementType> = {
  verificado: ShieldCheck,
  parcialmente_verificado: ShieldAlert,
  pendiente: Clock,
  rechazado: ShieldX,
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const Icon = icons[status]
  return (
    <span className={cn('badge gap-1', getVerificationColor(status))}>
      <Icon size={10} />
      {getVerificationLabel(status)}
    </span>
  )
}
