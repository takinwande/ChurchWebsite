import React from 'react'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'

describe('Hero', () => {
  it('renders the church name in an h1', () => {
    render(<Hero name="RCCG Covenant Assembly" />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'RCCG Covenant Assembly' })
    ).toBeInTheDocument()
  })

  it('renders the tagline when tagline prop is provided', () => {
    render(<Hero name="Church" tagline="Building Faith Together" />)
    expect(screen.getByText('Building Faith Together')).toBeInTheDocument()
  })

  it('does not render tagline when prop is omitted', () => {
    render(<Hero name="Church" />)
    expect(screen.queryByText('Building Faith Together')).not.toBeInTheDocument()
  })

  it('renders "Plan a Visit" link pointing to /plan-a-visit', () => {
    render(<Hero name="Church" />)
    expect(screen.getByRole('link', { name: /plan a visit/i })).toHaveAttribute(
      'href',
      '/plan-a-visit'
    )
  })

  it('renders "Watch Live" external link when livestreamUrl is provided', () => {
    render(<Hero name="Church" livestreamUrl="https://youtube.com/live/abc" />)
    const link = screen.getByRole('link', { name: /watch live/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://youtube.com/live/abc')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders "Watch Sermons" internal link when livestreamUrl is not provided', () => {
    render(<Hero name="Church" />)
    const link = screen.getByRole('link', { name: /watch sermons/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/sermons')
  })

  it('does not render "Watch Live" when livestreamUrl is absent', () => {
    render(<Hero name="Church" />)
    expect(screen.queryByRole('link', { name: /watch live/i })).not.toBeInTheDocument()
  })
})
