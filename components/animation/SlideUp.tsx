'use client'

import { motion } from 'framer-motion'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface SlideUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
}

export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.45,
  distance = 18,
}: SlideUpProps) {
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
