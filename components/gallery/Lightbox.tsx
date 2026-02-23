'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/lib/types'

interface LightboxProps {
  photos: GalleryPhoto[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  )
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length]
  )

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next, onClose])

  const current = photos[index]
  const src = current.url ?? ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Previous photo"
          className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        style={{ width: 'min(90vw, 1200px)', height: 'min(85vh, 800px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {src && (
          <Image
            src={src}
            fill
            className="object-contain"
            alt={current.alt ?? `Photo ${index + 1}`}
            sizes="90vw"
            priority
          />
        )}
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Next photo"
          className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <p className="absolute bottom-4 text-xs text-white/70">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  )
}
