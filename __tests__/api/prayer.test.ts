/**
 * @jest-environment node
 */
import { POST } from '@/app/api/prayer/route'
import { __resetRateLimit } from '@/lib/rate-limit'

const mockCreate = jest.fn().mockResolvedValue({ _id: 'doc-1' })
const mockSend = jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })

jest.mock('@sanity/client', () => ({
  createClient: () => ({
    fetch: jest.fn().mockResolvedValue({ notificationEmail: 'prayer@example.com' }),
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
  name: 'Jane Doe',
  email: 'jane@example.com',
  request: 'Please pray for my family.',
  isAnonymous: false,
}

function makeRequest(body: Record<string, unknown>, ip = '203.0.113.2') {
  return new Request('http://localhost/api/prayer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/prayer', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    __resetRateLimit()
    mockCreate.mockClear().mockResolvedValue({ _id: 'doc-1' })
    mockSend.mockClear().mockResolvedValue({ data: { id: 'test-id' }, error: null })
  })

  describe('validation', () => {
    it('returns 400 when name is missing', async () => {
      const res = await POST(makeRequest({ request: 'Pray for me' }))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('Name and prayer request are required.')
    })

    it('returns 400 when request is missing', async () => {
      const res = await POST(makeRequest({ name: 'Jane' }))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('Name and prayer request are required.')
    })

    it('returns 400 when request is whitespace-only', async () => {
      const res = await POST(makeRequest({ ...VALID, request: '   ' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for a malformed email when one is supplied', async () => {
      const res = await POST(makeRequest({ ...VALID, email: 'notanemail' }))
      expect(res.status).toBe(400)
      expect((await res.json()).error).toBe('Invalid email address.')
    })

    it('accepts a submission with no email at all', async () => {
      const res = await POST(makeRequest({ name: 'Jane', request: 'Pray for me' }))
      expect(res.status).toBe(200)
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  describe('valid submission', () => {
    it('returns success: true with status 200', async () => {
      const res = await POST(makeRequest(VALID))
      expect(res.status).toBe(200)
      expect((await res.json()).success).toBe(true)
    })

    it('persists the request to Sanity', async () => {
      await POST(makeRequest(VALID))
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: 'prayerRequest',
          name: 'Jane Doe',
          email: 'jane@example.com',
          request: 'Please pray for my family.',
          isAnonymous: false,
          status: 'new',
        })
      )
    })

    it('sends a notification to the configured address', async () => {
      await POST(makeRequest(VALID))
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'prayer@example.com',
          subject: '[Prayer Request] New request from Jane Doe',
        })
      )
    })
  })

  describe('anonymity', () => {
    it('stores the submitter as Anonymous when requested', async () => {
      await POST(makeRequest({ ...VALID, isAnonymous: true }))
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Anonymous', isAnonymous: true })
      )
    })

    it('does not leak the real name into the notification subject', async () => {
      await POST(makeRequest({ ...VALID, isAnonymous: true }))
      const [{ subject, text }] = mockSend.mock.calls[0]
      expect(subject).not.toContain('Jane Doe')
      expect(text).not.toContain('Jane Doe')
    })
  })

  describe('email delivery failure', () => {
    it('still returns success because the request was persisted', async () => {
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
    it('returns 500 when the request cannot be stored', async () => {
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
      expect(mockCreate).not.toHaveBeenCalled()
      expect(mockSend).not.toHaveBeenCalled()
    })
  })

  describe('rate limiting', () => {
    it('returns 429 after the per-IP limit is exceeded', async () => {
      for (let i = 0; i < 5; i++) {
        expect((await POST(makeRequest(VALID, '198.51.100.20'))).status).toBe(200)
      }
      const res = await POST(makeRequest(VALID, '198.51.100.20'))
      expect(res.status).toBe(429)
      expect(res.headers.get('Retry-After')).toBeTruthy()
    })
  })

  describe('internal errors', () => {
    it('returns 500 when request body is malformed JSON', async () => {
      const badReq = new Request('http://localhost/api/prayer', {
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
