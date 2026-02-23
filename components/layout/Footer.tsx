import Link from 'next/link'
import Image from 'next/image'
import type { SimpleIcon } from 'simple-icons'
import { siFacebook, siInstagram, siYoutube, siTiktok } from 'simple-icons'
import { MapPin, Phone, Mail } from 'lucide-react'
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
  { href: '/gallery', label: 'Gallery' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
]

const socialPlatforms: { key: keyof NonNullable<SiteSettings['socialLinks']>; icon: SimpleIcon; label: string }[] = [
  { key: 'facebook',  icon: siFacebook,  label: 'Facebook'  },
  { key: 'instagram', icon: siInstagram, label: 'Instagram' },
  { key: 'youtube',   icon: siYoutube,   label: 'YouTube'   },
  { key: 'tiktok',    icon: siTiktok,    label: 'TikTok'    },
]

function SocialIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill={`#${icon.hex}`} />
      <g transform="translate(8, 8)">
        <path d={icon.path} fill="white" />
      </g>
    </svg>
  )
}

export function Footer({ settings }: FooterProps) {
  const address = settings?.address
  const addressString = address
    ? [address.street, address.city && address.state ? `${address.city}, ${address.state} ${address.zip}` : '']
        .filter(Boolean)
        .join('\n')
    : '755 North 114th Avenue\nAvondale, AZ 85323'

  const socials = settings?.socialLinks
  const activeSocials = socials
    ? socialPlatforms.filter(({ key }) => socials[key])
    : []

  return (
    <footer className="border-t border-border bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Church info */}
          <div className="lg:col-span-2">
            <Image
              src="/logo.jpg"
              alt=""
              width={72}
              height={72}
              className="mb-3 rounded-sm object-contain"
            />
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

        {/* Follow Us banner */}
        {activeSocials.length > 0 && (
          <div className="mt-10 border-t border-border pt-8 text-center">
            <p className="mb-5 text-sm font-semibold text-foreground">Follow Us on Social Media</p>
            <div className="flex justify-center gap-6">
              {activeSocials.map(({ key, icon, label }) => (
                <a
                  key={key}
                  href={socials![key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
                >
                  <SocialIcon icon={icon} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} The Redeemed Christian Church of God Covenant Assembly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
