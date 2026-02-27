import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { ABOUT_QUERY, MINISTRIES_QUERY } from '@/lib/sanity/queries'
import type { AboutPage, Ministry } from '@/lib/types'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { urlFor } from '@/lib/sanity/image'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission, vision, and leadership of RCCG Covenant Assembly in Avondale, AZ.',
}

export default async function AboutPage_() {
  const [page, ministries] = await Promise.all([
    client.fetch<AboutPage>(ABOUT_QUERY),
    client.fetch<Ministry[]>(MINISTRIES_QUERY),
  ])

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="mb-10 text-3xl font-bold text-foreground sm:text-4xl">About Us</h1>
          </FadeIn>

          {/* Mission */}
          <FadeIn delay={0.05}>
            <section className="mb-10" aria-label="Our mission">
              <h2 className="mb-3 text-xl font-semibold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {page?.mission ?? 'To love God, love people, and make disciples who transform their communities.'}
              </p>
            </section>
          </FadeIn>

          <Separator className="my-8" />

          {/* Vision */}
          {page?.vision && (
            <>
              <FadeIn delay={0.05}>
                <section className="mb-10" aria-label="Our vision">
                  <h2 className="mb-3 text-xl font-semibold text-foreground">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">{page.vision}</p>
                </section>
              </FadeIn>
              <Separator className="my-8" />
            </>
          )}

          {/* Beliefs */}
          {page?.beliefs && page.beliefs.length > 0 && (
            <>
              <FadeIn delay={0.05}>
                <section className="mb-10" aria-label="Our beliefs">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">What We Believe</h2>
                  <PortableTextRenderer value={page.beliefs} />
                </section>
              </FadeIn>
              <Separator className="my-8" />
            </>
          )}

          {/* Leadership */}
          {page?.leadership && page.leadership.length > 0 && (
            <>
              <section aria-label="Our leadership">
                <FadeIn>
                  <h2 className="mb-6 text-xl font-semibold text-foreground">Our Leadership</h2>
                </FadeIn>
                <StaggerContainer className="grid gap-6 sm:grid-cols-2">
                  {page.leadership.map((leader, i) => (
                    <StaggerItem key={i}>
                      <div className="flex gap-4 items-start">
                        {leader.photo ? (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border">
                            <Image
                              src={urlFor(leader.photo).width(128).height(128).fit('crop').url()}
                              alt={leader.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                            {leader.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{leader.name}</p>
                          {leader.title && (
                            <p className="text-sm text-primary">{leader.title}</p>
                          )}
                          {leader.bio && (
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
                          )}
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
              <Separator className="my-8" />
            </>
          )}

          {/* Ministries teaser */}
          {ministries && ministries.length > 0 && (
            <FadeIn>
              <section aria-label="Our ministries">
                <h2 className="mb-3 text-xl font-semibold text-foreground">Our Ministries</h2>
                <p className="mb-5 text-muted-foreground leading-relaxed">
                  Covenant Assembly is home to a diverse family of ministry groups — each one a place
                  to serve, grow, and belong.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ministries.map((m) => (
                    <Badge key={m._id} variant="outline" className="text-sm py-1 px-3">
                      {m.name}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="outline">
                  <Link href="/ministries">View All Ministries →</Link>
                </Button>
              </section>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
