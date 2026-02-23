import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import { GivingMethodCard } from '@/components/give/GivingMethodCard'

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support the ministry of RCCG Covenant Assembly through your generous giving.',
}

function ZelleIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48} aria-label="Zelle logo">
      <rect width="40" height="40" rx="8" fill="#6D1ED4" />
      {/* Z: top bar → diagonal → bottom bar */}
      <path
        d="M11 13h18M29 13 11 27M11 27h18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GivelifyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48} aria-label="Givelify logo">
      <rect width="40" height="40" rx="8" fill="#01B4AA" />
      {/* Heart shape representing generosity */}
      <path
        d="M20 29C20 29 9 22.5 9 16a6 6 0 0111-3.35A6 6 0 0131 16c0 6.5-11 13-11 13z"
        fill="white"
      />
    </svg>
  )
}

function CashAppIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48} aria-label="Cash App logo">
      <rect width="40" height="40" rx="8" fill="#00D632" />
      {/* Dollar sign: vertical bar + S-curve */}
      <path d="M20 9v22" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M24.5 15c0-2.5-2-4.5-4.5-4.5S15.5 12.5 15.5 15s2 4 4.5 5 4.5 2.5 4.5 5-2 4.5-4.5 4.5-4.5-2-4.5-4.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48} aria-label="PayPal logo">
      <rect width="40" height="40" rx="8" fill="#003087" />
      {/* Back P (light blue) */}
      <path d="M16 9h8a5 5 0 010 10h-5v11h-3V9z" fill="#009cde" />
      {/* Front P (white, offset down-right) */}
      <path d="M19 13h7a4 4 0 010 8h-4v8h-3V13z" fill="white" />
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
              icon={<ZelleIcon />}
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
              icon={<CashAppIcon />}
              name="Cash App"
              description="Send a gift instantly using our Cash App $Cashtag."
              detail="$RCCGCAAZ"
              action={{
                label: 'Open Cash App',
                href: 'https://cash.app/$RCCGCAAZ',
              }}
            />

            <GivingMethodCard
              icon={<PayPalIcon />}
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
