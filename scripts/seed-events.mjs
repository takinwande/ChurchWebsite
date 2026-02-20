/**
 * Seed Events Script
 * ==================
 * Populates Sanity with all church calendar events for Feb–Apr 2026.
 *
 * Prerequisites:
 *   1. Generate a write-enabled API token at:
 *      https://sanity.io/manage/project/xp06ughl/api  →  Tokens  →  Add API Token
 *      Choose "Editor" permission level.
 *   2. Add to .env.local:
 *      SANITY_API_TOKEN=sk...your-token-here...
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-events.mjs
 *
 * Re-running the script is safe — it uses createOrReplace, so existing
 * documents are updated rather than duplicated.
 */

import { createClient } from '@sanity/client'

// ─── Sanity client ────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Run with --env-file=.env.local')
  process.exit(1)
}
if (!token) {
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

/** Convert a title + date string into a URL-safe slug */
function makeSlug(title, dateStr) {
  const datePart = dateStr.slice(0, 10) // "2026-02-01"
  return (title + '-' + datePart)
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Build a portable-text description block from a plain string.
 * Returns undefined if no text is provided (keeps the field clean).
 */
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

// All times are Arizona local time (MST = UTC-7, no daylight saving)
// Format: 'YYYY-MM-DDTHH:MM:SS-07:00'
const TZ = '-07:00'
const t = (date, time) => `${date}T${time}${TZ}`

// ─── Event data ───────────────────────────────────────────────────────────────

const events = [
  // ═══════════════════════════════════════════════════════════════
  //  FEBRUARY 2026
  // ═══════════════════════════════════════════════════════════════

  // Feb 1 — Global 30-Day Fasting & Prayers (spans to Mar 2)
  {
    title: 'Global 30-Day Fasting & Prayers',
    start: t('2026-02-01', '00:00:00'),
    end:   t('2026-03-02', '23:59:00'),
    desc:  'Corporate 30-day church-wide fasting and prayer period.',
    featured: true,
  },
  // Feb 1 — Covenant Hour of Prayer
  {
    title: 'Covenant Hour of Prayer',
    start: t('2026-02-01', '05:00:00'),
    location: 'Prayer Line',
    desc:  'Monthly Covenant Hour of Prayer on the church prayer line.',
  },
  // Feb 1 — Thanksgiving and Anointing Service
  {
    title: 'Thanksgiving and Anointing Service',
    start: t('2026-02-01', '10:00:00'),
  },
  // Feb 3 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-02-03', '17:00:00'), location: 'Prayer Line' },
  // Feb 4 — Digging Deep
  { title: 'Digging Deep', start: t('2026-02-04', '19:00:00') },
  // Feb 10 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-02-10', '17:00:00'), location: 'Prayer Line' },
  // Feb 11 — Digging Deep
  { title: 'Digging Deep', start: t('2026-02-11', '19:00:00') },
  // Feb 13 — Quarterly Holy Ghost Service
  {
    title: 'Quarterly Holy Ghost Service',
    start: t('2026-02-13', '19:00:00'),
    location: 'RCCG Throne of Grace',
    featured: true,
  },
  // Feb 14 — Regional Retreat
  {
    title: 'Regional Retreat',
    start: t('2026-02-14', '09:00:00'),
    location: 'RCCG Throne of Grace',
    featured: true,
  },
  // Feb 15 — Covenant Day of His Power
  {
    title: 'Covenant Day of His Power',
    start: t('2026-02-15', '10:00:00'),
    featured: true,
  },
  // Feb 17 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-02-17', '17:00:00'), location: 'Prayer Line' },
  // Feb 18 — Digging Deep
  { title: 'Digging Deep', start: t('2026-02-18', '19:00:00') },
  // Feb 24 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-02-24', '17:00:00'), location: 'Prayer Line' },
  // Feb 25 — Holy Communion
  { title: 'Holy Communion', start: t('2026-02-25', '19:00:00') },

  // ═══════════════════════════════════════════════════════════════
  //  MARCH 2026
  // ═══════════════════════════════════════════════════════════════

  // Mar 1 — Covenant Hour of Prayer + Thanksgiving and Anointing Service
  {
    title: 'Covenant Hour of Prayer',
    start: t('2026-03-01', '05:00:00'),
    location: 'Prayer Line',
  },
  {
    title: 'Thanksgiving and Anointing Service',
    start: t('2026-03-01', '10:00:00'),
  },
  // Mar 3 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-03-03', '17:00:00'), location: 'Prayer Line' },
  // Mar 4 — Digging Deep
  { title: 'Digging Deep', start: t('2026-03-04', '19:00:00') },
  // Mar 10 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-03-10', '17:00:00'), location: 'Prayer Line' },
  // Mar 11 — Digging Deep
  { title: 'Digging Deep', start: t('2026-03-11', '19:00:00') },
  // Mar 14 — Leader's Meeting (virtual) + Family Picnic
  {
    title: "Leader's Meeting",
    start: t('2026-03-14', '08:00:00'),
    location: 'Virtual',
    desc: 'Monthly leadership meeting held virtually.',
  },
  {
    title: 'Family Picnic',
    start: t('2026-03-14', '11:00:00'),
    featured: true,
  },
  // Mar 15 — Covenant Day of His Power
  {
    title: 'Covenant Day of His Power',
    start: t('2026-03-15', '10:00:00'),
    featured: true,
  },
  // Mar 17 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-03-17', '17:00:00'), location: 'Prayer Line' },
  // Mar 18 — Digging Deep
  { title: 'Digging Deep', start: t('2026-03-18', '19:00:00') },
  // Mar 20–22 — Family Life Conference
  {
    title: 'Family Life Conference',
    start: t('2026-03-20', '09:00:00'),
    end:   t('2026-03-22', '21:00:00'),
    desc: 'Three-day Family Life Conference — Day 3 is Family Sunday.',
    featured: true,
  },
  // Mar 23–29 — Royal Priesthood (Men's) Week
  {
    title: "Royal Priesthood (Men's) Week",
    start: t('2026-03-23', '09:00:00'),
    end:   t('2026-03-29', '21:00:00'),
    desc: "Week-long Royal Priesthood celebration for the men of the church, culminating in Royal Priesthood Sunday.",
    featured: true,
  },
  // Mar 24 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-03-24', '17:00:00'), location: 'Prayer Line' },
  // Mar 25 — Holy Communion
  { title: 'Holy Communion', start: t('2026-03-25', '19:00:00') },
  // Mar 28 — Food Outreach
  {
    title: 'Food Outreach',
    start: t('2026-03-28', '10:00:00'),
    desc: 'Community food outreach ministry.',
    featured: true,
  },
  // Mar 31 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-03-31', '17:00:00'), location: 'Prayer Line' },

  // ═══════════════════════════════════════════════════════════════
  //  APRIL 2026
  // ═══════════════════════════════════════════════════════════════

  // Apr 1 — Covenant Hour of Prayer + Digging Deep
  {
    title: 'Covenant Hour of Prayer',
    start: t('2026-04-01', '05:00:00'),
    location: 'Prayer Line',
  },
  { title: 'Digging Deep', start: t('2026-04-01', '19:00:00') },
  // Apr 3 — Good Friday
  {
    title: 'Good Friday',
    start: t('2026-04-03', '09:00:00'),
    featured: true,
  },
  // Apr 5 — Easter Sunday — Thanksgiving and Anointing Service
  {
    title: 'Easter Sunday — Thanksgiving and Anointing Service',
    start: t('2026-04-05', '10:00:00'),
    featured: true,
  },
  // Apr 7 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-04-07', '17:00:00'), location: 'Prayer Line' },
  // Apr 8 — Digging Deep
  { title: 'Digging Deep', start: t('2026-04-08', '19:00:00') },
  // Apr 11 — Leader's Meeting (virtual)
  {
    title: "Leader's Meeting",
    start: t('2026-04-11', '08:00:00'),
    location: 'Virtual',
    desc: 'Monthly leadership meeting held virtually.',
  },
  // Apr 14 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-04-14', '17:00:00'), location: 'Prayer Line' },
  // Apr 15 — Digging Deep
  { title: 'Digging Deep', start: t('2026-04-15', '19:00:00') },
  // Apr 19 — Covenant Day of His Power
  {
    title: 'Covenant Day of His Power',
    start: t('2026-04-19', '10:00:00'),
    featured: true,
  },
  // Apr 20–26 — Women of Praise (WOP) Week
  {
    title: 'Women of Praise (WOP) Week',
    start: t('2026-04-20', '09:00:00'),
    end:   t('2026-04-26', '21:00:00'),
    desc: 'Week-long Women of Praise celebration, culminating in WOP Sunday.',
    featured: true,
  },
  // Apr 21 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-04-21', '17:00:00'), location: 'Prayer Line' },
  // Apr 22 — Digging Deep
  { title: 'Digging Deep', start: t('2026-04-22', '19:00:00') },
  // Apr 25 — Food Outreach
  {
    title: 'Food Outreach',
    start: t('2026-04-25', '10:00:00'),
    desc: 'Community food outreach ministry.',
    featured: true,
  },
  // Apr 28 — Tuesday Fasting & Prayers
  { title: 'Tuesday Fasting & Prayers', start: t('2026-04-28', '17:00:00'), location: 'Prayer Line' },
  // Apr 29 — Holy Communion
  { title: 'Holy Communion', start: t('2026-04-29', '19:00:00') },
]

// ─── Build Sanity documents ───────────────────────────────────────────────────

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
  if (event.end)      doc.endDateTime = event.end
  if (event.location) doc.location    = event.location
  if (event.desc)     doc.description = desc(event.desc)
  return doc
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱  Seeding ${events.length} events into Sanity (project: ${projectId})…\n`)

  let created = 0
  let failed  = 0

  for (const event of events) {
    const doc = buildDocument(event)
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${doc.title}  (${event.start.slice(0, 10)})`)
      created++
    } catch (err) {
      console.error(`  ❌  ${doc.title}  — ${err.message}`)
      failed++
    }
  }

  console.log(`\n✨  Done. ${created} created/updated, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
