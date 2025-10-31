import React from 'react'

export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-t-green-300 border-slate-700"
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}
