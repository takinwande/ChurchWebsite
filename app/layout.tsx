import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'RCCG Covenant Assembly | Avondale, AZ',
    template: '%s | RCCG Covenant Assembly',
  },
  description:
    'The Redeemed Christian Church of God Covenant Assembly — A welcoming church community in Avondale, Arizona. Join us for worship, community, and spiritual growth.',
  keywords: ['church', 'RCCG', 'Avondale', 'Arizona', 'Covenant Assembly', 'worship', 'sermons'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'RCCG Covenant Assembly',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
