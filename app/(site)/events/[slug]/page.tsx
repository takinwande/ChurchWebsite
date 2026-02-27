import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { EVENT_BY_SLUG_QUERY, EVENTS_QUERY } from '@/lib/sanity/queries'
import type { Event } from '@/lib/types'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, formatShortDate } from '@/lib/utils'
import { ChevronLeft, CalendarDays, MapPin, ExternalLink, Clock } from 'lucide-react'
import { SlideUp, FadeIn } from '@/components/animation'

export const revalidate = 300

interface EventPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await client.fetch<Event>(EVENT_BY_SLUG_QUERY, { slug: params.slug })
  if (!event) return {}
  return {
    title: event.title,
    description: `${event.location ?? ''} · ${formatShortDate(event.startDateTime)}`,
  }
}

export async function generateStaticParams() {
  const events = await client.fetch<Event[]>(`*[_type == "event"]{ slug }`)
  return (events ?? []).map((e) => ({ slug: e.slug.current }))
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const event = await client.fetch<Event>(EVENT_BY_SLUG_QUERY, { slug: params.slug })
  if (!event) notFound()

  const isPast = new Date(event.startDateTime) < new Date()

  return (
    <div className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/events">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All Events
            </Link>
          </Button>

          <SlideUp>
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {event.featured && <Badge>Featured</Badge>}
                {isPast && <Badge variant="secondary">Past Event</Badge>}
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">{event.title}</h1>
            </div>
          </SlideUp>

          {/* Event meta */}
          <FadeIn delay={0.1}>
            <div className="mb-8 rounded-xl border border-border bg-slate-50 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">{formatDateTime(event.startDateTime)}</p>
                  {event.endDateTime && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Until {formatDateTime(event.endDateTime)}
                    </p>
                  )}
                </div>
              </div>
              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm text-foreground">{event.location}</p>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Description */}
          {event.description && event.description.length > 0 && (
            <section aria-label="Event description">
              <PortableTextRenderer value={event.description} />
            </section>
          )}

          {/* Registration CTA */}
          {event.registrationUrl && (
            <div className="mt-8">
              <Separator className="mb-8" />
              <Button asChild size="lg">
                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Register for this Event
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
