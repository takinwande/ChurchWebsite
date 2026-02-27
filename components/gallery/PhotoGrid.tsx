'use client'

import { useState } from 'react'
import Image from 'next/image'
import { m } from 'framer-motion'
import { Lightbox } from './Lightbox'
import type { GalleryPhoto } from '@/lib/types'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const photoVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

interface PhotoGridProps {
  photos: GalleryPhoto[]
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No photos in this album yet.
      </p>
    )
  }

  return (
    <>
      <m.div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {photos.map((photo, i) => {
          const src = photo.url ?? ''
          return (
            <m.button
              key={photo._key ?? i}
              variants={photoVariants}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-square w-full overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={photo.alt ?? `View photo ${i + 1}`}
            >
              {src && (
                <Image
                  src={src}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={photo.alt ?? `Photo ${i + 1}`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </m.button>
          )
        })}
      </m.div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
