import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { THEME_STORAGE_KEY } from '@/components/theme/ThemeScript'

function getToggle() {
  return screen.getByRole('button', { name: /toggle dark mode/i })
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  it('renders an accessible toggle button', () => {
    render(<ThemeToggle />)
    expect(getToggle()).toBeInTheDocument()
  })

  it('adds the dark class to <html> on first click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(getToggle())

    expect(document.documentElement).toHaveClass('dark')
  })

  it('removes the dark class on a second click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(getToggle())
    await user.click(getToggle())

    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('persists the chosen theme so it survives a reload', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(getToggle())
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    await user.click(getToggle())
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('starts from the class already on <html> rather than assuming light', async () => {
    document.documentElement.classList.add('dark')
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(getToggle())

    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  // Both icons are always in the DOM and CSS picks between them off the .dark
  // class. That is what keeps the button correct on the very first paint —
  // holding the theme in React state would flicker or mismatch on hydration.
  it('renders both icons so the correct one shows without client state', () => {
    const { container } = render(<ThemeToggle />)
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(2)
    expect(container.querySelector('.dark\\:hidden')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:block')).toBeInTheDocument()
  })

  it('still toggles when localStorage writes are rejected', async () => {
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

    try {
      const user = userEvent.setup()
      render(<ThemeToggle />)

      await user.click(getToggle())

      expect(document.documentElement).toHaveClass('dark')
    } finally {
      setItem.mockRestore()
    }
  })

  it('forwards a custom className', () => {
    render(<ThemeToggle className="custom-class" />)
    expect(getToggle()).toHaveClass('custom-class')
  })
})
