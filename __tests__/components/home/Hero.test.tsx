import React from 'react'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'
import type { SanityImage } from '@/lib/types'

// Mock urlFor so carousel image tests work without a real Sanity client
jest.mock('@/lib/sanity/image', () => ({
  urlFor: (img: SanityImage) => ({
    url: () => `https://cdn.sanity.io/mock/${img.asset._ref}.jpg`,
  }),
}))

const mockImage = (key: string): SanityImage => ({
  _type: 'image',
  _key: key,
  alt: `${key} alt text`,
  asset: { _ref: `image-${key}-800x600-jpg`, _type: 'reference' },
})

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

  describe('carousel', () => {
    it('renders a carousel image when heroImages are provided', () => {
      render(<Hero name="Church" heroImages={[mockImage('slide1')]} />)
      const img = screen.getByRole('img', { name: 'slide1 alt text' })
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', expect.stringContaining('image-slide1'))
    })

    it('renders dot indicators when multiple images are provided', () => {
      render(
        <Hero name="Church" heroImages={[mockImage('a'), mockImage('b'), mockImage('c')]} />
      )
      const dots = screen.getAllByRole('tab')
      expect(dots).toHaveLength(3)
    })

    it('does not render dot indicators when fewer than 2 images', () => {
      render(<Hero name="Church" heroImages={[mockImage('a')]} />)
      expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    })

    it('does not render dot indicators when heroImages is undefined', () => {
      render(<Hero name="Church" />)
      expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    })

    it('filters out images with no asset before rendering', () => {
      const badImage = { _type: 'image' as const, _key: 'bad' } as SanityImage
      render(<Hero name="Church" heroImages={[badImage]} />)
      // No slides rendered, no dots
      expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    })
  })
})
