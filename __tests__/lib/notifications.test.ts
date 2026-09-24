/**
 * @jest-environment node
 */
const mockFetch = jest.fn()
const mockSend = jest.fn()

jest.mock('@sanity/client', () => ({
  createClient: () => ({ fetch: (...args: unknown[]) => mockFetch(...args) }),
}))

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: (...args: unknown[]) => mockSend(...args) },
  })),
}))

import { getNotificationEmail, sendNotificationEmail } from '@/lib/notifications'

const FALLBACK = 'admin@covenantassembly.org'

describe('getNotificationEmail', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns a single address as a one-element array', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'admin@example.com' })
    expect(await getNotificationEmail()).toEqual(['admin@example.com'])
  })

  it('splits comma-separated addresses', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'a@example.com, b@example.com' })
    expect(await getNotificationEmail()).toEqual(['a@example.com', 'b@example.com'])
  })

  it('trims whitespace around each address, commas with or without a following space', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: '  a@example.com ,b@example.com  ,  c@example.com' })
    expect(await getNotificationEmail()).toEqual(['a@example.com', 'b@example.com', 'c@example.com'])
  })

  it('drops empty entries from stray or trailing commas', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'a@example.com,,b@example.com,' })
    expect(await getNotificationEmail()).toEqual(['a@example.com', 'b@example.com'])
  })

  // A church admin typo in one address shouldn't silently drop every other
  // recipient, and shouldn't be indistinguishable from "field left blank".
  it('drops a malformed entry but keeps the valid ones alongside it', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'admin@example.com, not-an-email' })
    expect(await getNotificationEmail()).toEqual(['admin@example.com'])
  })

  it('warns when it drops a malformed entry', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'admin@example.com, not-an-email' })
    await getNotificationEmail()
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('not-an-email'))
  })

  it('does not warn when every entry is valid', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'admin@example.com, staff@example.com' })
    await getNotificationEmail()
    expect(console.warn).not.toHaveBeenCalled()
  })

  it.each([
    ['blank field', ''],
    ['whitespace-only field', '   '],
    ['field missing entirely', undefined],
  ])('falls back to the default address when %s', async (_label, value) => {
    mockFetch.mockResolvedValue({ notificationEmail: value })
    expect(await getNotificationEmail()).toEqual([FALLBACK])
  })

  it('falls back to the default address when every entry is malformed', async () => {
    mockFetch.mockResolvedValue({ notificationEmail: 'not-an-email, also not one' })
    expect(await getNotificationEmail()).toEqual([FALLBACK])
  })

  it('falls back to the default address when Sanity is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('network error'))
    expect(await getNotificationEmail()).toEqual([FALLBACK])
  })

  it('falls back to the default address when siteSettings has no document', async () => {
    mockFetch.mockResolvedValue(null)
    expect(await getNotificationEmail()).toEqual([FALLBACK])
  })
})

describe('sendNotificationEmail', () => {
  beforeEach(() => {
    mockSend.mockReset().mockResolvedValue({ data: { id: 'test-id' }, error: null })
  })

  it('passes a single recipient straight through to Resend', async () => {
    await sendNotificationEmail({ to: 'admin@example.com', subject: 'Subject', text: 'Body' })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'admin@example.com' }))
  })

  it('passes multiple recipients through as an array', async () => {
    await sendNotificationEmail({
      to: ['a@example.com', 'b@example.com'],
      subject: 'Subject',
      text: 'Body',
    })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['a@example.com', 'b@example.com'] })
    )
  })

  it('reports failure when Resend resolves with an error rather than throwing', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Domain not verified' } })
    const result = await sendNotificationEmail({
      to: ['a@example.com', 'b@example.com'],
      subject: 'Subject',
      text: 'Body',
    })
    expect(result).toEqual({ sent: false, error: 'Domain not verified' })
  })
})
