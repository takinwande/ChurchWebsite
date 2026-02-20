import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/contact/ContactForm'

// Suppress act() warnings from Radix during tests
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterAll(() => jest.restoreAllMocks())

describe('ContactForm', () => {
  describe('rendering', () => {
    it('renders the Name field', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    })

    it('renders the Email field', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    })

    it('renders the Subject field', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText(/^subject$/i)).toBeInTheDocument()
    })

    it('renders the Message field', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument()
    })

    it('renders the Send Message submit button', () => {
      render(<ContactForm />)
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })
  })

  describe('client-side validation on submit', () => {
    it('shows "Name is required." when name is empty', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    })

    it('shows "Email is required." when email is empty', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Email is required.')).toBeInTheDocument()
    })

    it('shows "Subject is required." when subject is empty', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Subject is required.')).toBeInTheDocument()
    })

    it('shows "Message is required." when message is empty', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Message is required.')).toBeInTheDocument()
    })

    it('shows invalid email message for malformed email', async () => {
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'notvalid')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test message')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(
        await screen.findByText('Please enter a valid email address.')
      ).toBeInTheDocument()
    })
  })

  describe('error clearing on change', () => {
    it('clears the name error when the user types into the name field', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Name is required.')).toBeInTheDocument()
      await userEvent.type(screen.getByLabelText(/^name$/i), 'J')
      expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    })

    it('clears the email error when the user types into the email field', async () => {
      render(<ContactForm />)
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Email is required.')).toBeInTheDocument()
      await userEvent.type(screen.getByLabelText(/^email$/i), 'a')
      expect(screen.queryByText('Email is required.')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('shows "Sending…" and disables the button while submitting', async () => {
      // fetch never resolves to hold the loading state
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test message')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
      })
    })
  })

  describe('success state', () => {
    it('shows "Message Sent!" after a successful submission', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test message')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText('Message Sent!')).toBeInTheDocument()
    })

    it('shows "Send another message" button after success', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(
        await screen.findByRole('button', { name: /send another message/i })
      ).toBeInTheDocument()
    })

    it('clicking "Send another message" returns to the form', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      await screen.findByText('Message Sent!')
      await userEvent.click(screen.getByRole('button', { name: /send another message/i }))
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('shows error alert when fetch returns ok: false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: false } as Response)
      ) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    })

    it('shows error alert when fetch throws a network error', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock
      render(<ContactForm />)
      await userEvent.type(screen.getByLabelText(/^name$/i), 'John')
      await userEvent.type(screen.getByLabelText(/^email$/i), 'john@example.com')
      await userEvent.type(screen.getByLabelText(/^subject$/i), 'Hello')
      await userEvent.type(screen.getByLabelText(/^message$/i), 'Test')
      await userEvent.click(screen.getByRole('button', { name: /send message/i }))
      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    })
  })
})
