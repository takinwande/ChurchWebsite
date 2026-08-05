import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The church's local time zone (Avondale, AZ). Arizona does not observe DST,
 * so its offset is stable year-round.
 */
export const CHURCH_TIME_ZONE = 'America/Phoenix'

/**
 * Fallback for how far back past events stay listed. Editors override this in
 * Site Settings → "Show Past Events For (days)"; this applies when it's blank.
 */
export const DEFAULT_PAST_EVENTS_WINDOW_DAYS = 10

/** Upper bound on the editable window, matching the Sanity field's validation. */
export const MAX_PAST_EVENTS_WINDOW_DAYS = 365

/**
 * Turns the Site Settings value into a usable number of days.
 *
 * The field is editable in the Studio, so it can arrive blank, non-numeric, or
 * out of range — Sanity validation warns but does not block saving. Anything
 * unusable falls back to the default, and valid input is clamped so a stray
 * value can't empty the events page or make it unbounded.
 */
export function resolvePastEventsWindowDays(value?: number | null): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_PAST_EVENTS_WINDOW_DAYS
  }
  return Math.min(Math.max(Math.floor(value), 0), MAX_PAST_EVENTS_WINDOW_DAYS)
}

/**
 * The calendar date at `date` *in `timeZone`*, as `YYYY-MM-DD`.
 *
 * Server code runs in UTC on Vercel, so reading the date off the server clock
 * would roll it over at 5pm in Phoenix — an event happening this evening would
 * be treated as yesterday's.
 */
export function calendarDateInTimeZone(
  date: Date = new Date(),
  timeZone: string = CHURCH_TIME_ZONE
): string {
  // 'en-CA' formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Shifts a `YYYY-MM-DD` string by whole calendar days. */
function shiftCalendarDate(ymd: string, days: number): string {
  // Anchored to UTC purely for the arithmetic; only the date part is kept, so
  // no zone offset or DST transition can leak into the result.
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export interface EventWindow {
  /** Inclusive lower bound for "upcoming" — midnight today, church time. */
  todayStart: string
  /** Inclusive lower bound for listed past events. */
  pastCutoff: string
}

/**
 * Boundaries that split events into upcoming vs. recently past, and drop
 * anything older. Keeps the events list self-managing — nothing has to be
 * deleted by hand in the Studio.
 *
 * These are **naive local datetime strings**, deliberately without a zone
 * suffix, because that is how `startDateTime` is stored: editors type a
 * wall-clock time in the Studio and Sanity persists it as e.g.
 * `2026-08-04T19:00:00`. Comparing those against a UTC instant would skew every
 * comparison by the zone's offset — a date-only event stored at midnight would
 * sort seven hours "before" the start of its own day and show up under
 * Recently Past on the day it actually happens.
 *
 * `windowDays` comes from Site Settings; pass it through
 * {@link resolvePastEventsWindowDays} first.
 */
export function getEventWindow(
  now: Date = new Date(),
  windowDays: number = DEFAULT_PAST_EVENTS_WINDOW_DAYS
): EventWindow {
  const today = calendarDateInTimeZone(now)

  return {
    todayStart: `${today}T00:00:00`,
    pastCutoff: `${shiftCalendarDate(today, -windowDays)}T00:00:00`,
  }
}

export function formatDate(dateString: string, pattern = 'MMMM d, yyyy'): string {
  try {
    return format(new Date(dateString), pattern)
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Midnight (00:00) signals no specific time — show date only
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return format(date, 'EEEE, MMMM d, yyyy')
    }
    return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
  } catch {
    return dateString
  }
}

export function formatShortDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function relativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    let videoId: string | null = null
    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1)
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v')
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}
