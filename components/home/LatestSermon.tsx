import Link from 'next/link'
import { Play, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Sermon } from '@/lib/types'
import { FadeIn, SlideUp } from '@/components/animation'

interface LatestSermonProps {
  sermon: Sermon | null
}

export function LatestSermon({ sermon }: LatestSermonProps) {
  if (!sermon) return null

  return (
    <section className="py-16 bg-background" aria-label="Latest sermon">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Latest Message</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                <Link href="/sermons">View all sermons →</Link>
              </Button>
            </div>
          </FadeIn>

          <SlideUp delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              {/* Icon / play indicator */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                {sermon.series && (
                  <Badge variant="secondary" className="mb-2">
                    {sermon.series.title}
                  </Badge>
                )}
                <h3 className="text-xl font-bold text-foreground sm:text-2xl leading-snug">
                  {sermon.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sermon.speaker?.name && <span>{sermon.speaker.name}</span>}
                  {sermon.speaker?.name && sermon.date && <span> &middot; </span>}
                  {sermon.date && <span>{formatDate(sermon.date)}</span>}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sermon.youtubeUrl && (
                    <Button asChild size="sm">
                      <a href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                        Watch
                      </a>
                    </Button>
                  )}
                  {sermon.audioUrl && (
                    <Button asChild size="sm" variant="outline">
                      <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
                        Listen
                      </a>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary">
                    <Link href={`/sermons/${sermon.slug.current}`}>View notes →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </section>
  )
}
