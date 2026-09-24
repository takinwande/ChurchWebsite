/**
 * @jest-environment node
 */
import { POST } from '@/app/api/contact/route'
import { __resetRateLimit } from '@/lib/rate-limit'

const mockFetch = jest.fn().mockResolvedValue({ notificationEmail: 'test@example.com' })
const mockCreate = jest.fn().mockResolvedValue({ _id: 'doc-1' })
const mockSend = jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })

jest.mock('@sanity/client', () => ({
  createClient: () => ({
    fetch: (...args: unknown[]) => mockFetch(...args),
    create: (...args: unknown[]) => mockCreate(...args),
  }),
}))

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: (...args: unknown[]) => mockSend(...args),
    },
  })),
}))

const VALID = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Hello',
  message: 'This is a message.',
}

function makeRequest(body: Record<string, unknown>, ip = '203.0.113.1') {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    __resetRateLimit()
    mockFetch.mockClear().mockResolvedValue({ notificationEmail: 'test@example.com' })
    mockCreate.mockClear().mockResolvedValue({ _id: 'doc-1' })
    mockSend.mockClear().mockResolvedValue({ data: { id: 'test-id' }, error: null })
  })

  describe('returns 400 when required fields are missing or empty', () => {
    it.each([
      ['name', { email: 'a@b.com', subject: 'Test', message: 'Hi' }],
      ['email', { name: 'John', subject: 'Test', message: 'Hi' }],
      ['subject', { name: 'John', email: 'a@b.com', message: 'Hi' }],
      ['message', { name: 'John', email: 'a@b.com', subject: 'Test' }],
    ])('returns 400 when %s is missing', async (_field, body) => {
      const res = await POST(makeRequest(body))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('All fields are required.')
    })

    it('returns 400 when name is whitespace-only', async () => {
      const res = await POST(makeRequest({ ...VALID, name: '   ' }))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('All fields are required.')
    })

    it('returns 400 when message is whitespace-only', async () => {
      const res = await POST(makeRequest({ ...VALID, message: '   ' }))
      expect(res.status).toBe(400)
    })

    it('does not persist or email an invalid submission', async () => {
      await POST(makeRequest({ ...VALID, name: '' }))
      expect(mockCreate).not.toHaveBeenCalled()
      expect(mockSend).not.toHaveBeenCalled()
    })
  })

  describe('returns 400 for invalid email', () => {
    it.each(['notanemail', 'user@', '@example.com'])('rejects %s', async (email) => {
      const res = await POST(makeRequest({ ...VALID, email }))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('Invalid email address.')
    })
  })

  describe('valid submission', () => {
    it('returns success: true with status 200', async () => {
      const res = await POST(makeRequest(VALID))
      expect(res.status).toBe(200)
      expect((await res.json()).success).toBe(true)
    })

    it('persists the submission to Sanity before emailing', async () => {
      await POST(makeRequest(VALID))
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: 'contactSubmission',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Hello',
          message: 'This is a message.',
          status: 'new',
        })
      )
    })

    it('trims whitespace before persisting', async () => {
      await POST(makeRequest({ ...VALID, name: '  John Doe  ', subject: '  Hello  ' }))
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'John Doe', subject: 'Hello' })
      )
    })

    it('sends the notification with the submitter as reply-to', async () => {
      await POST(makeRequest(VALID))
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['test@example.com'],
          replyTo: 'john@example.com',
          subject: '[Contact] Hello',
        })
      )
    })

    it('notifies every address when Notification Email has more than one, comma-separated', async () => {
      mockFetch.mockResolvedValue({ notificationEmail: 'a@example.com, b@example.com' })
      await POST(makeRequest(VALID))
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({ to: ['a@example.com', 'b@example.com'] })
      )
    })
  })

  describe('email delivery failure', () => {
    // Resend resolves with { data, error } instead of throwing, so a rejected
    // send is only detectable by inspecting the error field.
    it('still returns success because the submission was persisted', async () => {
      mockSend.mockResolvedValue({ data: null, error: { message: 'Domain not verified' } })
      const res = await POST(makeRequest(VALID))
      expect(res.status).toBe(200)
      expect((await res.json()).success).toBe(true)
      expect(mockCreate).toHaveBeenCalled()
    })

    it('logs the failure rather than swallowing it', async () => {
      mockSend.mockResolvedValue({ data: null, error: { message: 'Domain not verified' } })
      await POST(makeRequest(VALID))
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('email notification FAILED')
      )
    })
  })

  describe('persistence failure', () => {
    it('returns 500 when the submission cannot be stored', async () => {
      mockCreate.mockRejectedValue(new Error('Sanity unavailable'))
      const res = await POST(makeRequest(VALID))
      expect(res.status).toBe(500)
      expect((await res.json()).error).toBe('Internal server error.')
    })
  })

  describe('honeypot', () => {
    it('silently discards submissions that fill the trap field', async () => {
      const res = await POST(makeRequest({ ...VALID, website: 'http://spam.example' }))
      expect(res.status).toBe(200)
      expect((await res.json()).success).toBe(true)
      expect(mockCreate).not.toHaveBeenCalled()
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('accepts submissions that leave the trap field empty', async () => {
      const res = await POST(makeRequest({ ...VALID, website: '' }))
      expect(res.status).toBe(200)
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  describe('rate limiting', () => {
    it('returns 429 after the per-IP limit is exceeded', async () => {
      for (let i = 0; i < 5; i++) {
        const ok = await POST(makeRequest(VALID, '198.51.100.7'))
        expect(ok.status).toBe(200)
      }
      const res = await POST(makeRequest(VALID, '198.51.100.7'))
      expect(res.status).toBe(429)
      expect(res.headers.get('Retry-After')).toBeTruthy()
    })

    it('tracks limits per IP', async () => {
      for (let i = 0; i < 6; i++) await POST(makeRequest(VALID, '198.51.100.8'))
      const other = await POST(makeRequest(VALID, '198.51.100.9'))
      expect(other.status).toBe(200)
    })
  })

  describe('returns 500 on internal error', () => {
    it('returns 500 when request body is malformed JSON', async () => {
      const badReq = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json{{{',
      })
      const res = await POST(badReq)
      expect(res.status).toBe(500)
      expect((await res.json()).error).toBe('Internal server error.')
    })
  })
})
