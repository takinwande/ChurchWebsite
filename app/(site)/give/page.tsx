import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { GIVE_QUERY } from '@/lib/sanity/queries'
import { Button } from '@/components/ui/button'
import { Heart, ExternalLink, Shield, RefreshCw } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support the ministry of RCCG Covenant Assembly through your generous giving.',
}

export default async function GivePage() {
  const data = await client.fetch<{ givingUrl?: string; name?: string }>(GIVE_QUERY)

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-10 w-10 text-primary" aria-hidden="true" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Give</h1>

          <p className="mb-3 text-lg text-muted-foreground leading-relaxed">
            Your generosity fuels our mission to worship, grow, and serve our community and beyond.
          </p>
          <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
            for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>

          {data?.givingUrl ? (
            <Button asChild size="xl">
              <a href={data.givingUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Give Online
              </a>
            </Button>
          ) : (
            <div className="rounded-xl border border-border bg-slate-50 p-6 text-sm text-muted-foreground">
              <p>Online giving link not yet configured.</p>
              <p className="mt-1">
                Please visit the church office or contact us at{' '}
                <a href="mailto:admin@covenantassembly.org" className="text-primary hover:underline">
                  admin@covenantassembly.org
                </a>
              </p>
            </div>
          )}

          {/* Trust signals */}
          <div className="mt-10 grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground">
            <div className="flex flex-col items-center gap-1.5">
              <Shield className="h-5 w-5 text-primary/60" aria-hidden="true" />
              <span>Secure giving</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="h-5 w-5 text-primary/60" aria-hidden="true" />
              <span>Recurring options available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
