'use client'

import { m, LazyMotion, domAnimation } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReducedMotionProvider, useReducedMotionContext } from '@/components/animation/ReducedMotionProvider'

function PageContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotionContext()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <m.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <ReducedMotionProvider>
        <PageContent>{children}</PageContent>
      </ReducedMotionProvider>
    </LazyMotion>
  )
}
