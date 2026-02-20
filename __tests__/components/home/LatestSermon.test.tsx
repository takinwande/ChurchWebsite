import React from 'react'
import { render, screen } from '@testing-library/react'
import { LatestSermon } from '@/components/home/LatestSermon'
import type { Sermon } from '@/lib/types'

const baseSermon: Sermon = {
  _id: 'sermon-1',
  title: 'Walking in Faith',
  slug: { current: 'walking-in-faith' },
  date: '2025-06-15T12:00:00',
}

describe('LatestSermon', () => {
  it('returns null when sermon prop is null', () => {
    const { container } = render(<LatestSermon sermon={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the sermon title', () => {
    render(<LatestSermon sermon={baseSermon} />)
    expect(screen.getByText('Walking in Faith')).toBeInTheDocument()
  })

  it('renders the speaker name when provided', () => {
    const sermon: Sermon = {
      ...baseSermon,
      speaker: { name: 'Pastor John', slug: { current: 'pastor-john' } },
    }
    render(<LatestSermon sermon={sermon} />)
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    render(<LatestSermon sermon={baseSermon} />)
    // formatDate('2025-06-15') => "June 15, 2025"
    expect(screen.getByText('June 15, 2025')).toBeInTheDocument()
  })

  it('renders the series badge when series is provided', () => {
    const sermon: Sermon = {
      ...baseSermon,
      series: { title: 'Faith Series', slug: { current: 'faith-series' } },
    }
    render(<LatestSermon sermon={sermon} />)
    expect(screen.getByText('Faith Series')).toBeInTheDocument()
  })

  it('renders the "Watch" button linked to youtubeUrl when present', () => {
    const sermon: Sermon = { ...baseSermon, youtubeUrl: 'https://youtube.com/watch?v=abc' }
    render(<LatestSermon sermon={sermon} />)
    const btn = screen.getByRole('link', { name: /watch/i })
    expect(btn).toHaveAttribute('href', 'https://youtube.com/watch?v=abc')
  })

  it('does not render "Watch" button when youtubeUrl is absent', () => {
    render(<LatestSermon sermon={baseSermon} />)
    expect(screen.queryByRole('link', { name: /^watch$/i })).not.toBeInTheDocument()
  })

  it('renders the "Listen" button linked to audioUrl when present', () => {
    const sermon: Sermon = { ...baseSermon, audioUrl: 'https://cdn.church.org/audio.mp3' }
    render(<LatestSermon sermon={sermon} />)
    expect(screen.getByRole('link', { name: /listen/i })).toHaveAttribute(
      'href',
      'https://cdn.church.org/audio.mp3'
    )
  })

  it('does not render "Listen" button when audioUrl is absent', () => {
    render(<LatestSermon sermon={baseSermon} />)
    expect(screen.queryByRole('link', { name: /listen/i })).not.toBeInTheDocument()
  })

  it('renders "View notes" link pointing to /sermons/[slug]', () => {
    render(<LatestSermon sermon={baseSermon} />)
    expect(screen.getByRole('link', { name: /view notes/i })).toHaveAttribute(
      'href',
      '/sermons/walking-in-faith'
    )
  })

  it('renders a "View all sermons" link pointing to /sermons', () => {
    render(<LatestSermon sermon={baseSermon} />)
    expect(screen.getByRole('link', { name: /view all sermons/i })).toHaveAttribute(
      'href',
      '/sermons'
    )
  })
})
