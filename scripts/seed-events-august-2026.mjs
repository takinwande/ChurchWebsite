/**
 * Seed Events — August 2026
 * =========================
 * Populates Sanity with the church calendar for August 2026.
 *
 * Follows the same conventions as scripts/seed-events.mjs: deterministic
 * `_id`s via createOrReplace (so re-running updates rather than duplicates),
 * and naive local datetimes with no timezone suffix.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-events-august-2026.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-events-august-2026.mjs
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

// ─── Event data — August 2026 ────────────────────────────────────────────────
// Titles reuse the wording already in the dataset so recurring series stay
// consistent (e.g. "Tuesday Fasting & Prayers", plural, as used Feb–Apr).

const events = [
  // Sat Aug 1
  {
    title: 'Covenant Hour of Prayer',
    start: t('2026-08-01', '05:00:00'),
    location: 'Prayer Line',
    desc: 'Monthly Covenant Hour of Prayer on the church prayer line.',
  },
  // Sun Aug 2
  { title: 'Thanksgiving and Anointing Service', start: t('2026-08-02', '00:00:00') },

  // Tue Aug 4
  { title: 'Tuesday Fasting & Prayers', start: t('2026-08-04', '17:00:00'), location: 'Prayer Line' },
  // Wed Aug 5
  { title: 'Digging Deep', start: t('2026-08-05', '19:00:00') },
  // Fri Aug 7
  {
    title: 'Quarterly Holy Ghost Service',
    start: t('2026-08-07', '00:00:00'),
    location: 'RCCG Glory Tabernacle',
    featured: true,
  },
  // Sat Aug 8
  { title: "Leader's Meeting", start: t('2026-08-08', '08:00:00'), location: 'Virtual' },

  // Tue Aug 11
  { title: 'Tuesday Fasting & Prayers', start: t('2026-08-11', '17:00:00'), location: 'Prayer Line' },
  // Wed Aug 12
  { title: 'Digging Deep', start: t('2026-08-12', '19:00:00') },
  // Sat Aug 15
  {
    title: 'Women Conference',
    start: t('2026-08-15', '00:00:00'),
    location: 'RCCG Jubilee Parish',
    featured: true,
  },

  // Sun Aug 16
  { title: 'Covenant Day of His Power', start: t('2026-08-16', '00:00:00') },
  // Tue Aug 18
  { title: 'Tuesday Fasting & Prayers', start: t('2026-08-18', '17:00:00'), location: 'Prayer Line' },
  // Wed Aug 19
  { title: 'Digging Deep', start: t('2026-08-19', '19:00:00') },

  // Mon Aug 24 — week-long, ending the following Sunday. Matches the existing
  // multi-day pattern used for "Royal Priesthood (Men's) Week".
  {
    title: 'The Covenant Vessels (YAYA) Week',
    start: t('2026-08-24', '00:00:00'),
    end: t('2026-08-30', '00:00:00'),
    desc: 'Youth and young adults (YAYA) week, concluding with YAYA Sunday.',
  },
  // Tue Aug 25
  { title: 'Tuesday Fasting & Prayers', start: t('2026-08-25', '17:00:00'), location: 'Prayer Line' },
  // Wed Aug 26
  { title: 'Holy Communion', start: t('2026-08-26', '19:00:00') },
  // Sat Aug 29
  { title: 'Food Outreach', start: t('2026-08-29', '10:00:00') },
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
    }
  }

  console.log(`\n✨  Done. ${written} created/updated, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
