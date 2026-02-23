import type { Metadata } from 'next'
import type { SimpleIcon } from 'simple-icons'
import { siZelle, siCashapp, siPaypal } from 'simple-icons'
import { Heart } from 'lucide-react'
import { GivingMethodCard } from '@/components/give/GivingMethodCard'

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support the ministry of RCCG Covenant Assembly through your generous giving.',
}

// Renders an official brand logo (from simple-icons) as a white mark
// on a brand-coloured rounded square. simple-icons use a 24×24 viewBox;
// translate(8,8) centres that exactly inside our 40×40 container.
function BrandIcon({ icon, label }: { icon: SimpleIcon; label: string }) {
  return (
    <svg viewBox="0 0 40 40" width={48} height={48} aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill={`#${icon.hex}`} />
      <g transform="translate(8, 8)">
        <path d={icon.path} fill="white" />
      </g>
    </svg>
  )
}

// Givelify is not in simple-icons — using their actual heart logomark
function GivelifyIcon() {
  return (
    <svg viewBox="0 0 40 40" width={48} height={48} aria-label="Givelify logo" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#01B4AA" />
      <g transform="translate(8, 8)">
        <path
          d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
          fill="white"
        />
      </g>
    </svg>
  )
}

export default function GivePage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Give</h1>
            <p className="mb-3 text-lg text-muted-foreground leading-relaxed">
              Your generosity fuels our mission to worship, grow, and serve our community and beyond.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
              or under compulsion, for God loves a cheerful giver.&rdquo; &mdash; 2 Corinthians 9:7
            </p>
          </div>

          {/* Giving methods */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <GivingMethodCard
              icon={<BrandIcon icon={siZelle} label="Zelle logo" />}
              name="Zelle"
              description="Send a gift directly from your bank app — fast, free, and secure."
              detail="admin@covenantassembly.org"
              note="Open your bank app → Send Money → enter this email address"
            />

            <GivingMethodCard
              icon={<GivelifyIcon />}
              name="Givelify"
              description="Give securely online or through the Givelify app."
              detail="RCCG Covenant Assembly, Avondale"
              action={{
                label: 'Give Online',
                href: 'https://www.givelify.com/donate/NTQ3ODU',
              }}
              note='Or search "RCCG Covenant Assembly, Avondale" in the Givelify app'
            />

            <GivingMethodCard
              icon={<BrandIcon icon={siCashapp} label="Cash App logo" />}
              name="Cash App"
              description="Send a gift instantly using our Cash App $Cashtag."
              detail="$RCCGCAAZ"
              action={{
                label: 'Open Cash App',
                href: 'https://cash.app/$RCCGCAAZ',
              }}
            />

            <GivingMethodCard
              icon={<BrandIcon icon={siPaypal} label="PayPal logo" />}
              name="PayPal"
              description="Send a gift securely through PayPal using our email address."
              detail="admin@covenantassembly.org"
              action={{
                label: 'Donate via PayPal',
                href: 'https://www.paypal.com/donate?business=admin%40covenantassembly.org',
              }}
              note="You can also log in to PayPal → Send & Request → enter this email address"
            />

          </div>
        </div>
      </div>
    </div>
  )
}
