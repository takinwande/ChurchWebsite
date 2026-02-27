import type { Metadata } from 'next'
import { Images } from 'lucide-react'
import { client } from '@/lib/sanity/client'
import { GALLERY_ALBUMS_QUERY } from '@/lib/sanity/queries'
import type { GalleryAlbum } from '@/lib/types'
import { AlbumCard } from '@/components/gallery/AlbumCard'
import { SlideUp, StaggerContainer, StaggerItem } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from services, events, and special occasions at RCCG Covenant Assembly.',
}

export default async function GalleryPage() {
  const albums = await client.fetch<GalleryAlbum[]>(GALLERY_ALBUMS_QUERY)

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SlideUp>
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Images className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Gallery</h1>
            <p className="text-lg text-muted-foreground">
              Moments from our services, events, and community life.
            </p>
          </div>
        </SlideUp>

        {albums && albums.length > 0 ? (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
            {albums.map((album) => (
              <StaggerItem key={album._id}>
                <AlbumCard album={album} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="py-20 text-center">
            <Images className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-muted-foreground">No albums yet — check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
