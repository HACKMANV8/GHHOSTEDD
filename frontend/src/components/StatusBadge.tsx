// components/StatusBadge.tsx
import React from 'react'

type Status = 'OPERATIONAL' | 'WARNING' | 'DANGER'

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClasses = ''

  switch (status) {
    case 'OPERATIONAL':
      colorClasses = 'bg-green-500/20 text-green-300 border-green-500/50'
      break
    case 'WARNING':
      colorClasses = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      break
    case 'DANGER':
      colorClasses = 'bg-red-500/20 text-red-300 border-red-500/50'
      break
  }

  return (
    <span
      className={`px-2 py-0.5 text-xs font-mono font-bold rounded-full border ${colorClasses}`}
    >
      {status}
    </span>
  )
}