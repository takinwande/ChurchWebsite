import { client } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY, ANNOUNCEMENT_QUERY } from '@/lib/sanity/queries'
import type { SiteSettings, Announcement } from '@/lib/types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner'
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, announcement] = await Promise.all([
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 300 } }),
    client.fetch<Announcement>(ANNOUNCEMENT_QUERY, {}, { next: { revalidate: 120 } }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner announcement={announcement} />
      <Navbar />
      <PageTransitionWrapper>
        <main className="flex-1">{children}</main>
      </PageTransitionWrapper>
      <Footer settings={settings} />
    </div>
  )
}
