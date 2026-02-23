import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, Images } from 'lucide-react'
import { client } from '@/lib/sanity/client'
import { GALLERY_ALBUMS_QUERY, GALLERY_ALBUM_QUERY } from '@/lib/sanity/queries'
import type { GalleryAlbum } from '@/lib/types'
import { PhotoGrid } from '@/components/gallery/PhotoGrid'

export const revalidate = 300

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const albums = await client.fetch<{ slug: { current: string } }[]>(
    GALLERY_ALBUMS_QUERY
  )
  return (albums ?? []).map((a) => ({ slug: a.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await client.fetch<GalleryAlbum | null>(GALLERY_ALBUM_QUERY, {
    slug: params.slug,
  })
  if (!album) return { title: 'Album Not Found' }
  return {
    title: album.title,
    description: album.description ?? `Photos from ${album.title}`,
  }
}

export default async function GalleryAlbumPage({ params }: Props) {
  const album = await client.fetch<GalleryAlbum | null>(GALLERY_ALBUM_QUERY, {
    slug: params.slug,
  })

  if (!album) notFound()

  const formattedDate = format(parseISO(album.date), 'MMMM d, yyyy')
  const photos = album.photos ?? []

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Back link */}
        <Link
          href="/gallery"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          All Albums
        </Link>

        {/* Album header */}
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">{album.title}</h1>
          <p className="mb-1 text-sm text-muted-foreground">{formattedDate}</p>
          {photos.length > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Images className="h-4 w-4" aria-hidden="true" />
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          )}
          {album.description && (
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              {album.description}
            </p>
          )}
        </div>

        {/* Photo grid with lightbox */}
        <PhotoGrid photos={photos} />
      </div>
    </div>
  )
}
