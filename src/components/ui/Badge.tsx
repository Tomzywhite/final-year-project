import * as React from 'react'
import { cn } from '@/lib/utils'
import { STATUS_COLOURS, STATUS_LABELS } from '@/lib/constants'
import type { RequestStatus } from '@/types'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: RequestStatus
}

export function Badge({ status, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLOURS[status],
        className
      )}
      {...props}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
