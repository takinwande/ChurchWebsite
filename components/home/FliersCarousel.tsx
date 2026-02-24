'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'
import type { ProgramFlier } from '@/lib/types'

interface FliersCarouselProps {
  fliers: ProgramFlier[]
  intervalMs?: number
}

export function FliersCarousel({ fliers, intervalMs = 5000 }: FliersCarouselProps) {
  const activeFliers = fliers.filter((f) => f.image?.asset)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const advance = useCallback(
    () => setCurrentIndex((i) => (i + 1) % activeFliers.length),
    [activeFliers.length]
  )

  useEffect(() => {
    if (activeFliers.length <= 1 || isPaused) return
    const t = setInterval(advance, intervalMs)
    return () => clearInterval(t)
  }, [activeFliers.length, isPaused, advance, intervalMs])

  if (activeFliers.length === 0) return null

  const isMultiple = activeFliers.length > 1

  return (
    <div
      className="relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/3] bg-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {activeFliers.map((flier, i) => (
        <div
          key={flier._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== currentIndex}
        >
          <Image
            src={urlFor(flier.image).url()}
            fill
            className="object-contain"
            alt={flier.title}
            priority={i === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 896px"
          />
        </div>
      ))}

      {/* Prev / Next arrows */}
      {isMultiple && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i - 1 + activeFliers.length) % activeFliers.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white
                       hover:bg-black/60 transition-colors focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-white"
            aria-label="Previous flier"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((i) => (i + 1) % activeFliers.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white
                       hover:bg-black/60 transition-colors focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-white"
            aria-label="Next flier"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {isMultiple && (
        <div
          className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
          role="tablist"
          aria-label="Flier slides"
        >
          {activeFliers.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to flier ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
