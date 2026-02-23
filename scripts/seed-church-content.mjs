/**
 * Seed Church Content Script
 * ==========================
 * Populates Sanity with:
 *   A) aboutPage — mission, vision, core beliefs (5 pillars), leadership
 *   B) ministry documents — 8 ministry groups
 *   C) siteSettings serviceTimes — full weekly schedule
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-church-content.mjs
 *
 * Re-running is safe — createOrReplace is idempotent.
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a portable-text block with an optional bold heading prefix */
function pillarBlock(key, heading, body) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [
      { _type: 'span', _key: `${key}-h`, text: heading + ' — ', marks: ['strong'] },
      { _type: 'span', _key: `${key}-b`, text: body, marks: [] },
    ],
    markDefs: [],
  }
}

/** URL-safe slug from a string */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── A) About Page ────────────────────────────────────────────────────────────

const aboutDoc = {
  _type: 'aboutPage',
  _id: 'aboutPage',
  mission:
    'To be the light of the world by taking the message of love of Jesus Christ to the ends of the world.',
  vision:
    'To build Christ\'s body, raise generations serving as the world\'s light, and prepare people to walk in covenant with God through obedience and faith — reaching people of all backgrounds and extending our influence beyond our physical building.',
  beliefs: [
    pillarBlock(
      'pillar1',
      'Covenant with God',
      'A commitment to lifelong obedience and walking with God to guarantee eternity.',
    ),
    pillarBlock(
      'pillar2',
      'True Worship',
      'Worshipping "in Spirit and in truth" in an atmosphere of love, grace, and faith (John 4:23).',
    ),
    pillarBlock(
      'pillar3',
      'Service',
      'Members are "saved to serve," with responsibility toward both spiritual and physical community needs.',
    ),
    pillarBlock(
      'pillar4',
      'Fellowship & Friendship',
      'Expressing genuine Godly love toward one another as Christ commanded.',
    ),
    pillarBlock(
      'pillar5',
      'Empowerment',
      'Functioning as a training ground for success and fulfilling destiny through God\'s word.',
    ),
  ],
  leadership: [
    { _key: 'leader1', name: 'Pastor Timothy Olorunfemi', title: 'Lead Pastor' },
    { _key: 'leader2', name: 'Pastor Janet Olorunfemi',  title: 'Co-Pastor'   },
  ],
}

// ─── B) Ministry Documents ────────────────────────────────────────────────────

const ministries = [
  {
    order: 1,
    name: 'The Royal Priesthood',
    tagline: 'Men of honor, integrity, and faith',
    description:
      'Men who walk in God\'s covenant to support the work of God. Hand-lifters and men of valor providing leadership support as leaders, husbands, and fathers.',
  },
  {
    order: 2,
    name: 'Women of Praise',
    tagline: 'Empowering women and girls to fulfill their destinies',
    description:
      'A ministry focused on mothers and women of God, helping to empower women and girls. Members teach younger women about responsible motherhood and wifehood.',
  },
  {
    order: 3,
    name: 'The Chosen Vessels',
    tagline: 'Youth and singles empowered for purpose',
    description:
      'Youth and singles ministry organizing workshops, trainings, and seminars to help young adults realize their potential and fulfill their destinies.',
  },
  {
    order: 4,
    name: 'The Chosen Generation',
    tagline: 'Preparing teenagers for their future',
    description:
      'Prepares teenagers spiritually, mentally, and academically for their future careers and ministries. A leadership and family training ground.',
  },
  {
    order: 5,
    name: "The King's Heritage",
    tagline: 'Nurturing children in the faith',
    description:
      'Focuses on the spiritual development of children and their preparation for their God-given future.',
  },
  {
    order: 6,
    name: 'Covenant Couples and Families',
    tagline: 'Building Godly homes',
    description:
      'Prepares individuals to build Godly homes and fosters love and Christian virtues in marriages through workshops and training.',
  },
  {
    order: 7,
    name: 'Outreach',
    tagline: 'Meeting community needs through action',
    description:
      'Mobilizes congregants to meet physical community needs including food distribution, clothing assistance, medical services, and school supply provision.',
  },
]

// ─── C) Social Links ──────────────────────────────────────────────────────────

const socialLinks = {
  facebook:  'https://www.facebook.com/CovenantAssemblyAZ',
  instagram: 'https://www.instagram.com/covenantassemblyrccg',
  youtube:   'https://www.youtube.com/@rccgcovenantassemblyavonda5028',
  tiktok:    'https://www.tiktok.com/@covenantassemblyaz',
}

// ─── D) Service Times ─────────────────────────────────────────────────────────

const serviceTimes = [
  { _key: 'st1', name: 'Fresh Oil Service',            day: 'Sunday',     time: '9:00 AM'  },
  { _key: 'st2', name: 'Sunday School',                day: 'Sunday',     time: '9:30 AM'  },
  { _key: 'st3', name: 'Sunday Worship',               day: 'Sunday',     time: '10:00 AM' },
  { _key: 'st4', name: 'Bible Study (Digging Deep)',   day: 'Wednesday',  time: '7:00 PM'  },
]

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  let failed = 0

  // ── A) About page ──
  console.log('\n📖  Seeding About page…')
  try {
    await client.createOrReplace(aboutDoc)
    console.log('  ✅  aboutPage — mission, vision, 5 beliefs, 2 leaders')
  } catch (err) {
    console.error(`  ❌  aboutPage — ${err.message}`)
    failed++
  }

  // ── B) Ministries ──
  console.log('\n⛪  Seeding 8 ministries…')
  for (const m of ministries) {
    const slug = slugify(m.name)
    const doc = {
      _type: 'ministry',
      _id: `ministry-${slug}`,
      name: m.name,
      slug: { _type: 'slug', current: slug },
      tagline: m.tagline,
      description: m.description,
      order: m.order,
    }
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${m.name}`)
    } catch (err) {
      console.error(`  ❌  ${m.name} — ${err.message}`)
      failed++
    }
  }

  // ── C/D) Social links + service times ──
  console.log('\n📱  Updating social links and service times in siteSettings…')
  try {
    const existing = await client.fetch("*[_type == 'siteSettings'][0]{ _id }")
    if (existing?._id) {
      // Patch existing document — preserve all other fields
      await client.patch(existing._id).set({ serviceTimes, socialLinks }).commit()
      console.log(`  ✅  siteSettings patched — ${serviceTimes.length} service times and social links updated`)
    } else {
      // No siteSettings doc yet — create one with full church info
      await client.createOrReplace({
        _type: 'siteSettings',
        _id: 'siteSettings',
        name: 'RCCG Covenant Assembly',
        tagline: 'Covenant: Key to God\'s Word and God\'s Ways',
        address: {
          street: '755 North 114th Avenue',
          city: 'Avondale',
          state: 'AZ',
          zip: '85323',
        },
        phone: '6234195650',
        email: 'admin@covenantassembly.org',
        socialLinks,
        serviceTimes,
      })
      console.log(`  ✅  siteSettings created — ${serviceTimes.length} service times set`)
    }
  } catch (err) {
    console.error(`  ❌  siteSettings — ${err.message}`)
    failed++
  }

  console.log(`\n✨  Done.${failed > 0 ? ` ${failed} item(s) failed.` : ' All succeeded.'}\n`)
  if (failed > 0) process.exit(1)
}

main()
