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

/** How far back past events stay listed before dropping off on their own. */
export const PAST_EVENTS_WINDOW_DAYS = 10

const MS_PER_DAY = 86_400_000

/** The zone's UTC offset at `date`, as an ISO suffix like `-07:00`. */
function zoneOffset(date: Date, timeZone: string): string {
  const label = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value // e.g. "GMT-07:00"

  return label?.match(/GMT([+-]\d{2}:\d{2})/)?.[1] ?? 'Z'
}

/**
 * Midnight at the start of `date`'s day *in `timeZone`*, as a real instant.
 *
 * Server code runs in UTC on Vercel, so deriving "today" from the server clock
 * would roll the date over at 5pm in Phoenix — an event happening this evening
 * would be classified as yesterday's. Resolving the boundary in the church's
 * own zone avoids that.
 *
 * Assumes the zone's offset does not change within the day, which holds for
 * Phoenix (no DST).
 */
export function startOfDayInTimeZone(date: Date, timeZone: string = CHURCH_TIME_ZONE): Date {
  // 'en-CA' formats as YYYY-MM-DD.
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

  return new Date(`${ymd}T00:00:00${zoneOffset(date, timeZone)}`)
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
 */
export function getEventWindow(now: Date = new Date()): EventWindow {
  const todayStart = startOfDayInTimeZone(now)

  return {
    todayStart: todayStart.toISOString(),
    pastCutoff: new Date(todayStart.getTime() - PAST_EVENTS_WINDOW_DAYS * MS_PER_DAY).toISOString(),
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
