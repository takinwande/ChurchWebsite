import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Calendar } from 'lucide-react'

interface HeroProps {
  name: string
  tagline?: string
  livestreamUrl?: string
}

export function Hero({ name, tagline, livestreamUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary to-primary-800 text-white">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
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
    </section>
  )
}
