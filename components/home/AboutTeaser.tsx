import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export function AboutTeaser() {
  return (
    <section className="py-16 bg-background" aria-label="About us">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-7 w-7 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Who We Are</h2>
          <p className="mb-6 text-base text-muted-foreground leading-relaxed sm:text-lg">
            We are a vibrant, Spirit-filled community committed to worship, fellowship, and making disciples.
            No matter where you are in your faith journey, you are welcome here.
          </p>
          <Button asChild size="lg">
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
