import {
  cn,
  formatDate,
  formatDateTime,
  formatShortDate,
  relativeDate,
  truncate,
  getYouTubeEmbedUrl,
  formatPhoneNumber,
  startOfDayInTimeZone,
  getEventWindow,
  PAST_EVENTS_WINDOW_DAYS,
} from '@/lib/utils'

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn(undefined, null as unknown as undefined, 'foo')).toBe('foo')
  })

  it('handles empty call', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('formats with default pattern (MMMM d, yyyy)', () => {
    // Use noon local time to avoid UTC-midnight timezone off-by-one
    expect(formatDate('2024-06-15T12:00:00')).toBe('June 15, 2024')
  })

  it('formats with custom pattern', () => {
    expect(formatDate('2024-01-15T12:00:00', 'MM/dd/yyyy')).toBe('01/15/2024')
  })

  it('returns the original string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('formatDateTime', () => {
  it('formats with full day, date, and time', () => {
    const result = formatDateTime('2025-06-15T10:00:00')
    expect(result).toMatch(/June 15, 2025/)
    expect(result).toMatch(/10:00 AM/)
  })

  it('omits time when hour and minute are both zero (all-day event)', () => {
    const result = formatDateTime('2025-06-15T00:00:00')
    expect(result).toMatch(/June 15, 2025/)
    expect(result).not.toMatch(/12:00 AM/)
  })

  it('returns original string on invalid date', () => {
    expect(formatDateTime('bad')).toBe('bad')
  })
})

describe('formatShortDate', () => {
  it('formats as "MMM d, yyyy"', () => {
    // Use noon local time to avoid UTC-midnight timezone off-by-one
    expect(formatShortDate('2024-12-25T12:00:00')).toBe('Dec 25, 2024')
  })

  it('returns original string on invalid date', () => {
    expect(formatShortDate('invalid')).toBe('invalid')
  })
})

describe('relativeDate', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-06-15T12:00:00'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns "3 days ago" for a date 3 days in the past', () => {
    expect(relativeDate('2025-06-12T12:00:00')).toBe('3 days ago')
  })

  it('returns a relative phrase for a date ~1 month prior', () => {
    const result = relativeDate('2025-05-15T12:00:00')
    expect(result).toMatch(/month/)
  })

  it('returns a future relative phrase for a future date', () => {
    const result = relativeDate('2025-06-17T12:00:00')
    expect(result).toMatch(/in \d+ days/)
  })

  it('returns original string on invalid date', () => {
    expect(relativeDate('bad')).toBe('bad')
  })
})

describe('truncate', () => {
  it('returns string unchanged when at maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('returns string unchanged when under maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates and appends ellipsis character (U+2026) when over maxLength', () => {
    // The implementation uses '…' (U+2026 single char), not '...'
    expect(truncate('Hello World', 5)).toBe('Hello\u2026')
  })

  it('trims trailing whitespace before appending ellipsis', () => {
    expect(truncate('Hello   ', 6)).toBe('Hello\u2026')
  })
})

describe('getYouTubeEmbedUrl', () => {
  it('converts youtube.com/watch?v= URL to embed URL', () => {
    expect(getYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    )
  })

  it('converts youtu.be short URL to embed URL', () => {
    expect(getYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    )
  })

  it('returns null for a non-YouTube URL', () => {
    expect(getYouTubeEmbedUrl('https://vimeo.com/12345')).toBeNull()
  })

  it('returns null for a YouTube URL missing the video ID', () => {
    expect(getYouTubeEmbedUrl('https://www.youtube.com/watch?list=abc')).toBeNull()
  })

  it('returns null for a completely invalid URL string', () => {
    expect(getYouTubeEmbedUrl('not-a-url')).toBeNull()
  })
})

describe('formatPhoneNumber', () => {
  it('formats a 10-digit string as (NXX) NXX-XXXX', () => {
    expect(formatPhoneNumber('6025551234')).toBe('(602) 555-1234')
  })

  it('strips dashes and formats correctly', () => {
    expect(formatPhoneNumber('602-555-1234')).toBe('(602) 555-1234')
  })

  it('strips parentheses/spaces and formats correctly', () => {
    expect(formatPhoneNumber('(602) 555-1234')).toBe('(602) 555-1234')
  })

  it('returns the original string unchanged for non-10-digit input', () => {
    expect(formatPhoneNumber('12345')).toBe('12345')
  })
})

describe('startOfDayInTimeZone', () => {
  it('resolves midnight in the church zone, not the server zone', () => {
    // 2026-08-04T23:30:00Z is 4:30pm on Aug 4 in Phoenix (UTC-7).
    const result = startOfDayInTimeZone(new Date('2026-08-04T23:30:00Z'))
    expect(result.toISOString()).toBe('2026-08-04T07:00:00.000Z') // midnight Phoenix
  })

  // The regression that motivated this: a UTC server rolls the date over at
  // 5pm Phoenix time, so an evening event would be classified as yesterday's.
  it('still reports the same local day after UTC has rolled over', () => {
    // 2026-08-05T02:00:00Z is 7pm on Aug 4 in Phoenix — already Aug 5 in UTC.
    const result = startOfDayInTimeZone(new Date('2026-08-05T02:00:00Z'))
    expect(result.toISOString()).toBe('2026-08-04T07:00:00.000Z') // still Aug 4
  })

  it('handles the moment just after local midnight', () => {
    // 2026-08-04T07:01:00Z is 12:01am on Aug 4 in Phoenix.
    const result = startOfDayInTimeZone(new Date('2026-08-04T07:01:00Z'))
    expect(result.toISOString()).toBe('2026-08-04T07:00:00.000Z')
  })

  it('honours an explicit time zone', () => {
    // Same instant, but UTC — the day boundary differs.
    const result = startOfDayInTimeZone(new Date('2026-08-05T02:00:00Z'), 'UTC')
    expect(result.toISOString()).toBe('2026-08-05T00:00:00.000Z')
  })
})

describe('getEventWindow', () => {
  const now = new Date('2026-08-04T23:30:00Z') // 4:30pm Aug 4, Phoenix

  it('starts the upcoming window at midnight today, not the current time', () => {
    expect(getEventWindow(now).todayStart).toBe('2026-08-04T07:00:00.000Z')
  })

  it('cuts past events off exactly PAST_EVENTS_WINDOW_DAYS before today', () => {
    const { todayStart, pastCutoff } = getEventWindow(now)
    const days = (Date.parse(todayStart) - Date.parse(pastCutoff)) / 86_400_000
    expect(days).toBe(PAST_EVENTS_WINDOW_DAYS)
  })

  it('places the cutoff 10 days back', () => {
    expect(getEventWindow(now).pastCutoff).toBe('2026-07-25T07:00:00.000Z')
  })

  // An event earlier today must land in "upcoming", which is the whole point
  // of anchoring to midnight rather than to now.
  it('classifies an event earlier today as upcoming', () => {
    const { todayStart } = getEventWindow(now)
    const thisMorning = new Date('2026-08-04T17:00:00Z') // 10am Phoenix, already passed
    expect(thisMorning.toISOString() >= todayStart).toBe(true)
  })

  it('excludes an event older than the past window', () => {
    const { pastCutoff } = getEventWindow(now)
    const tooOld = new Date('2026-07-24T18:00:00Z') // 11 days back
    expect(tooOld.toISOString() >= pastCutoff).toBe(false)
  })

  it('includes an event just inside the past window', () => {
    const { pastCutoff, todayStart } = getEventWindow(now)
    const justInside = new Date('2026-07-25T18:00:00Z') // ~10 days back
    expect(justInside.toISOString() >= pastCutoff).toBe(true)
    expect(justInside.toISOString() < todayStart).toBe(true)
  })

  it('defaults to the current time when called with no argument', () => {
    expect(() => getEventWindow()).not.toThrow()
    expect(getEventWindow().todayStart).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
