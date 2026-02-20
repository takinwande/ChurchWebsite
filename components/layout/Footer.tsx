import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { formatPhoneNumber } from '@/lib/utils'

interface FooterProps {
  settings: SiteSettings | null
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/plan-a-visit', label: 'Plan a Visit' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
]

export function Footer({ settings }: FooterProps) {
  const address = settings?.address
  const addressString = address
    ? [address.street, address.city && address.state ? `${address.city}, ${address.state} ${address.zip}` : '']
        .filter(Boolean)
        .join('\n')
    : '755 North 114th Avenue\nAvondale, AZ 85323'

  const socials = settings?.socialLinks

  return (
    <footer className="border-t border-border bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Church info */}
          <div className="lg:col-span-2">
            <p className="text-lg font-bold text-primary mb-1">RCCG Covenant Assembly</p>
            <p className="text-xs text-muted-foreground mb-4">
              The Redeemed Christian Church of God
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              {addressString && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span className="whitespace-pre-line">{addressString}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                    {formatPhoneNumber(settings.phone)}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
            {/* Social links */}
            {socials && (
              <div className="mt-4 flex gap-3">
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service times */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Service Times</h3>
            {settings?.serviceTimes && settings.serviceTimes.length > 0 ? (
              <ul className="space-y-2">
                {settings.serviceTimes.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <br />
                    {s.day} · {s.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sunday Service · 10:00 AM</p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} The Redeemed Christian Church of God Covenant Assembly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
