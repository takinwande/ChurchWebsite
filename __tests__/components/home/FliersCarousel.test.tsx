import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FliersCarousel } from '@/components/home/FliersCarousel'
import type { ProgramFlier, SanityImage } from '@/lib/types'

jest.mock('@/lib/sanity/image', () => ({
  urlFor: (img: SanityImage) => ({
    url: () => `https://cdn.sanity.io/mock/${img.asset._ref}.jpg`,
  }),
}))

const makeFlier = (id: string, order = 1): ProgramFlier => ({
  _id: id,
  title: `Test Flier ${id}`,
  image: {
    _type: 'image',
    asset: { _ref: `ref-${id}`, _type: 'reference' },
  },
  imageUrl: `https://cdn.sanity.io/mock/ref-${id}.jpg`,
  expiresAt: '2099-12-31T23:59:59Z',
  order,
})

describe('FliersCarousel', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('renders the first flier image on mount', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} />)
    expect(screen.getByRole('img', { name: 'Test Flier a' })).toBeInTheDocument()
  })

  it('renders all flier images in the DOM (inactive slides are aria-hidden)', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b'), makeFlier('c')]} />)
    // Use { hidden: true } to reach images inside aria-hidden parent containers
    const allImgs = screen.getAllByRole('img', { hidden: true })
    expect(allImgs).toHaveLength(3)
  })

  it('does not render dot indicators when there is only one flier', () => {
    render(<FliersCarousel fliers={[makeFlier('a')]} />)
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('renders dot indicators equal to flier count when multiple fliers exist', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b'), makeFlier('c')]} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('first dot is aria-selected=true on mount', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} />)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    expect(dots[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('clicking a dot updates aria-selected', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b'), makeFlier('c')]} />)
    const dots = screen.getAllByRole('tab')
    fireEvent.click(dots[2])
    expect(dots[2]).toHaveAttribute('aria-selected', 'true')
    expect(dots[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('advances to the next slide after intervalMs', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} intervalMs={3000} />)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    act(() => { jest.advanceTimersByTime(3000) })
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps back to the first slide after the last slide', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} intervalMs={3000} />)
    const dots = screen.getAllByRole('tab')
    act(() => { jest.advanceTimersByTime(3000) }) // -> slide 2
    act(() => { jest.advanceTimersByTime(3000) }) // -> slide 1 (wraps)
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('does not auto-advance when only one flier exists', () => {
    render(<FliersCarousel fliers={[makeFlier('a')]} intervalMs={3000} />)
    // Should not throw or break — timer effect short-circuits for single flier
    act(() => { jest.advanceTimersByTime(10000) })
    expect(screen.getByRole('img', { name: 'Test Flier a' })).toBeInTheDocument()
  })

  it('renders prev and next arrow buttons when multiple fliers exist', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} />)
    expect(screen.getByRole('button', { name: /previous flier/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next flier/i })).toBeInTheDocument()
  })

  it('does not render arrow buttons when only one flier exists', () => {
    render(<FliersCarousel fliers={[makeFlier('a')]} />)
    expect(screen.queryByRole('button', { name: /previous flier/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next flier/i })).not.toBeInTheDocument()
  })

  it('next arrow button advances the active dot', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b')]} />)
    const dots = screen.getAllByRole('tab')
    fireEvent.click(screen.getByRole('button', { name: /next flier/i }))
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('prev arrow button wraps to the last slide from the first', () => {
    render(<FliersCarousel fliers={[makeFlier('a'), makeFlier('b'), makeFlier('c')]} />)
    const dots = screen.getAllByRole('tab')
    fireEvent.click(screen.getByRole('button', { name: /previous flier/i }))
    expect(dots[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('returns null when all fliers are missing image assets', () => {
    const badFlier = {
      _id: 'bad',
      title: 'Bad Flier',
      image: { _type: 'image' as const },
      imageUrl: '',
      expiresAt: '2099-01-01Z',
    } as ProgramFlier
    const { container } = render(<FliersCarousel fliers={[badFlier]} />)
    expect(container.firstChild).toBeNull()
  })
})
