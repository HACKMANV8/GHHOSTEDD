// components/Card.tsx
import React from 'react'
import { cn } from '../lib/utils'

// --- 1. Card Component ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      bg-stone-900/60 backdrop-blur-sm 
      border border-green-600/30 rounded-lg 
      shadow-lg shadow-green-950/20
      `,
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

// --- 2. CardHeader Component ---
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 p-4 border-b border-green-600/30',
      className
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

// --- 3. CardTitle Component ---
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-semibold text-lg text-[color:var(--accent-green)]', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

// --- 4. CardContent Component ---
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 text-sm', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }