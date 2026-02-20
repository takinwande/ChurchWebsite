import '@testing-library/jest-dom'

// Only set up browser-specific globals in jsdom environments
if (typeof window !== 'undefined') {
  // Suppress Radix UI / jsdom pointer event warnings
  window.PointerEvent = MouseEvent as unknown as typeof PointerEvent

  // Mock matchMedia (required by Next.js internals)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock IntersectionObserver (required by Radix Sheet/Dialog)
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

// Mock ResizeObserver (required by Radix components)
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver
