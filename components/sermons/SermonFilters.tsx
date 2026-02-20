'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { SermonSeries, Speaker } from '@/lib/types'

interface SermonFiltersProps {
  series: Pick<SermonSeries, '_id' | 'title' | 'slug'>[]
  speakers: Pick<Speaker, '_id' | 'name' | 'slug'>[]
}

export function SermonFilters({ series, speakers }: SermonFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSeries = searchParams.get('series') ?? ''
  const currentSpeaker = searchParams.get('speaker') ?? ''
  const currentSearch = searchParams.get('q') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    router.push(pathname, { scroll: false })
  }

  const hasFilters = currentSeries || currentSpeaker || currentSearch

  return (
    <div className="mb-8 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search sermons…"
          className="pl-9"
          value={currentSearch}
          onChange={(e) => updateParam('q', e.target.value)}
          aria-label="Search sermons"
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Series filter */}
        <select
          value={currentSeries}
          onChange={(e) => updateParam('series', e.target.value)}
          aria-label="Filter by series"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Series</option>
          {series.map((s) => (
            <option key={s._id} value={s.slug.current}>
              {s.title}
            </option>
          ))}
        </select>

        {/* Speaker filter */}
        <select
          value={currentSpeaker}
          onChange={(e) => updateParam('speaker', e.target.value)}
          aria-label="Filter by speaker"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Speakers</option>
          {speakers.map((s) => (
            <option key={s._id} value={s.slug.current}>
              {s.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
