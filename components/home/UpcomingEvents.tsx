import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatShortDate } from '@/lib/utils'
import type { Event } from '@/lib/types'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation'

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (!events || events.length === 0) return null

  return (
    <section className="bg-slate-50 py-16" aria-label="Upcoming events">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Upcoming Events</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                <Link href="/events">View all events →</Link>
              </Button>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <StaggerItem key={event._id}>
                <Link href={`/events/${event.slug.current}`} className="group block">
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-primary">
                        <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {formatShortDate(event.startDateTime)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {event.title}
                      </h3>
                      {event.location && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
