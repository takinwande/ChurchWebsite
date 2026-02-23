import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { SITEMAP_QUERY } from '@/lib/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/plan-a-visit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/sermons`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/give`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/prayer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const data = await client.fetch<{
      sermons: { slug: { current: string }; date: string }[]
      events: { slug: { current: string }; startDateTime: string }[]
      galleryAlbums: { slug: { current: string }; date: string }[]
    }>(SITEMAP_QUERY)

    const sermonRoutes: MetadataRoute.Sitemap = (data?.sermons ?? []).map((s) => ({
      url: `${BASE_URL}/sermons/${s.slug.current}`,
      lastModified: new Date(s.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const eventRoutes: MetadataRoute.Sitemap = (data?.events ?? []).map((e) => ({
      url: `${BASE_URL}/events/${e.slug.current}`,
      lastModified: new Date(e.startDateTime),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const galleryRoutes: MetadataRoute.Sitemap = (data?.galleryAlbums ?? []).map((a) => ({
      url: `${BASE_URL}/gallery/${a.slug.current}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticRoutes, ...sermonRoutes, ...eventRoutes, ...galleryRoutes]
  } catch {
    return staticRoutes
  }
}
