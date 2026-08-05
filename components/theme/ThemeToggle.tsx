'use client'

import { useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THEME_STORAGE_KEY } from './ThemeScript'

interface ThemeToggleProps {
  className?: string
}

/**
 * Reads and writes the theme directly from the DOM rather than React state.
 *
 * The active theme is only knowable in the browser — the server cannot render
 * it — so holding it in state would either mismatch during hydration or force a
 * post-mount flicker. Instead the icons are always both rendered and CSS picks
 * which one is visible off the `.dark` class, making the button correct on the
 * very first paint.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const toggle = useCallback(() => {
    const isDark = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
    } catch {
      /* Private mode can reject writes; the toggle still applies for this page. */
    }
  }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={cn(
        'rounded-md p-2 text-foreground transition-colors hover:bg-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  )
}
