'use client'

import { motion } from 'framer-motion'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delayStart?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.14,
  delayStart = 0,
}: StaggerContainerProps) {
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
