import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { MINISTRIES_QUERY } from '@/lib/sanity/queries'
import type { Ministry } from '@/lib/types'
import { MinistryCard } from '@/components/ministries/MinistryCard'
import { SlideUp, StaggerContainer, StaggerItem, AnimatedCard } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Ministries',
  description:
    'Discover the ministry groups at RCCG Covenant Assembly in Avondale, AZ — from men and women\'s fellowships to youth, children, outreach, and more.',
}

export default async function MinistriesPage() {
  const ministries = await client.fetch<Ministry[]>(MINISTRIES_QUERY)

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <SlideUp>
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Our Ministries</h1>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Every member of Covenant Assembly is called to serve. Our ministries provide a place to
              belong, grow, and make a difference — whatever your season of life.
            </p>
          </SlideUp>

          {ministries && ministries.length > 0 ? (
            <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.09}>
              {ministries.map((ministry) => (
                <StaggerItem key={ministry._id}>
                  <AnimatedCard>
                    <MinistryCard ministry={ministry} />
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <p className="text-muted-foreground">Ministry information coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
