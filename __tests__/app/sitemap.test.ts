/**
 * @jest-environment node
 */
import sitemap from '@/app/sitemap'

const mockFetch = jest.fn()

jest.mock('@/lib/sanity/client', () => ({
  client: { fetch: (...args: unknown[]) => mockFetch(...args) },
}))

/**
 * Every public page. `/ministries` was live and linked from the navbar for
 * months while being absent from both the sitemap and the footer, because each
 * list is maintained by hand and independently. This is the guard for that.
 */
const PUBLIC_ROUTES = [
  '/',
  '/plan-a-visit',
  '/sermons',
  '/events',
  '/about',
  '/ministries',
  '/gallery',
  '/give',
  '/prayer',
  '/contact',
]

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

async function urls() {
  return (await sitemap()).map((entry) => entry.url)
}

describe('sitemap', () => {
  beforeEach(() => {
    mockFetch.mockReset().mockResolvedValue({ sermons: [], events: [], galleryAlbums: [] })
  })

  it.each(PUBLIC_ROUTES)('includes %s', async (route) => {
    const expected = route === '/' ? BASE : `${BASE}${route}`
    expect(await urls()).toContain(expected)
  })

  it('lists every public route and no duplicates', async () => {
    const found = await urls()
    expect(found).toHaveLength(PUBLIC_ROUTES.length)
    expect(new Set(found).size).toBe(found.length)
  })

  it('appends Sanity-driven routes after the static ones', async () => {
    mockFetch.mockResolvedValue({
      sermons: [{ slug: { current: 'grace-abounds' }, date: '2026-02-22T00:00:00' }],
      events: [{ slug: { current: 'digging-deep-2026-08-05' }, startDateTime: '2026-08-05T19:00:00' }],
      galleryAlbums: [{ slug: { current: 'family-retreat' }, date: '2026-04-20T00:00:00' }],
    })

    const found = await urls()
    expect(found).toContain(`${BASE}/sermons/grace-abounds`)
    expect(found).toContain(`${BASE}/events/digging-deep-2026-08-05`)
    expect(found).toContain(`${BASE}/gallery/family-retreat`)
  })

  // The sitemap is generated at build time; a Sanity outage should degrade to
  // the static routes rather than fail the build.
  it('falls back to the static routes when Sanity is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('Sanity unavailable'))

    const found = await urls()
    expect(found).toHaveLength(PUBLIC_ROUTES.length)
    expect(found).toContain(`${BASE}/ministries`)
  })

  it('gives every entry a priority and change frequency', async () => {
    for (const entry of await sitemap()) {
      expect(entry.priority).toBeGreaterThan(0)
      expect(entry.changeFrequency).toBeTruthy()
    }
  })
})
