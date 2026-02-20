import React from 'react'
import { render, screen } from '@testing-library/react'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import type { Event } from '@/lib/types'

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  _id: 'event-1',
  title: 'Summer Camp',
  slug: { current: 'summer-camp' },
  startDateTime: '2025-07-20T09:00:00',
  ...overrides,
})

describe('UpcomingEvents', () => {
  it('returns null when events array is empty', () => {
    const { container } = render(<UpcomingEvents events={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when events is null (cast for runtime guard test)', () => {
    const { container } = render(<UpcomingEvents events={null as unknown as Event[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders event titles', () => {
    render(<UpcomingEvents events={[makeEvent({ title: 'Youth Conference' })]} />)
    expect(screen.getByText('Youth Conference')).toBeInTheDocument()
  })

  it('renders formatted event date', () => {
    render(<UpcomingEvents events={[makeEvent({ startDateTime: '2025-07-20T09:00:00' })]} />)
    // formatShortDate('2025-07-20T09:00:00') => "Jul 20, 2025"
    expect(screen.getByText('Jul 20, 2025')).toBeInTheDocument()
  })

  it('renders event location when provided', () => {
    render(<UpcomingEvents events={[makeEvent({ location: 'Main Sanctuary' })]} />)
    expect(screen.getByText('Main Sanctuary')).toBeInTheDocument()
  })

  it('does not render location text when location is absent', () => {
    render(<UpcomingEvents events={[makeEvent({ location: undefined })]} />)
    expect(screen.queryByText('Main Sanctuary')).not.toBeInTheDocument()
  })

  it('renders multiple events', () => {
    const events = [
      makeEvent({ _id: 'e1', title: 'Event One' }),
      makeEvent({ _id: 'e2', title: 'Event Two' }),
    ]
    render(<UpcomingEvents events={events} />)
    expect(screen.getByText('Event One')).toBeInTheDocument()
    expect(screen.getByText('Event Two')).toBeInTheDocument()
  })

  it('renders event links pointing to /events/[slug]', () => {
    render(<UpcomingEvents events={[makeEvent({ slug: { current: 'summer-camp' } })]} />)
    const links = screen.getAllByRole('link')
    const eventLink = links.find((l) => l.getAttribute('href') === '/events/summer-camp')
    expect(eventLink).toBeTruthy()
  })

  it('renders "View all events" link pointing to /events', () => {
    render(<UpcomingEvents events={[makeEvent()]} />)
    expect(screen.getByRole('link', { name: /view all events/i })).toHaveAttribute(
      'href',
      '/events'
    )
  })

  it('renders the section with aria-label "Upcoming events"', () => {
    render(<UpcomingEvents events={[makeEvent()]} />)
    expect(screen.getByRole('region', { name: 'Upcoming events' })).toBeInTheDocument()
  })
})
