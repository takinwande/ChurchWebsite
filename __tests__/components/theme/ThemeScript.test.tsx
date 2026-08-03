import React from 'react'
import { render } from '@testing-library/react'
import { ThemeScript, THEME_STORAGE_KEY } from '@/components/theme/ThemeScript'

/** Pulls the inline source out of the rendered <script> and runs it. */
function runThemeScript() {
  const { container } = render(<ThemeScript />)
  const script = container.querySelector('script')
  // eslint-disable-next-line no-eval
  eval(script!.innerHTML)
}

function mockPrefersDark(matches: boolean) {
  ;(window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('ThemeScript', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    mockPrefersDark(false)
  })

  it('renders an inline script', () => {
    const { container } = render(<ThemeScript />)
    expect(container.querySelector('script')?.innerHTML).toBeTruthy()
  })

  describe('a stored preference wins over the system setting', () => {
    it('applies dark when dark is stored', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'dark')
      mockPrefersDark(false)
      runThemeScript()
      expect(document.documentElement).toHaveClass('dark')
    })

    it('stays light when light is stored, even if the system prefers dark', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'light')
      mockPrefersDark(true)
      runThemeScript()
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  describe('with no stored preference it follows the system', () => {
    it('applies dark when the system prefers dark', () => {
      mockPrefersDark(true)
      runThemeScript()
      expect(document.documentElement).toHaveClass('dark')
    })

    it('stays light when the system prefers light', () => {
      mockPrefersDark(false)
      runThemeScript()
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  it('falls back to light when localStorage access throws', () => {
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    try {
      expect(() => runThemeScript()).not.toThrow()
      expect(document.documentElement).not.toHaveClass('dark')
    } finally {
      getItem.mockRestore()
    }
  })
})
