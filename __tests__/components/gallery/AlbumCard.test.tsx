import React from 'react'
import { render, screen } from '@testing-library/react'
import { AlbumCard } from '@/components/gallery/AlbumCard'
import type { GalleryAlbum } from '@/lib/types'

const baseAlbum: GalleryAlbum = {
  _id: 'album-1',
  title: 'Easter Sunday 2025',
  slug: { current: 'easter-sunday-2025' },
  date: '2025-04-20',
  coverImageUrl: 'https://cdn.sanity.io/images/test/production/cover.jpg',
  photoCount: 12,
}

describe('AlbumCard', () => {
  it('renders the album title', () => {
    render(<AlbumCard album={baseAlbum} />)
    expect(screen.getByText('Easter Sunday 2025')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    render(<AlbumCard album={baseAlbum} />)
    expect(screen.getByText('April 20, 2025')).toBeInTheDocument()
  })

  it('renders the photo count', () => {
    render(<AlbumCard album={baseAlbum} />)
    expect(screen.getByText('12 photos')).toBeInTheDocument()
  })

  it('renders "photo" (singular) when photoCount is 1', () => {
    render(<AlbumCard album={{ ...baseAlbum, photoCount: 1 }} />)
    expect(screen.getByText('1 photo')).toBeInTheDocument()
  })

  it('links to the correct gallery album slug', () => {
    render(<AlbumCard album={baseAlbum} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/gallery/easter-sunday-2025')
  })

  it('renders the cover image when coverImageUrl is provided', () => {
    render(<AlbumCard album={baseAlbum} />)
    const img = screen.getByRole('img', { name: 'Easter Sunday 2025' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.stringContaining('cover.jpg'))
  })

  it('does not render a photo count when photoCount is 0', () => {
    render(<AlbumCard album={{ ...baseAlbum, photoCount: 0 }} />)
    expect(screen.queryByText(/photo/i)).not.toBeInTheDocument()
  })

  it('does not render a photo count when photoCount is undefined', () => {
    render(<AlbumCard album={{ ...baseAlbum, photoCount: undefined }} />)
    expect(screen.queryByText(/photo/i)).not.toBeInTheDocument()
  })
})
