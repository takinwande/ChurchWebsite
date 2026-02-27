import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PLAN_VISIT_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import type { PlanVisitPage, SiteSettings } from '@/lib/types'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Clock, MapPin, Phone, Mail } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'
import { FadeIn, SlideUp } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Plan a Visit',
  description: 'Everything you need to know before your first visit to RCCG Covenant Assembly in Avondale, AZ.',
}

export default async function PlanVisitPage() {
  const [page, settings] = await Promise.all([
    client.fetch<PlanVisitPage>(PLAN_VISIT_QUERY),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
  ])

  const address = settings?.address
  const addressLine = address
    ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    : '755 North 114th Avenue, Avondale, AZ 85323'

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <FadeIn>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                {page?.heroText ?? 'Plan Your Visit'}
              </h1>
              {page?.heroSubtext && (
                <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{page.heroSubtext}</p>
              )}
              {!page?.heroSubtext && (
                <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                  We&apos;d love to meet you! Here&apos;s everything you need to know before you arrive.
                </p>
              )}
            </div>
          </FadeIn>

          {/* Service times */}
          <FadeIn delay={0.05}>
            <section className="mb-10" aria-label="Service times">
              <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                Service Times
              </h2>
              {settings?.serviceTimes && settings.serviceTimes.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {settings.serviceTimes.map((s, i) => (
                    <div key={i} className="rounded-xl border border-border bg-slate-50 p-4">
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {s.day} &middot; {s.time}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-slate-50 p-4">
                  <p className="font-semibold text-foreground">Sunday Worship Service</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Sunday &middot; 10:00 AM</p>
                </div>
              )}
            </section>
          </FadeIn>

          <Separator className="my-8" />

          {/* What to expect */}
          {page?.whatToExpectBody && page.whatToExpectBody.length > 0 && (
            <FadeIn delay={0.05}>
              <section className="mb-10" aria-label="What to expect">
                <h2 className="mb-4 text-xl font-semibold text-foreground">What to Expect</h2>
                <PortableTextRenderer value={page.whatToExpectBody} />
              </section>
            </FadeIn>
          )}

          {!page?.whatToExpectBody && (
            <FadeIn delay={0.05}>
              <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold text-foreground">What to Expect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are warm, welcoming, and Spirit-filled. Expect uplifting worship, an inspiring message
                  from God&apos;s Word, and a friendly community ready to embrace you. Come as you are — there is no dress
                  code and no pressure. We&apos;re just glad you&apos;re here.
                </p>
              </section>
            </FadeIn>
          )}

          <Separator className="my-8" />

          {/* Location + Map */}
          <FadeIn delay={0.05}>
            <section className="mb-10" aria-label="Location">
              <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                Location
              </h2>
              <p className="mb-4 text-muted-foreground">{addressLine}</p>

              {/* Google Maps embed */}
              <div className="overflow-hidden rounded-xl border border-border aspect-[16/9] bg-slate-100">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(addressLine)}&output=embed`}
                  title="Church location map"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Google Maps showing church location"
                />
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Open in Google Maps →
              </a>
            </section>
          </FadeIn>

          <Separator className="my-8" />

          {/* FAQ */}
          {page?.faq && page.faq.length > 0 && (
            <FadeIn delay={0.05}>
              <section className="mb-10" aria-label="Frequently asked questions">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {page.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </FadeIn>
          )}

          {/* Contact CTA */}
          <SlideUp delay={0.05}>
            <section className="rounded-2xl bg-primary/5 border border-primary/10 p-6 text-center" aria-label="Contact us">
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                {page?.contactCta ?? 'Still have questions?'}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                We&apos;d love to hear from you. Reach out and we&apos;ll be happy to help.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                {settings?.phone && (
                  <Button asChild variant="outline">
                    <a href={`tel:${settings.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {formatPhoneNumber(settings.phone)}
                    </a>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </section>
          </SlideUp>
        </div>
      </div>
    </div>
  )
}
