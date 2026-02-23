import React from 'react'
import { render, screen } from '@testing-library/react'
import { GivingMethodCard } from '@/components/give/GivingMethodCard'

const baseProps = {
  icon: <div data-testid="mock-icon" />,
  name: 'Test Method',
  description: 'A test description for this giving method.',
  detail: '$TESTHANDLE',
}

describe('GivingMethodCard', () => {
  describe('rendering core content', () => {
    it('renders the method name', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.getByText('Test Method')).toBeInTheDocument()
    })

    it('renders the description', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.getByText('A test description for this giving method.')).toBeInTheDocument()
    })

    it('renders the detail text', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.getByText('$TESTHANDLE')).toBeInTheDocument()
    })

    it('renders the icon', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })
  })

  describe('action link', () => {
    it('renders an action link when provided', () => {
      render(
        <GivingMethodCard
          {...baseProps}
          action={{ label: 'Give Now', href: 'https://example.com/give' }}
        />
      )
      const link = screen.getByRole('link', { name: 'Give Now' })
      expect(link).toBeInTheDocument()
    })

    it('links to the correct href', () => {
      render(
        <GivingMethodCard
          {...baseProps}
          action={{ label: 'Give Now', href: 'https://example.com/give' }}
        />
      )
      expect(screen.getByRole('link', { name: 'Give Now' })).toHaveAttribute(
        'href',
        'https://example.com/give'
      )
    })

    it('opens the link in a new tab with noopener noreferrer', () => {
      render(
        <GivingMethodCard
          {...baseProps}
          action={{ label: 'Give Now', href: 'https://example.com/give' }}
        />
      )
      const link = screen.getByRole('link', { name: 'Give Now' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('does not render an action link when action is not provided', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('note', () => {
    it('renders the note when provided', () => {
      render(<GivingMethodCard {...baseProps} note="Search for us in the app" />)
      expect(screen.getByText('Search for us in the app')).toBeInTheDocument()
    })

    it('does not render a note element when note is not provided', () => {
      render(<GivingMethodCard {...baseProps} />)
      expect(screen.queryByText('Search for us in the app')).not.toBeInTheDocument()
    })
  })

  describe('real giving methods', () => {
    it('renders Zelle card correctly', () => {
      render(
        <GivingMethodCard
          icon={<div data-testid="zelle-icon" />}
          name="Zelle"
          description="Send a gift directly from your bank app — fast, free, and secure."
          detail="admin@covenantassembly.org"
          note="Open your bank app → Send Money → enter this email address"
        />
      )
      expect(screen.getByText('Zelle')).toBeInTheDocument()
      expect(screen.getByText('admin@covenantassembly.org')).toBeInTheDocument()
      expect(
        screen.getByText('Open your bank app → Send Money → enter this email address')
      ).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders Givelify card with online giving link', () => {
      render(
        <GivingMethodCard
          icon={<div data-testid="givelify-icon" />}
          name="Givelify"
          description="Give securely online or through the Givelify app."
          detail="RCCG Covenant Assembly, Avondale"
          action={{ label: 'Give Online', href: 'https://www.givelify.com/donate/NTQ3ODU' }}
          note='Or search "RCCG Covenant Assembly, Avondale" in the Givelify app'
        />
      )
      expect(screen.getByText('Givelify')).toBeInTheDocument()
      expect(screen.getByText('RCCG Covenant Assembly, Avondale')).toBeInTheDocument()
      const link = screen.getByRole('link', { name: 'Give Online' })
      expect(link).toHaveAttribute('href', 'https://www.givelify.com/donate/NTQ3ODU')
    })

    it('renders Cash App card with $Cashtag and link', () => {
      render(
        <GivingMethodCard
          icon={<div data-testid="cashapp-icon" />}
          name="Cash App"
          description="Send a gift instantly using our Cash App $Cashtag."
          detail="$RCCGCAAZ"
          action={{ label: 'Open Cash App', href: 'https://cash.app/$RCCGCAAZ' }}
        />
      )
      expect(screen.getByText('Cash App')).toBeInTheDocument()
      expect(screen.getByText('$RCCGCAAZ')).toBeInTheDocument()
      const link = screen.getByRole('link', { name: 'Open Cash App' })
      expect(link).toHaveAttribute('href', 'https://cash.app/$RCCGCAAZ')
    })

    it('renders PayPal card with email detail, donate link, and note', () => {
      render(
        <GivingMethodCard
          icon={<div data-testid="paypal-icon" />}
          name="PayPal"
          description="Send a gift securely through PayPal using our email address."
          detail="admin@covenantassembly.org"
          action={{
            label: 'Donate via PayPal',
            href: 'https://www.paypal.com/donate?business=admin%40covenantassembly.org',
          }}
          note="You can also log in to PayPal → Send & Request → enter this email address"
        />
      )
      expect(screen.getByText('PayPal')).toBeInTheDocument()
      expect(screen.getByText('admin@covenantassembly.org')).toBeInTheDocument()
      const link = screen.getByRole('link', { name: 'Donate via PayPal' })
      expect(link).toHaveAttribute(
        'href',
        'https://www.paypal.com/donate?business=admin%40covenantassembly.org'
      )
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(
        screen.getByText('You can also log in to PayPal → Send & Request → enter this email address')
      ).toBeInTheDocument()
    })
  })
})
