'use client'

import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

/**
 * Passes the grid cell's height through to the card inside.
 *
 * This wrapper sits between a stretched grid item and a card that sets
 * `h-full`. As a plain block element its own height is `auto`, so the card's
 * `h-full` resolved against content height rather than the row — leaving cards
 * in the same row visibly different heights depending on whether they happened
 * to have a badge or a location line.
 */
const FILL = 'h-full'

function useHoverSupported() {
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    setSupported(window.matchMedia('(hover: hover)').matches)
  }, [])
  return supported
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  const reduced = useReducedMotionContext()
  const hoverSupported = useHoverSupported()

  if (reduced) {
    return <div className={cn(FILL, className)}>{children}</div>
  }

  return (
    <m.div
      className={cn(FILL, className)}
      whileHover={hoverSupported ? { y: -7 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
