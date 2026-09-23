/**
 * Seed Events — September 23 – October 2026
 * ==========================================
 * Populates Sanity with the church calendar from Sep 23 (the day after this
 * script was written) through the end of October 2026.
 *
 * September 1–22 is deliberately excluded — those dates are already past or
 * today as of writing, so seeding them would create events that immediately
 * fall outside the events page's display window.
 *
 * Follows the same conventions as scripts/seed-events-august-2026.mjs:
 * deterministic `_id`s via createOrReplace (so re-running updates rather than
 * duplicates), and naive local datetimes with no timezone suffix.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-events-sept-oct-2026.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-events-sept-oct-2026.mjs
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Run with --env-file=.env.local')
  process.exit(1)
}
if (!token && !DRY_RUN) {
  console.error('❌  No Sanity write token found.')
  console.error('    Add SANITY_API_WRITE_TOKEN=sk... to .env.local and re-run.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token,
  useCdn: false,
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSlug(title, dateStr) {
  return (title + '-' + dateStr.slice(0, 10))
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function desc(text) {
  if (!text) return undefined
  return [
    {
      _type: 'block',
      _key: 'desc0',
      style: 'normal',
      children: [{ _type: 'span', _key: 'span0', text, marks: [] }],
      markDefs: [],
    },
  ]
}

// All times are Arizona local (MST, UTC-7, no DST). The timezone offset is
// deliberately omitted so Sanity stores the string as-is — the site compares
// and formats these as naive wall-clock times. Midnight (00:00) is the
// established signal for "no specific time", which formatDateTime renders as a
// date without a clock time.
const t = (date, time) => `${date}T${time}`

// ─── Event data — Sept 23 – Oct 31, 2026 ─────────────────────────────────────
// Titles reuse the wording already in the dataset so recurring series stay
// consistent ("Tuesday Fasting & Prayers" plural, "The Chosen Vessels" not
// "Covenant Vessels" — see PR #34 for that naming fix).

const events = [
  // ═══ SEPTEMBER (from the 23rd) ═══

  // Wed Sep 23
  { title: 'Digging Deep', start: t('2026-09-23', '19:00:00') },
  // Sat Sep 26
  { title: 'Food Outreach', start: t('2026-09-26', '10:00:00') },
  // Tue Sep 29
  { title: 'Tuesday Fasting & Prayers', start: t('2026-09-29', '17:00:00'), location: 'Prayer Line' },
  // Wed Sep 30
  { title: 'Holy Communion', start: t('2026-09-30', '19:00:00') },

  // ═══ OCTOBER ═══

  // Thu Oct 1
  {
    title: 'Covenant Hour of Prayer',
    start: t('2026-10-01', '05:00:00'),
    location: 'Prayer Line',
    desc: 'Monthly Covenant Hour of Prayer on the church prayer line.',
  },
  // Sun Oct 4 — no specific time on calendar
  { title: 'Thanksgiving and Anointing Service', start: t('2026-10-04', '00:00:00') },
  // Tue Oct 6
  { title: 'Tuesday Fasting & Prayers', start: t('2026-10-06', '17:00:00'), location: 'Prayer Line' },
  // Wed Oct 7
  { title: 'Digging Deep', start: t('2026-10-07', '19:00:00') },

  // Fri Oct 9 – Sun Oct 11 — three-day conference, labeled "Day 1/2/3" on the
  // calendar. Modeled as one multi-day event, matching the pattern already
  // used for "The Chosen Vessels (YAYA) Week": start on the first day, end on
  // the last day, both at midnight.
  {
    title: 'Peniel 2026: Prayer & Fire Conference',
    start: t('2026-10-09', '00:00:00'),
    end: t('2026-10-11', '00:00:00'),
    desc: 'Three-day prayer and fire conference.',
    featured: true,
  },
  // Sat Oct 10 — separate from the conference happening the same weekend
  { title: "Leader's Meeting", start: t('2026-10-10', '08:00:00'), location: 'Virtual' },

  // Mon Oct 12 — federal holiday noted on the calendar, no specific time
  { title: 'Indigenous People Day', start: t('2026-10-12', '00:00:00') },
  // Tue Oct 13
  { title: 'Tuesday Fasting & Prayers', start: t('2026-10-13', '17:00:00'), location: 'Prayer Line' },
  // Wed Oct 14
  { title: 'Digging Deep', start: t('2026-10-14', '19:00:00') },

  // Sun Oct 18 — no specific time on calendar
  { title: 'Covenant Day of His Power', start: t('2026-10-18', '00:00:00') },
  // Tue Oct 20
  { title: 'Tuesday Fasting & Prayers', start: t('2026-10-20', '17:00:00'), location: 'Prayer Line' },
  // Wed Oct 21
  { title: 'Digging Deep', start: t('2026-10-21', '19:00:00') },
  // Sat Oct 24
  { title: 'Food Outreach', start: t('2026-10-24', '10:00:00') },
  // Sun Oct 25 — no specific time on calendar
  { title: "Pastor's Appreciation Sunday", start: t('2026-10-25', '00:00:00') },
  // Tue Oct 27
  { title: 'Tuesday Fasting & Prayers', start: t('2026-10-27', '17:00:00'), location: 'Prayer Line' },
  // Wed Oct 28
  { title: 'Holy Communion', start: t('2026-10-28', '19:00:00') },
]

// ─── Build ───────────────────────────────────────────────────────────────────

function buildDocument(event) {
  const slug = makeSlug(event.title, event.start)
  const doc = {
    _type: 'event',
    _id: `event-${slug}`,
    title: event.title,
    slug: { _type: 'slug', current: slug },
    startDateTime: event.start,
    featured: event.featured ?? false,
  }
  if (event.end) doc.endDateTime = event.end
  if (event.location) doc.location = event.location
  if (event.desc) doc.description = desc(event.desc)
  return doc
}

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  const docs = events.map(buildDocument)

  const ids = docs.map((d) => d._id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (duplicates.length > 0) {
    console.error(`❌  Duplicate _ids would overwrite each other: ${duplicates.join(', ')}`)
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log(`\n🔍  Dry run — ${docs.length} events, nothing will be written.\n`)
    for (const doc of docs) {
      const day = new Date(`${doc.startDateTime}Z`).toUTCString().slice(0, 3)
      const time = doc.startDateTime.slice(11, 16)
      const when = time === '00:00' ? '(date only)' : time
      console.log(
        `  ${doc.startDateTime.slice(0, 10)} ${day}  ${when.padEnd(11)} ${doc.title}` +
          (doc.location ? `  · ${doc.location}` : '') +
          (doc.endDateTime ? `  → ${doc.endDateTime.slice(0, 10)}` : '')
      )
      console.log(`     ${doc._id}`)
    }
    console.log(`\n   Re-run without --dry-run to write.\n`)
    return
  }

  console.log(`\n🌱  Seeding ${docs.length} events into Sanity (project: ${projectId})…\n`)

  let written = 0
  let failed = 0

  for (const doc of docs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${doc.startDateTime.slice(0, 10)}  ${doc.title}`)
      written++
    } catch (err) {
      console.error(`  ❌  ${doc.title}  — ${err.message}`)
      failed++

      // A read-only token passes the "is a token set?" check above and only
      // fails here, so name the cause rather than repeating it for every event.
      if (/permission/i.test(err.message)) {
        console.error(
          `\n💡  That token can authenticate but not write. Issue one with ` +
            `"Editor" permission at https://sanity.io/manage → API → Tokens, ` +
            `then set SANITY_API_WRITE_TOKEN in .env.local.\n`
        )
        break
      }
    }
  }

  console.log(`\n✨  Done. ${written} created/updated, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
