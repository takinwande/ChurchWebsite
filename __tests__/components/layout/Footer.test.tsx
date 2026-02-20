import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'
import type { SiteSettings } from '@/lib/types'

const fullSettings: SiteSettings = {
  _id: 'settings-1',
  name: 'RCCG Covenant Assembly',
  address: {
    street: '123 Main St',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85001',
  },
  phone: '6025551234',
  email: 'info@church.org',
  serviceTimes: [{ name: 'Sunday Service', day: 'Sunday', time: '10:00 AM' }],
  socialLinks: {
    facebook: 'https://facebook.com/church',
    instagram: 'https://instagram.com/church',
    youtube: 'https://youtube.com/church',
    twitter: 'https://twitter.com/church',
  },
}

describe('Footer', () => {
  it('renders "RCCG Covenant Assembly" church name', () => {
    render(<Footer settings={null} />)
    expect(screen.getByText('RCCG Covenant Assembly')).toBeInTheDocument()
  })

  it('renders the provided address when settings.address is populated', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.getByText(/Phoenix, AZ 85001/)).toBeInTheDocument()
  })

  it('renders the default address when settings is null', () => {
    render(<Footer settings={null} />)
    expect(screen.getByText(/755 North 114th Avenue/)).toBeInTheDocument()
    expect(screen.getByText(/Avondale, AZ 85323/)).toBeInTheDocument()
  })

  it('renders the formatted phone number as a tel: link', () => {
    render(<Footer settings={fullSettings} />)
    const link = screen.getByRole('link', { name: '(602) 555-1234' })
    expect(link).toHaveAttribute('href', 'tel:6025551234')
  })

  it('does not render a phone link when settings.phone is absent', () => {
    render(<Footer settings={{ ...fullSettings, phone: undefined }} />)
    expect(screen.queryByRole('link', { name: /\(\d{3}\)/ })).not.toBeInTheDocument()
  })

  it('renders the email as a mailto: link', () => {
    render(<Footer settings={fullSettings} />)
    const link = screen.getByRole('link', { name: 'info@church.org' })
    expect(link).toHaveAttribute('href', 'mailto:info@church.org')
  })

  it('does not render an email link when settings.email is absent', () => {
    render(<Footer settings={{ ...fullSettings, email: undefined }} />)
    expect(screen.queryByRole('link', { name: /info@church\.org/ })).not.toBeInTheDocument()
  })

  it('renders Facebook social link when present', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
      'href',
      'https://facebook.com/church'
    )
  })

  it('renders Instagram social link when present', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/church'
    )
  })

  it('renders YouTube social link when present', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByRole('link', { name: 'YouTube' })).toHaveAttribute(
      'href',
      'https://youtube.com/church'
    )
  })

  it('renders X / Twitter social link when present', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByRole('link', { name: 'X / Twitter' })).toHaveAttribute(
      'href',
      'https://twitter.com/church'
    )
  })

  it('does not render social links when settings.socialLinks is absent', () => {
    render(<Footer settings={{ ...fullSettings, socialLinks: undefined }} />)
    expect(screen.queryByRole('link', { name: 'Facebook' })).not.toBeInTheDocument()
  })

  it('renders provided service times in the footer', () => {
    render(<Footer settings={fullSettings} />)
    expect(screen.getByText('Sunday Service')).toBeInTheDocument()
    expect(screen.getByText(/Sunday · 10:00 AM/)).toBeInTheDocument()
  })

  it('renders default "Sunday Service · 10:00 AM" when no service times are provided', () => {
    render(<Footer settings={{ ...fullSettings, serviceTimes: [] }} />)
    expect(screen.getByText('Sunday Service · 10:00 AM')).toBeInTheDocument()
  })

  it('renders all quick nav links', () => {
    render(<Footer settings={null} />)
    const labels = ['Home', 'Sermons', 'Events', 'About', 'Contact', 'Give', 'Plan a Visit']
    labels.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })
})
