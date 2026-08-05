import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { usePathname } from 'next/navigation'

const mockUsePathname = usePathname as jest.Mock

function openMenu() {
  return screen.getByRole('button', { name: /open navigation menu/i })
}

describe('MobileMenu', () => {
  beforeAll(() => {
    // jsdom logs "Not implemented: navigation" whenever an <a href> is clicked.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  describe('trigger', () => {
    it('renders an accessible trigger button', () => {
      render(<MobileMenu />)
      expect(openMenu()).toBeInTheDocument()
    })

    // Guards against replacing SheetTrigger with a bare <button>, which drops
    // the ARIA wiring and focus-return-on-close that Radix provides.
    it('keeps the Radix trigger wiring rather than a bare button', () => {
      render(<MobileMenu />)
      const trigger = openMenu()
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger).toHaveAttribute('data-state', 'closed')
    })

    it('reflects the open state on the trigger', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      // Hold the node: once the sheet opens Radix marks the background
      // aria-hidden, so the trigger is no longer reachable by role.
      const trigger = openMenu()
      await user.click(trigger)
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    })
  })

  describe('when opened', () => {
    it('is closed initially', () => {
      render(<MobileMenu />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens on trigger click', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })

    it('renders every navigation link with the right href', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())

      const expected: [string, string][] = [
        ['Home', '/'],
        ['Plan a Visit', '/plan-a-visit'],
        ['Sermons', '/sermons'],
        ['Events', '/events'],
        ['About', '/about'],
        ['Ministries', '/ministries'],
        ['Gallery', '/gallery'],
        ['Prayer', '/prayer'],
        ['Contact', '/contact'],
      ]

      for (const [label, href] of expected) {
        expect(await screen.findByRole('link', { name: label })).toHaveAttribute('href', href)
      }
    })

    it('renders the Give link', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())
      expect(await screen.findByRole('link', { name: 'Give' })).toHaveAttribute('href', '/give')
    })

    it('highlights the link matching the current pathname', async () => {
      mockUsePathname.mockReturnValue('/sermons')
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())

      expect(await screen.findByRole('link', { name: 'Sermons' })).toHaveClass('font-semibold')
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('font-semibold')
    })
  })

  describe('navigation', () => {
    // Regression: wrapping next/link in SheetClose raced Radix's close-and-unmount
    // against client-side navigation, dropping taps intermittently on mobile.
    it('closes the menu when a navigation link is clicked', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())

      await user.click(await screen.findByRole('link', { name: 'Sermons' }))

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('closes the menu when the Give link is clicked', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())

      await user.click(await screen.findByRole('link', { name: 'Give' }))

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    // If anything swallows the anchor's default action the browser never
    // navigates, which is the failure this whole fix exists to prevent.
    it('leaves the link default action intact so navigation still happens', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)
      await user.click(openMenu())

      const link = await screen.findByRole('link', { name: 'Sermons' })
      let defaultPrevented: boolean | undefined
      link.addEventListener('click', (e) => {
        defaultPrevented = e.defaultPrevented
        e.preventDefault() // stop jsdom from attempting a real navigation
      })

      await user.click(link)
      expect(defaultPrevented).toBe(false)
    })

    it('reopens cleanly after navigating', async () => {
      const user = userEvent.setup()
      render(<MobileMenu />)

      await user.click(openMenu())
      await user.click(await screen.findByRole('link', { name: 'Sermons' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

      await user.click(openMenu())
      expect(await screen.findByRole('dialog')).toBeInTheDocument()
    })
  })
})
