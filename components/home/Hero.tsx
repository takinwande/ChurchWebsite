'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Calendar } from 'lucide-react'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '@/lib/sanity/image'

interface HeroProps {
  name: string
  tagline?: string
  livestreamUrl?: string
  heroImages?: SanityImage[]
}

export function Hero({ name, tagline, livestreamUrl, heroImages }: HeroProps) {
  const images = heroImages?.filter((img) => img.asset) ?? []
  const hasImages = images.length > 0

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const advance = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (images.length <= 1 || isPaused) return
    const t = setInterval(advance, 5000)
    return () => clearInterval(t)
  }, [images.length, isPaused, advance])

  return (
    <section
      className="relative overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[650px] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {hasImages ? (
        <>
          {/* Carousel slides */}
          {images.map((img, i) => (
            <div
              key={img._key ?? i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={i !== currentIndex}
            >
              <Image
                src={urlFor(img).url()}
                fill
                className="object-cover"
                alt={img.alt ?? ''}
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        </>
      ) : (
        <>
          {/* Fallback gradient (original design) */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary to-primary-800" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
            Welcome to
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
            {name}
          </h1>
          {tagline && (
            <p className="mb-8 text-lg text-white/80 sm:text-xl lg:text-2xl leading-relaxed">
              {tagline}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="xl" className="bg-white text-primary hover:bg-white/90">
              <Link href="/plan-a-visit">
                <Calendar className="mr-2 h-5 w-5" />
                Plan a Visit
              </Link>
            </Button>
            {livestreamUrl ? (
              <Button asChild size="xl" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60">
                <a href={livestreamUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Watch Live
                </a>
              </Button>
            ) : (
              <Button asChild size="xl" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20">
                <Link href="/sermons">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Watch Sermons
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2" role="tablist" aria-label="Carousel slides">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
