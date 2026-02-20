import React from 'react'
import { render, screen } from '@testing-library/react'
import { AboutTeaser } from '@/components/home/AboutTeaser'

describe('AboutTeaser', () => {
  it('renders "Who We Are" heading', () => {
    render(<AboutTeaser />)
    expect(screen.getByRole('heading', { name: 'Who We Are' })).toBeInTheDocument()
  })

  it('renders "Learn More About Us" link pointing to /about', () => {
    render(<AboutTeaser />)
    const link = screen.getByRole('link', { name: 'Learn More About Us' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })

  it('renders the section with aria-label "About us"', () => {
    render(<AboutTeaser />)
    expect(screen.getByRole('region', { name: 'About us' })).toBeInTheDocument()
  })

  it('renders the descriptive paragraph text', () => {
    render(<AboutTeaser />)
    expect(screen.getByText(/spirit-filled community/i)).toBeInTheDocument()
  })

  it('renders "welcome here" text', () => {
    render(<AboutTeaser />)
    expect(screen.getByText(/welcome here/i)).toBeInTheDocument()
  })
})
