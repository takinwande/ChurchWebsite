import React from 'react'
import { render, screen } from '@testing-library/react'
import { BuildingFundCTA } from '@/components/home/BuildingFundCTA'
import type { FundraisingCampaign } from '@/lib/types'

const baseCampaign: FundraisingCampaign = {
  _id: 'campaign-1',
  enabled: true,
  eyebrow: 'Phase 2 Campaign',
  heading: 'Help Us Build Our Future Home',
  body: 'We are raising funds to renovate and equip our building.',
  buttonLabel: 'Give to Phase 2',
  url: 'https://www.rccgcovenantassemblyfund.org',
}

describe('BuildingFundCTA', () => {
  it('returns null when campaign prop is null', () => {
    const { container } = render(<BuildingFundCTA campaign={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when campaign.enabled is false', () => {
    const { container } = render(
      <BuildingFundCTA campaign={{ ...baseCampaign, enabled: false }} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when heading is missing, even if enabled', () => {
    const { container } = render(
      <BuildingFundCTA campaign={{ ...baseCampaign, heading: '' }} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when url is missing, even if enabled', () => {
    const { container } = render(<BuildingFundCTA campaign={{ ...baseCampaign, url: '' }} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the section with aria-label "Fundraising campaign" when enabled', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    expect(screen.getByRole('region', { name: 'Fundraising campaign' })).toBeInTheDocument()
  })

  it('renders the heading from Sanity content', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    expect(
      screen.getByRole('heading', { name: 'Help Us Build Our Future Home' })
    ).toBeInTheDocument()
  })

  it('renders the eyebrow label when provided', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    expect(screen.getByText('Phase 2 Campaign')).toBeInTheDocument()
  })

  it('omits the eyebrow entirely when not set', () => {
    render(<BuildingFundCTA campaign={{ ...baseCampaign, eyebrow: undefined }} />)
    expect(screen.queryByText('Phase 2 Campaign')).not.toBeInTheDocument()
  })

  it('renders the body text when provided', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    expect(screen.getByText(baseCampaign.body!)).toBeInTheDocument()
  })

  it('renders a link using the campaign URL and button label', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    const link = screen.getByRole('link', { name: /Give to Phase 2/i })
    expect(link).toHaveAttribute('href', 'https://www.rccgcovenantassemblyfund.org')
  })

  it('falls back to "Give Now" when buttonLabel is not set', () => {
    render(<BuildingFundCTA campaign={{ ...baseCampaign, buttonLabel: undefined }} />)
    expect(screen.getByRole('link', { name: /Give Now/i })).toBeInTheDocument()
  })

  // External link — opens a real donation flow on another domain, so this has
  // to carry the same safe-external-link attributes used everywhere else on
  // the site (Livestream, social links, Give page payment methods).
  it('opens the campaign link in a new tab without a window.opener leak', () => {
    render(<BuildingFundCTA campaign={baseCampaign} />)
    const link = screen.getByRole('link', { name: /Give to Phase 2/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
