import type { Metadata } from 'next'
import { PrayerRequestForm } from '@/components/prayer/PrayerRequestForm'
import { Separator } from '@/components/ui/separator'
import { Heart } from 'lucide-react'
import { FadeIn } from '@/components/animation'

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description: 'Submit a prayer request to RCCG Covenant Assembly. We believe in the power of prayer.',
}

export default function PrayerPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Prayer Requests</h1>
              <p className="mt-2 text-muted-foreground">
                We believe in the power of prayer. Share your request and our pastoral team will pray with you.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <section aria-label="Prayer request form">
              <PrayerRequestForm />
            </section>

            {/* Sidebar */}
            <aside aria-label="Prayer information">
              <div className="rounded-xl border border-border bg-slate-50 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-foreground">We Pray for Every Request</h2>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every prayer request submitted here is read and prayed over by our pastoral team. You are not alone —
                  we stand with you in faith.
                </p>

                <Separator />

                <blockquote className="space-y-2">
                  <p className="text-sm text-foreground italic leading-relaxed">
                    &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with
                    thanksgiving, present your requests to God. And the peace of God, which transcends all
                    understanding, will guard your hearts and your minds in Christ Jesus.&rdquo;
                  </p>
                  <footer className="text-xs font-semibold text-primary">Philippians 4:6–7</footer>
                </blockquote>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Confidentiality
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your request is treated with complete confidentiality. If you prefer to remain anonymous, check
                    the box on the form.
                  </p>
                </div>
              </div>
            </aside>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
