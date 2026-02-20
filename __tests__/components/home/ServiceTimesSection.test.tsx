import React from 'react'
import { render, screen } from '@testing-library/react'
import { ServiceTimesSection } from '@/components/home/ServiceTimesSection'
import type { ServiceTime } from '@/lib/types'

describe('ServiceTimesSection', () => {
  it('renders provided service times', () => {
    const times: ServiceTime[] = [
      { name: 'Morning Worship', day: 'Sunday', time: '9:00 AM' },
      { name: 'Bible Study', day: 'Wednesday', time: '7:00 PM' },
    ]
    render(<ServiceTimesSection serviceTimes={times} />)
    expect(screen.getByText('Morning Worship')).toBeInTheDocument()
    expect(screen.getByText('Bible Study')).toBeInTheDocument()
  })

  it('renders the day and time for each service', () => {
    const times: ServiceTime[] = [{ name: 'Sunday Worship', day: 'Sunday', time: '10:00 AM' }]
    render(<ServiceTimesSection serviceTimes={times} />)
    // The component renders the name and "{day} · {time}" separately
    expect(screen.getByText('Sunday Worship')).toBeInTheDocument()
    // The day and time are in a single element with middot between them
    expect(screen.getByText(/10:00 AM/)).toBeInTheDocument()
  })

  it('renders default "Sunday Worship Service" fallback when empty array is passed', () => {
    render(<ServiceTimesSection serviceTimes={[]} />)
    // Actual fallback name from source is "Sunday Worship Service"
    expect(screen.getByText('Sunday Worship Service')).toBeInTheDocument()
  })

  it('renders the section with aria-label "Service times"', () => {
    render(<ServiceTimesSection serviceTimes={[]} />)
    expect(screen.getByRole('region', { name: 'Service times' })).toBeInTheDocument()
  })

  it('renders the "Join Us" label', () => {
    render(<ServiceTimesSection serviceTimes={[]} />)
    expect(screen.getByText(/join us/i)).toBeInTheDocument()
  })
})
