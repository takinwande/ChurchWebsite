import React from 'react'

type AnyProps = {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

const elementProxy = new Proxy({} as Record<string, React.FC<AnyProps>>, {
  get: (_target, tag: string) =>
    ({ children, className }: AnyProps) =>
      React.createElement(tag, { className }, children),
})

export const motion = elementProxy
export const m = elementProxy

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const LazyMotion = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const domAnimation = {}

export const useScroll = () => ({
  scrollY: { get: () => 0, onChange: jest.fn() },
})

export const useMotionValueEvent = jest.fn()

export const useReducedMotion = jest.fn(() => false)
