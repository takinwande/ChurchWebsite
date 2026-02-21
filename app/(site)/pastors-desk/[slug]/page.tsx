import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { PASTORS_DESK_BY_SLUG_QUERY, PASTORS_DESK_QUERY } from '@/lib/sanity/queries'
import type { PastorsDesk } from '@/lib/types'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { BookOpen, ChevronLeft } from 'lucide-react'

export const revalidate = 300

interface PostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await client.fetch<PastorsDesk>(PASTORS_DESK_BY_SLUG_QUERY, { slug: params.slug })
  if (!post) return {}
  return {
    title: post.title,
    description: post.scripture
      ? `${post.scripture} — A message from Pastor Timothy Olorunfemi`
      : 'A message from Pastor Timothy Olorunfemi',
  }
}

export async function generateStaticParams() {
  const posts = await client.fetch<PastorsDesk[]>(`*[_type == "pastorsDesk"]{ slug }`)
  return (posts ?? []).map((p) => ({ slug: p.slug.current }))
}

export default async function PasDeskPostPage({ params }: PostPageProps) {
  const post = await client.fetch<PastorsDesk>(PASTORS_DESK_BY_SLUG_QUERY, { slug: params.slug })
  if (!post) notFound()

  return (
    <div className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Back */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/pastors-desk">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All Messages
            </Link>
          </Button>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl leading-tight">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Pastor Timothy Olorunfemi · {formatDate(post.date)}
              </span>
              {post.scripture && (
                <Badge variant="outline" className="text-xs gap-1">
                  <BookOpen className="h-3 w-3" aria-hidden="true" />
                  {post.scripture}
                </Badge>
              )}
            </div>
          </header>

          {/* Body */}
          {post.body && post.body.length > 0 && (
            <section aria-label="Message body" className="prose-sm leading-relaxed">
              <PortableTextRenderer value={post.body} />
            </section>
          )}

          <Separator className="my-8" />

          {/* Structured takeaways */}
          <div className="grid gap-6 sm:grid-cols-2">
            {post.confession && (
              <section
                aria-label="Confession"
                className="rounded-lg bg-primary/5 border border-primary/20 p-5"
              >
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  Confession
                </h2>
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{post.confession}&rdquo;
                </p>
              </section>
            )}

            {post.prayer && (
              <section
                aria-label="Prayer"
                className="rounded-lg bg-muted border border-border p-5"
              >
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Prayer
                </h2>
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{post.prayer}&rdquo;
                </p>
              </section>
            )}
          </div>

          {post.furtherReading && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">Further Reading:</span>{' '}
                {post.furtherReading}
              </span>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/pastors-desk">← Back to all messages</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
