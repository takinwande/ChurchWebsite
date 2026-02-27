'use client'

import { motion } from 'framer-motion'
import { useReducedMotionContext } from './ReducedMotionProvider'

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
