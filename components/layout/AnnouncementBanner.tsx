'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import type { Announcement } from '@/lib/types'

interface AnnouncementBannerProps {
  announcement: Announcement | null
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!announcement?.enabled || dismissed) return null

  return (
    <div className="relative bg-primary px-4 py-2.5 text-center text-sm text-white">
      <span>{announcement.text}</span>
      {announcement.link && (
        <Link
          href={announcement.link}
          className="ml-2 font-semibold underline underline-offset-2 hover:no-underline"
          target={announcement.link.startsWith('http') ? '_blank' : undefined}
          rel={announcement.link.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {announcement.linkText ?? 'Learn more'}
        </Link>
      )}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
