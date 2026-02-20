import React from 'react'
import { render, screen } from '@testing-library/react'
import { SermonCard } from '@/components/sermons/SermonCard'
import type { Sermon } from '@/lib/types'

const baseSermon: Sermon = {
  _id: 'ser-1',
  title: 'Grace Upon Grace',
  slug: { current: 'grace-upon-grace' },
  date: '2025-05-10T12:00:00',
}

describe('SermonCard', () => {
  it('renders the series badge when series is present', () => {
    const sermon: Sermon = {
      ...baseSermon,
      series: { title: 'Gospel of John', slug: { current: 'gospel-of-john' } },
    }
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByText('Gospel of John')).toBeInTheDocument()
  })

  it('does not render a series badge when series is absent', () => {
    render(<SermonCard sermon={baseSermon} />)
    expect(screen.queryByText('Gospel of John')).not.toBeInTheDocument()
  })

  it('renders the sermon title', () => {
    render(<SermonCard sermon={baseSermon} />)
    expect(screen.getByText('Grace Upon Grace')).toBeInTheDocument()
  })

  it('renders the speaker name when provided', () => {
    const sermon: Sermon = {
      ...baseSermon,
      speaker: { name: 'Deacon Mike', slug: { current: 'deacon-mike' } },
    }
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByText('Deacon Mike')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    render(<SermonCard sermon={baseSermon} />)
    // formatDate('2025-05-10') => "May 10, 2025"
    expect(screen.getByText('May 10, 2025')).toBeInTheDocument()
  })

  it('renders the "Watch" button when youtubeUrl is present', () => {
    const sermon: Sermon = { ...baseSermon, youtubeUrl: 'https://youtube.com/watch?v=xyz' }
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByRole('link', { name: /watch/i })).toHaveAttribute(
      'href',
      'https://youtube.com/watch?v=xyz'
    )
  })

  it('does not render "Watch" button when youtubeUrl is absent', () => {
    render(<SermonCard sermon={baseSermon} />)
    expect(screen.queryByRole('link', { name: /^watch$/i })).not.toBeInTheDocument()
  })

  it('renders the "Listen" button when audioUrl is present', () => {
    const sermon: Sermon = { ...baseSermon, audioUrl: 'https://cdn.example.com/sermon.mp3' }
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByRole('link', { name: /listen/i })).toHaveAttribute(
      'href',
      'https://cdn.example.com/sermon.mp3'
    )
  })

  it('does not render "Listen" button when audioUrl is absent', () => {
    render(<SermonCard sermon={baseSermon} />)
    expect(screen.queryByRole('link', { name: /listen/i })).not.toBeInTheDocument()
  })

  it('title links to /sermons/[slug]', () => {
    render(<SermonCard sermon={baseSermon} />)
    const links = screen.getAllByRole('link')
    const slugLinks = links.filter(
      (l) => l.getAttribute('href') === '/sermons/grace-upon-grace'
    )
    expect(slugLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the "Notes" link pointing to /sermons/[slug]', () => {
    render(<SermonCard sermon={baseSermon} />)
    expect(screen.getByRole('link', { name: /notes/i })).toHaveAttribute(
      'href',
      '/sermons/grace-upon-grace'
    )
  })
})
