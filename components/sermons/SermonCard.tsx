import Link from 'next/link'
import { Play, Headphones, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Sermon } from '@/lib/types'

interface SermonCardProps {
  sermon: Sermon
}

export function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col flex-1 p-5">
        {/* Series badge */}
        {sermon.series && (
          <Badge variant="secondary" className="mb-2 self-start">
            {sermon.series.title}
          </Badge>
        )}

        {/* Title */}
        <Link href={`/sermons/${sermon.slug.current}`} className="group">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug sm:text-lg">
            {sermon.title}
          </h3>
        </Link>

        {/* Meta */}
        <p className="mt-1.5 text-xs text-muted-foreground">
          {sermon.speaker?.name && <span>{sermon.speaker.name}</span>}
          {sermon.speaker?.name && sermon.date && <span> &middot; </span>}
          {sermon.date && <span>{formatDate(sermon.date)}</span>}
        </p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 mt-auto pt-4">
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
                <Headphones className="mr-1.5 h-3.5 w-3.5" />
                Listen
              </a>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary ml-auto">
            <Link href={`/sermons/${sermon.slug.current}`}>
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Notes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
