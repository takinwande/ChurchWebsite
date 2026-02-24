import React from 'react'
import { render, screen } from '@testing-library/react'
import { FliersSection } from '@/components/home/FliersSection'
import type { ProgramFlier, SanityImage } from '@/lib/types'

jest.mock('@/components/home/FliersCarousel', () => ({
  FliersCarousel: ({ fliers }: { fliers: ProgramFlier[] }) => (
    <div data-testid="fliers-carousel">{fliers.length} flier(s)</div>
  ),
}))

const makeFlier = (id: string): ProgramFlier => ({
  _id: id,
  title: `Flier ${id}`,
  image: {
    _type: 'image',
    asset: { _ref: `ref-${id}`, _type: 'reference' },
  } as SanityImage,
  imageUrl: `https://cdn.sanity.io/mock/ref-${id}.jpg`,
  expiresAt: '2099-12-31T23:59:59Z',
  order: 1,
})

describe('FliersSection', () => {
  it('returns null when the fliers array is empty', () => {
    const { container } = render(<FliersSection fliers={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when fliers is null (runtime safety guard)', () => {
    const { container } = render(
      <FliersSection fliers={null as unknown as ProgramFlier[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the section heading when fliers are present', () => {
    render(<FliersSection fliers={[makeFlier('1')]} />)
    expect(
      screen.getByRole('heading', { name: /upcoming programs/i })
    ).toBeInTheDocument()
  })

  it('renders a section with aria-label "Program fliers"', () => {
    render(<FliersSection fliers={[makeFlier('1')]} />)
    expect(screen.getByRole('region', { name: /program fliers/i })).toBeInTheDocument()
  })

  it('passes the fliers array to the carousel', () => {
    render(<FliersSection fliers={[makeFlier('1'), makeFlier('2')]} />)
    expect(screen.getByTestId('fliers-carousel')).toHaveTextContent('2 flier(s)')
  })
})
