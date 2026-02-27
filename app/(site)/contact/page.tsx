import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { CONTACT_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import type { ContactPage, SiteSettings } from '@/lib/types'
import { ContactForm } from '@/components/contact/ContactForm'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'
import { FadeIn } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with RCCG Covenant Assembly in Avondale, AZ.',
}

export default async function ContactPageRoute() {
  const [page, settings] = await Promise.all([
    client.fetch<ContactPage>(CONTACT_QUERY),
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
  ])

  const phone = page?.phone ?? settings?.phone ?? '623-419-5650'
  const email = page?.email ?? settings?.email ?? 'admin@covenantassembly.org'
  const address = page?.address ?? (() => {
    const a = settings?.address
    return a ? `${a.street}\n${a.city}, ${a.state} ${a.zip}` : '755 North 114th Avenue\nAvondale, AZ 85323'
  })()

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contact Us</h1>
              <p className="mt-2 text-muted-foreground">We&apos;d love to hear from you. Send us a message below.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <section aria-label="Contact form">
              <ContactForm />
            </section>

            {/* Contact info sidebar */}
            <aside aria-label="Contact information">
              <div className="rounded-xl border border-border bg-slate-50 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Church Info</h2>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Address</p>
                    <p className="text-sm text-foreground whitespace-pre-line">{address}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Phone</p>
                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-sm text-foreground hover:text-primary transition-colors">
                      {formatPhoneNumber(phone)}
                    </a>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${email}`} className="text-sm text-foreground hover:text-primary transition-colors break-all">
                      {email}
                    </a>
                  </div>
                </div>

                {page?.officeHours && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Office Hours</p>
                        <p className="text-sm text-foreground whitespace-pre-line">{page.officeHours}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </aside>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
