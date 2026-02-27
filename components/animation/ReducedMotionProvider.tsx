'use client'

import { createContext, useContext } from 'react'
import { useReducedMotion } from 'framer-motion'

const ReducedMotionContext = createContext(false)

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion ?? false}>
      {children}
    </ReducedMotionContext.Provider>
  )
}

export function useReducedMotionContext() {
  return useContext(ReducedMotionContext)
}
