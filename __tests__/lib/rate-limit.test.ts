/**
 * @jest-environment node
 */
import { rateLimit, getClientIp, __resetRateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    __resetRateLimit()
  })

  it('allows requests up to the limit', () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit('user', 5).allowed).toBe(true)
    }
  })

  it('blocks the request that exceeds the limit', () => {
    for (let i = 0; i < 5; i++) rateLimit('user', 5)
    expect(rateLimit('user', 5).allowed).toBe(false)
  })

  it('reports a positive retry-after when blocked', () => {
    for (let i = 0; i < 3; i++) rateLimit('user', 2)
    const result = rateLimit('user', 2)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('keeps separate counters per key', () => {
    for (let i = 0; i < 5; i++) rateLimit('a', 5)
    expect(rateLimit('a', 5).allowed).toBe(false)
    expect(rateLimit('b', 5).allowed).toBe(true)
  })

  it('allows requests again once the window expires', () => {
    jest.useFakeTimers()
    try {
      for (let i = 0; i < 5; i++) rateLimit('user', 5, 1000)
      expect(rateLimit('user', 5, 1000).allowed).toBe(false)

      jest.advanceTimersByTime(1001)
      expect(rateLimit('user', 5, 1000).allowed).toBe(true)
    } finally {
      jest.useRealTimers()
    }
  })
})

describe('getClientIp', () => {
  function req(headers: Record<string, string>) {
    return new Request('http://localhost/api/contact', { method: 'POST', headers })
  }

  it('reads the first entry of x-forwarded-for', () => {
    expect(getClientIp(req({ 'x-forwarded-for': '203.0.113.1, 70.41.3.18' }))).toBe('203.0.113.1')
  })

  it('trims surrounding whitespace', () => {
    expect(getClientIp(req({ 'x-forwarded-for': '  203.0.113.1  ' }))).toBe('203.0.113.1')
  })

  it('falls back to x-real-ip', () => {
    expect(getClientIp(req({ 'x-real-ip': '203.0.113.9' }))).toBe('203.0.113.9')
  })

  it('returns "unknown" when no proxy headers are present', () => {
    expect(getClientIp(req({}))).toBe('unknown')
  })
})
