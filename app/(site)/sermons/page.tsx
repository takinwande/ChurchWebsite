import type { Metadata } from 'next'
import { Suspense } from 'react'
import { client } from '@/lib/sanity/client'
import { SERMONS_QUERY, ALL_SERIES_QUERY, ALL_SPEAKERS_QUERY } from '@/lib/sanity/queries'
import type { Sermon, SermonSeries, Speaker } from '@/lib/types'
import { SermonCard } from '@/components/sermons/SermonCard'
import { SermonFilters } from '@/components/sermons/SermonFilters'
import { BookOpen } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sermons',
  description: 'Browse sermons, messages, and teachings from RCCG Covenant Assembly.',
}

interface SermonsPageProps {
  searchParams: { series?: string; speaker?: string; q?: string }
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const [allSermons, series, speakers] = await Promise.all([
    client.fetch<Sermon[]>(SERMONS_QUERY, {
      series: searchParams.series ?? null,
      speaker: searchParams.speaker ?? null,
    }),
    client.fetch<SermonSeries[]>(ALL_SERIES_QUERY),
    client.fetch<Speaker[]>(ALL_SPEAKERS_QUERY),
  ])

  // Client-side text search (applied after server filter)
  const q = searchParams.q?.toLowerCase() ?? ''
  const sermons = q
    ? allSermons.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.speaker?.name?.toLowerCase().includes(q) ||
          s.series?.title?.toLowerCase().includes(q)
      )
    : allSermons

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Sermons</h1>
          <p className="mt-2 text-muted-foreground">
            Listen to or watch past messages and teachings.
          </p>
        </div>

        {/* Filters */}
        <Suspense>
          <SermonFilters series={series ?? []} speakers={speakers ?? []} />
        </Suspense>

        {/* Results */}
        {sermons && sermons.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard key={sermon._id} sermon={sermon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center text-muted-foreground">
            <BookOpen className="mb-4 h-12 w-12 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium">No sermons found</p>
            <p className="mt-1 text-sm">Try adjusting your filters or check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
