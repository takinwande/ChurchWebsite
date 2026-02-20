import React from 'react'
import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'
import { usePathname } from 'next/navigation'

// Mock MobileMenu to avoid Radix Sheet/portal complexity in Navbar tests
jest.mock('@/components/layout/MobileMenu', () => ({
  MobileMenu: () => <div data-testid="mobile-menu-mock" />,
}))

const mockUsePathname = usePathname as jest.Mock

describe('Navbar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('renders the RCCG logo/brand link pointing to /', () => {
    render(<Navbar />)
    const logoLink = screen.getByRole('link', { name: /rccg/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders all desktop navigation links', () => {
    render(<Navbar />)
    const labels = ['Home', 'Plan a Visit', 'Sermons', 'Events', 'About', 'Contact']
    labels.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })

  it('renders the "Give" button link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Give' })).toBeInTheDocument()
  })

  it('highlights the "/" link as active when pathname is "/"', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Navbar />)
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('font-semibold')
  })

  it('highlights the "/sermons" link as active when pathname is "/sermons"', () => {
    mockUsePathname.mockReturnValue('/sermons')
    render(<Navbar />)
    const sermonsLink = screen.getByRole('link', { name: 'Sermons' })
    expect(sermonsLink).toHaveClass('font-semibold')
  })

  it('does not apply active class to non-current links', () => {
    mockUsePathname.mockReturnValue('/sermons')
    render(<Navbar />)
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).not.toHaveClass('font-semibold')
  })

  it('renders the MobileMenu component', () => {
    render(<Navbar />)
    expect(screen.getByTestId('mobile-menu-mock')).toBeInTheDocument()
  })
})
