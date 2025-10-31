"use client"
import { useEffect } from 'react'

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center h-56">
      <div className="text-red-400">Something went wrong — {error.message}</div>
    </div>
  )
}
