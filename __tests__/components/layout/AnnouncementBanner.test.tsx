import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner'
import type { Announcement } from '@/lib/types'

const baseAnnouncement: Announcement = {
  _id: 'ann-1',
  enabled: true,
  text: 'Welcome to our new website!',
}

describe('AnnouncementBanner', () => {
  it('returns null when announcement prop is null', () => {
    const { container } = render(<AnnouncementBanner announcement={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when announcement.enabled is false', () => {
    const { container } = render(
      <AnnouncementBanner announcement={{ ...baseAnnouncement, enabled: false }} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the announcement text when enabled is true', () => {
    render(<AnnouncementBanner announcement={baseAnnouncement} />)
    expect(screen.getByText('Welcome to our new website!')).toBeInTheDocument()
  })

  it('does not render a link when announcement.link is not provided', () => {
    render(<AnnouncementBanner announcement={baseAnnouncement} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders a link with the correct href when announcement.link is provided', () => {
    render(
      <AnnouncementBanner
        announcement={{ ...baseAnnouncement, link: '/events', linkText: 'See Events' }}
      />
    )
    const link = screen.getByRole('link', { name: 'See Events' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/events')
  })

  it('uses default "Learn more" link text when linkText is not provided', () => {
    render(<AnnouncementBanner announcement={{ ...baseAnnouncement, link: '/events' }} />)
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument()
  })

  it('renders external link with target="_blank" when link starts with http', () => {
    render(
      <AnnouncementBanner
        announcement={{ ...baseAnnouncement, link: 'https://example.com', linkText: 'Visit' }}
      />
    )
    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders dismiss button with correct aria-label', () => {
    render(<AnnouncementBanner announcement={baseAnnouncement} />)
    expect(screen.getByRole('button', { name: 'Dismiss announcement' })).toBeInTheDocument()
  })

  it('hides the banner when the dismiss button is clicked', async () => {
    render(<AnnouncementBanner announcement={baseAnnouncement} />)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss announcement' }))
    expect(screen.queryByText('Welcome to our new website!')).not.toBeInTheDocument()
  })
})
