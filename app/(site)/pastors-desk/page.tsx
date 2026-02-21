import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PASTORS_DESK_QUERY } from '@/lib/sanity/queries'
import type { PastorsDesk } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const revalidate = 300

export const metadata: Metadata = {
  title: "Pastor's Desk",
  description:
    'Weekly covenant messages from Pastor Timothy Olorunfemi of RCCG Covenant Assembly — scripture, reflection, confession, and prayer for everyday faith.',
}

export default async function PasDeskPage() {
  const posts = await client.fetch<PastorsDesk[]>(PASTORS_DESK_QUERY)

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
            Pastor&apos;s Desk
          </h1>
          <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
            Weekly covenant messages from Pastor Timothy Olorunfemi — scripture-grounded reflections
            to strengthen your faith and deepen your walk with God.
          </p>

          {posts && posts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <Link href={`/pastors-desk/${post.slug.current}`} className="group block">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
                    {post.scripture && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                        {post.scripture}
                      </Badge>
                    )}
                  </div>

                  {post.confession && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-3">
                      &ldquo;{post.confession}&rdquo;
                    </p>
                  )}

                  <Link
                    href={`/pastors-desk/${post.slug.current}`}
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Messages coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
