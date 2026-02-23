import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { Images } from 'lucide-react'
import type { GalleryAlbum } from '@/lib/types'

interface AlbumCardProps {
  album: GalleryAlbum
}

export function AlbumCard({ album }: AlbumCardProps) {
  const formattedDate = format(parseISO(album.date), 'MMMM d, yyyy')

  return (
    <Link
      href={`/gallery/${album.slug.current}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Cover photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {album.coverImageUrl ? (
          <Image
            src={album.coverImageUrl}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            alt={album.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Images className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Album info */}
      <div className="p-4">
        <h2 className="mb-1 text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {album.title}
        </h2>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
        {album.photoCount != null && album.photoCount > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Images className="h-3.5 w-3.5" aria-hidden="true" />
            {album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}
          </p>
        )}
      </div>
    </Link>
  )
}
