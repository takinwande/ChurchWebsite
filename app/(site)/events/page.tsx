import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { EVENTS_QUERY } from '@/lib/sanity/queries'
import type { Event } from '@/lib/types'
import { EventCard } from '@/components/events/EventCard'
import { CalendarDays } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, AnimatedCard } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Events',
  description: 'Browse upcoming and past events at RCCG Covenant Assembly.',
}

export default async function EventsPage() {
  const events = await client.fetch<Event[]>(EVENTS_QUERY)
  const now = new Date()
  const upcoming = (events ?? []).filter((e) => new Date(e.startDateTime) >= now)
  const past = (events ?? []).filter((e) => new Date(e.startDateTime) < now)

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Events</h1>
            <p className="mt-2 text-muted-foreground">Stay connected with what&apos;s happening in our community.</p>
          </div>
        </FadeIn>

        {upcoming.length > 0 ? (
          <section aria-label="Upcoming events">
            <FadeIn delay={0.05}>
              <h2 className="mb-6 text-xl font-semibold text-foreground">Upcoming</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <StaggerItem key={event._id}>
                  <AnimatedCard>
                    <EventCard event={event} />
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        ) : (
          <div className="flex flex-col items-center py-20 text-center text-muted-foreground">
            <CalendarDays className="mb-4 h-12 w-12 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium">No upcoming events</p>
            <p className="mt-1 text-sm">Check back soon for new announcements.</p>
          </div>
        )}

        {past.length > 0 && (
          <section className="mt-14" aria-label="Past events">
            <FadeIn>
              <h2 className="mb-6 text-xl font-semibold text-muted-foreground">Past Events</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <StaggerItem key={event._id}>
                  <AnimatedCard>
                    <EventCard event={event} />
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}
      </div>
    </div>
  )
}
