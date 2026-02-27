'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

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
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={hoverSupported ? { y: -7 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
