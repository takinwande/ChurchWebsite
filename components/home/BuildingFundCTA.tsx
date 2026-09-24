import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SlideUp } from '@/components/animation'
import type { FundraisingCampaign } from '@/lib/types'

interface BuildingFundCTAProps {
  campaign: FundraisingCampaign | null
}

/**
 * Sanity-managed rather than hardcoded, so the church can turn this off, or
 * swap it for a different campaign entirely, from Studio — no redeploy.
 *
 * No dollar figures render here even if an editor adds them to the body text
 * by mistake; that's a content-discipline concern, not something this
 * component can enforce. The field's own description in Studio warns against
 * it, since a campaign's own donation site is the live source of truth for
 * its total.
 */
export function BuildingFundCTA({ campaign }: BuildingFundCTAProps) {
  if (!campaign?.enabled || !campaign.heading || !campaign.url) return null

  return (
    <section className="py-16 sm:py-20 bg-background" aria-label="Fundraising campaign">
      <div className="container mx-auto px-4">
        <SlideUp>
          <div
            className="mx-auto max-w-4xl rounded-3xl bg-primary text-primary-foreground p-8 text-center sm:p-12
                       shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]"
          >
            {campaign.eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                {campaign.eyebrow}
              </p>
            )}
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{campaign.heading}</h2>
            {campaign.body && (
              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                {campaign.body}
              </p>
            )}
            <Button
              asChild
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href={campaign.url} target="_blank" rel="noopener noreferrer">
                <Heart className="mr-2 h-5 w-5" />
                {campaign.buttonLabel || 'Give Now'}
              </a>
            </Button>
          </div>
        </SlideUp>
      </div>
    </section>
  )
}
