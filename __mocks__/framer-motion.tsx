import React from 'react'

type AnyProps = {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

export const motion = new Proxy({} as Record<string, React.FC<AnyProps>>, {
  get: (_target, tag: string) =>
    ({ children, className }: AnyProps) =>
      React.createElement(tag, { className }, children),
})

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const useScroll = () => ({
  scrollY: { get: () => 0, onChange: jest.fn() },
})

export const useMotionValueEvent = jest.fn()

export const useReducedMotion = jest.fn(() => false)
