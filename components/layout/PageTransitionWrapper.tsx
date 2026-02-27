'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReducedMotionProvider, useReducedMotionContext } from '@/components/animation/ReducedMotionProvider'

function PageContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionProvider>
      <PageContent>{children}</PageContent>
    </ReducedMotionProvider>
  )
}
