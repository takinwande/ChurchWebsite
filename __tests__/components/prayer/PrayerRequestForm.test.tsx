import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrayerRequestForm } from '@/components/prayer/PrayerRequestForm'

// Suppress act() warnings from Radix during tests
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterAll(() => jest.restoreAllMocks())

describe('PrayerRequestForm', () => {
  describe('rendering', () => {
    it('renders the Name field', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    })

    it('renders the Email field', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('renders the Prayer Request textarea', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByRole('textbox', { name: /^prayer request$/i })).toBeInTheDocument()
    })

    it('renders the anonymous checkbox', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByLabelText(/keep my name anonymous/i)).toBeInTheDocument()
    })

    it('renders the submit button', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByRole('button', { name: /submit prayer request/i })).toBeInTheDocument()
    })

    it('anonymous checkbox is unchecked by default', () => {
      render(<PrayerRequestForm />)
      expect(screen.getByLabelText(/keep my name anonymous/i)).not.toBeChecked()
    })
  })

  describe('client-side validation on submit', () => {
    it('shows "Name is required." when name is empty', async () => {
      render(<PrayerRequestForm />)
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    })

    it('shows prayer request error when request is empty', async () => {
      render(<PrayerRequestForm />)
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Please share your prayer request.')).toBeInTheDocument()
    })

    it('shows invalid email message for malformed email', async () => {
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/email/i), 'notvalid')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray for healing.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
    })

    it('does not show email error when email is empty (field is optional)', async () => {
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray for me.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
    })
  })

  describe('error clearing on change', () => {
    it('clears the name error when the user types into the name field', async () => {
      render(<PrayerRequestForm />)
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Name is required.')).toBeInTheDocument()
      await userEvent.type(screen.getByLabelText(/^name$/i), 'J')
      expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    })

    it('clears the request error when the user types into the request field', async () => {
      render(<PrayerRequestForm />)
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Please share your prayer request.')).toBeInTheDocument()
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'P')
      expect(screen.queryByText('Please share your prayer request.')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('shows "Submitting…" and disables the button while submitting', async () => {
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray for my family.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()
      })
    })
  })

  describe('success state', () => {
    it('shows "Prayer Request Received" after a successful submission', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray for my family.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText('Prayer Request Received')).toBeInTheDocument()
    })

    it('shows "Submit another request" button after success', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Healing prayer.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByRole('button', { name: /submit another request/i })).toBeInTheDocument()
    })

    it('clicking "Submit another request" returns to the form', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Healing prayer.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      await screen.findByText('Prayer Request Received')
      await userEvent.click(screen.getByRole('button', { name: /submit another request/i }))
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('shows error alert when fetch returns ok: false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: false } as Response)
      ) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    })

    it('shows error alert when fetch throws a network error', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray.')
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  describe('anonymous checkbox', () => {
    it('can be checked and unchecked', async () => {
      render(<PrayerRequestForm />)
      const checkbox = screen.getByLabelText(/keep my name anonymous/i)
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('sends isAnonymous: true when checkbox is checked', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      global.fetch = mockFetch
      render(<PrayerRequestForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByRole('textbox', { name: /^prayer request$/i }), 'Please pray.')
      await userEvent.click(screen.getByLabelText(/keep my name anonymous/i))
      await userEvent.click(screen.getByRole('button', { name: /submit prayer request/i }))
      await screen.findByText('Prayer Request Received')
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.isAnonymous).toBe(true)
    })
  })
})
