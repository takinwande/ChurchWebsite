/**
 * @jest-environment node
 */
import { POST } from '@/app/api/contact/route'

jest.mock('@sanity/client', () => ({
  createClient: () => ({
    fetch: jest.fn().mockResolvedValue({ notificationEmail: 'test@example.com' }),
  }),
}))

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-id' }),
    },
  })),
}))

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  describe('returns 400 when required fields are missing or empty', () => {
    it('returns 400 when name is missing', async () => {
      const res = await POST(makeRequest({ email: 'a@b.com', subject: 'Test', message: 'Hi' }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('All fields are required.')
    })

    it('returns 400 when email is missing', async () => {
      const res = await POST(makeRequest({ name: 'John', subject: 'Test', message: 'Hi' }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('All fields are required.')
    })

    it('returns 400 when subject is missing', async () => {
      const res = await POST(makeRequest({ name: 'John', email: 'a@b.com', message: 'Hi' }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('All fields are required.')
    })

    it('returns 400 when message is missing', async () => {
      const res = await POST(makeRequest({ name: 'John', email: 'a@b.com', subject: 'Test' }))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('All fields are required.')
    })

    it('returns 400 when name is whitespace-only', async () => {
      const res = await POST(
        makeRequest({ name: '   ', email: 'a@b.com', subject: 'Test', message: 'Hi' })
      )
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('All fields are required.')
    })

    it('returns 400 when message is whitespace-only', async () => {
      const res = await POST(
        makeRequest({ name: 'John', email: 'a@b.com', subject: 'Test', message: '   ' })
      )
      expect(res.status).toBe(400)
    })
  })

  describe('returns 400 for invalid email', () => {
    it('rejects email without @', async () => {
      const res = await POST(
        makeRequest({ name: 'John', email: 'notanemail', subject: 'Test', message: 'Hi' })
      )
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('Invalid email address.')
    })

    it('rejects email without domain part after @', async () => {
      const res = await POST(
        makeRequest({ name: 'John', email: 'user@', subject: 'Test', message: 'Hi' })
      )
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toBe('Invalid email address.')
    })
  })

  describe('returns 200 on valid submission', () => {
    it('returns success: true with status 200', async () => {
      const res = await POST(
        makeRequest({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Hello',
          message: 'This is a message.',
        })
      )
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
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
      const data = await res.json()
      expect(data.error).toBe('Internal server error.')
    })
  })
})
