'use client'

import { motion } from 'framer-motion'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
