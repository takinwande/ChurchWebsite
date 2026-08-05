import Link from 'next/link'
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatShortDate } from '@/lib/utils'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
  /**
   * Whether the event has already happened.
   *
   * Passed in rather than derived from `new Date()`, so the badge always agrees
   * with the section the card is rendered under. The events page groups on
   * midnight today, so deriving from the current instant would dim an event
   * happening later today and label it "Past Event" while the page still lists
   * it under Upcoming.
   */
  isPast?: boolean
}

export function EventCard({ event, isPast = false }: EventCardProps) {

  return (
    <Card className={`flex flex-col h-full transition-shadow hover:shadow-md ${isPast ? 'opacity-70' : ''}`}>
      <CardContent className="flex flex-col flex-1 p-5">
        {event.featured && (
          <Badge className="mb-2 self-start">Featured</Badge>
        )}
        {isPast && (
          <Badge variant="secondary" className="mb-2 self-start">Past Event</Badge>
        )}

        <div className="mb-2 flex items-center gap-2 text-primary">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {formatShortDate(event.startDateTime)}
          </span>
        </div>

        <Link href={`/events/${event.slug.current}`} className="group">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug sm:text-lg">
            {event.title}
          </h3>
        </Link>

        {event.location && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex gap-2">
          <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary -ml-2">
            <Link href={`/events/${event.slug.current}`}>View details →</Link>
          </Button>
          {event.registrationUrl && (
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Register
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
