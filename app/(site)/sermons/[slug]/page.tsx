import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { SERMON_BY_SLUG_QUERY, SERMONS_QUERY } from '@/lib/sanity/queries'
import type { SermonDetail, Sermon } from '@/lib/types'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { AudioPlayer } from '@/components/sermons/AudioPlayer'
import { SermonCard } from '@/components/sermons/SermonCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate, getYouTubeEmbedUrl } from '@/lib/utils'
import { ChevronLeft, BookOpen, Download, ExternalLink } from 'lucide-react'

export const revalidate = 300

interface SermonPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: SermonPageProps): Promise<Metadata> {
  const sermon = await client.fetch<SermonDetail>(SERMON_BY_SLUG_QUERY, { slug: params.slug })
  if (!sermon) return {}
  return {
    title: sermon.title,
    description: `${sermon.speaker?.name ?? 'Message'} · ${formatDate(sermon.date)}`,
  }
}

export async function generateStaticParams() {
  const sermons = await client.fetch<Sermon[]>(`*[_type == "sermon"]{ slug }`)
  return (sermons ?? []).map((s) => ({ slug: s.slug.current }))
}

export default async function SermonDetailPage({ params }: SermonPageProps) {
  const sermon = await client.fetch<SermonDetail>(SERMON_BY_SLUG_QUERY, { slug: params.slug })
  if (!sermon) notFound()

  const youtubeEmbedUrl = sermon.youtubeUrl ? getYouTubeEmbedUrl(sermon.youtubeUrl) : null
  const relatedSermons = sermon.series?.sermons?.filter((s) => s.slug.current !== params.slug) ?? []

  return (
    <div className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/sermons">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All Sermons
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-6">
            {sermon.series && (
              <Badge variant="secondary" className="mb-3">
                {sermon.series.title}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl leading-tight">
              {sermon.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {sermon.speaker?.name && <span>{sermon.speaker.name}</span>}
              {sermon.speaker?.name && sermon.date && <span className="mx-1.5">·</span>}
              {sermon.date && <span>{formatDate(sermon.date)}</span>}
            </p>
          </div>

          {/* Scripture refs */}
          {sermon.scriptureRefs && sermon.scriptureRefs.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {sermon.scriptureRefs.map((ref) => (
                <Badge key={ref} variant="outline" className="text-xs">
                  <BookOpen className="mr-1 h-3 w-3" aria-hidden="true" />
                  {ref}
                </Badge>
              ))}
            </div>
          )}

          {/* YouTube embed */}
          {youtubeEmbedUrl && (
            <div className="mb-6 overflow-hidden rounded-xl border border-border bg-black aspect-video">
              <iframe
                src={youtubeEmbedUrl}
                title={`Watch: ${sermon.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {/* Audio player */}
          {sermon.audioUrl && (
            <div className="mb-6">
              <AudioPlayer src={sermon.audioUrl} title={sermon.title} />
            </div>
          )}

          {/* External links if no embed */}
          {!youtubeEmbedUrl && !sermon.audioUrl && sermon.youtubeUrl && (
            <Button asChild className="mb-6">
              <a href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Watch on YouTube
              </a>
            </Button>
          )}

          <Separator className="my-8" />

          {/* Notes / Summary */}
          {sermon.summary && sermon.summary.length > 0 && (
            <section aria-label="Sermon notes">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Message Notes</h2>
              <PortableTextRenderer value={sermon.summary} />
            </section>
          )}

          {/* Resources */}
          {sermon.resources && sermon.resources.length > 0 && (
            <section className="mt-8" aria-label="Downloadable resources">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Resources</h2>
              <ul className="space-y-2">
                {sermon.resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* More from this series */}
          {relatedSermons.length > 0 && (
            <section className="mt-12" aria-label="More from this series">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                More from &ldquo;{sermon.series?.title}&rdquo;
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedSermons.slice(0, 4).map((s) => (
                  <SermonCard
                    key={s._id}
                    sermon={s as Sermon}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
