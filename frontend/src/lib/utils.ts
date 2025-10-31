import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge tailwind class names safely.
 * Usage: cn('p-2', condition && 'text-red-500')
 */
export function cn(...inputs: Array<any>) {
  return twMerge(clsx(...inputs))
}
