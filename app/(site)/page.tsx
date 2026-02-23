import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY, LATEST_SERMON_QUERY, UPCOMING_EVENTS_QUERY } from '@/lib/sanity/queries'
import type { SiteSettings, Sermon, Event } from '@/lib/types'
import { Hero } from '@/components/home/Hero'
import { ServiceTimesSection } from '@/components/home/ServiceTimesSection'
import { LatestSermon } from '@/components/home/LatestSermon'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { AboutTeaser } from '@/components/home/AboutTeaser'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to RCCG Covenant Assembly in Avondale, AZ — a welcoming community of faith for all.',
}

export default async function HomePage() {
  const now = new Date().toISOString()

  const [settings, latestSermon, upcomingEvents] = await Promise.all([
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    client.fetch<Sermon | null>(LATEST_SERMON_QUERY),
    client.fetch<Event[]>(UPCOMING_EVENTS_QUERY, { now }),
  ])

  const churchName = settings?.name ?? 'The Redeemed Christian Church of God Covenant Assembly'
  const serviceTimes = settings?.serviceTimes ?? []

  return (
    <>
      <Hero
        name={churchName}
        tagline={settings?.tagline}
        livestreamUrl={settings?.livestreamUrl}
        heroImages={settings?.heroImages}
      />
      <ServiceTimesSection serviceTimes={serviceTimes} />
      <LatestSermon sermon={latestSermon} />
      <UpcomingEvents events={upcomingEvents ?? []} />
      <AboutTeaser />
    </>
  )
}
