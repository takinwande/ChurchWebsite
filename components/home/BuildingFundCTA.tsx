import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SlideUp } from '@/components/animation'

const CAMPAIGN_URL = 'https://www.rccgcovenantassemblyfund.org'

/**
 * A static, hardcoded callout rather than Sanity-managed content — matches
 * how the Give page's own payment methods (Zelle, PayPal, Cash App) are
 * already built. The campaign site itself is the source of truth for the
 * fundraising total, so no dollar figures are duplicated here; they'd go
 * stale the moment someone gives.
 */
export function BuildingFundCTA() {
  return (
    <section className="py-16 sm:py-20 bg-background" aria-label="Building fund campaign">
      <div className="container mx-auto px-4">
        <SlideUp>
          <div
            className="mx-auto max-w-4xl rounded-3xl bg-primary text-primary-foreground p-8 text-center sm:p-12
                       shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              Phase 2 Campaign
            </p>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Help Us Build Our Future Home</h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              We now own our permanent home here in Avondale — thank you for your faithful giving!
              We&apos;re raising funds to renovate, furnish, and equip the building so it&apos;s ready
              to serve our church family for generations to come. Every gift brings us closer.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href={CAMPAIGN_URL} target="_blank" rel="noopener noreferrer">
                <Heart className="mr-2 h-5 w-5" />
                Give to Phase 2
              </a>
            </Button>
          </div>
        </SlideUp>
      </div>
    </section>
  )
}
