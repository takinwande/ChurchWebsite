import React from 'react'
import { render, screen } from '@testing-library/react'
import { EventCard } from '@/components/events/EventCard'
import type { Event } from '@/lib/types'

// Use extreme dates to avoid relying on fake timers
const futureEvent: Event = {
  _id: 'ev-1',
  title: 'Church Picnic',
  slug: { current: 'church-picnic' },
  startDateTime: '2099-12-31T00:00:00',
  location: 'Community Park',
}

const pastEvent: Event = {
  ...futureEvent,
  startDateTime: '2020-01-01T00:00:00',
}

describe('EventCard', () => {
  it('renders the event title', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.getByText('Church Picnic')).toBeInTheDocument()
  })

  it('renders the formatted event date', () => {
    render(<EventCard event={futureEvent} />)
    // formatShortDate('2099-12-31T00:00:00') => "Dec 31, 2099"
    expect(screen.getByText('Dec 31, 2099')).toBeInTheDocument()
  })

  it('renders the event location when provided', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.getByText('Community Park')).toBeInTheDocument()
  })

  it('does not render location when absent', () => {
    const event: Event = { ...futureEvent, location: undefined }
    render(<EventCard event={event} />)
    expect(screen.queryByText('Community Park')).not.toBeInTheDocument()
  })

  it('shows "Featured" badge when featured is true', () => {
    const event: Event = { ...futureEvent, featured: true }
    render(<EventCard event={event} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not show "Featured" badge when featured is false/undefined', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('shows "Past Event" badge for past events', () => {
    render(<EventCard event={pastEvent} />)
    expect(screen.getByText('Past Event')).toBeInTheDocument()
  })

  it('does not show "Past Event" badge for future events', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.queryByText('Past Event')).not.toBeInTheDocument()
  })

  it('applies opacity-70 class to the card for past events', () => {
    const { container } = render(<EventCard event={pastEvent} />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('opacity-70')
  })

  it('does not apply opacity-70 class for future events', () => {
    const { container } = render(<EventCard event={futureEvent} />)
    const card = container.firstChild as HTMLElement
    expect(card).not.toHaveClass('opacity-70')
  })

  it('renders "Register" button with correct href when registrationUrl is provided', () => {
    const event: Event = { ...futureEvent, registrationUrl: 'https://forms.example.com/register' }
    render(<EventCard event={event} />)
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute(
      'href',
      'https://forms.example.com/register'
    )
  })

  it('does not render "Register" button when registrationUrl is absent', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument()
  })

  it('renders "View details" link pointing to /events/[slug]', () => {
    render(<EventCard event={futureEvent} />)
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/events/church-picnic'
    )
  })
})
