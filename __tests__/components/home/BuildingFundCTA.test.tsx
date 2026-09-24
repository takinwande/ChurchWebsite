import React from 'react'
import { render, screen } from '@testing-library/react'
import { BuildingFundCTA } from '@/components/home/BuildingFundCTA'

describe('BuildingFundCTA', () => {
  it('renders the section with aria-label "Building fund campaign"', () => {
    render(<BuildingFundCTA />)
    expect(screen.getByRole('region', { name: 'Building fund campaign' })).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<BuildingFundCTA />)
    expect(
      screen.getByRole('heading', { name: 'Help Us Build Our Future Home' })
    ).toBeInTheDocument()
  })

  it('renders a "Give to Phase 2" link to the campaign site', () => {
    render(<BuildingFundCTA />)
    const link = screen.getByRole('link', { name: /Give to Phase 2/i })
    expect(link).toHaveAttribute('href', 'https://www.rccgcovenantassemblyfund.org')
  })

  // External link — opens a real donation flow on another domain, so this has
  // to carry the same safe-external-link attributes used everywhere else on
  // the site (Livestream, social links, Give page payment methods).
  it('opens the campaign link in a new tab without a window.opener leak', () => {
    render(<BuildingFundCTA />)
    const link = screen.getByRole('link', { name: /Give to Phase 2/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not display a specific fundraising dollar amount', () => {
    // The campaign site is the source of truth for the live total; embedding
    // a figure here would go stale the moment someone gives.
    render(<BuildingFundCTA />)
    expect(screen.queryByText(/\$[\d,]+/)).not.toBeInTheDocument()
  })
})
