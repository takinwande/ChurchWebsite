/**
 * Seed Test Images Script
 * =======================
 * Uploads placeholder images to Sanity and wires them up to:
 *   A) siteSettings.heroImages — 5 landscape slides for the homepage carousel
 *   B) Two test galleryAlbum documents — so the /gallery page has content to show
 *
 * Uses picsum.photos (Lorem Picsum) — free, no auth required, deterministic URLs.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-test-images.mjs
 *
 * Safe to re-run — existing test assets are replaced idempotently.
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

/** Download an image from a URL and upload it to Sanity. Returns the asset ref. */
async function uploadFromUrl(url, filename) {
  process.stdout.write(`    ⬆️  Uploading ${filename} …`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  console.log(' done')
  return { _type: 'reference', _ref: asset._id }
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ─── A) Hero carousel images ──────────────────────────────────────────────────
// 5 wide landscape photos (1920×1080). Picsum seed keeps them deterministic.

const heroSeeds = [
  { seed: 'church1', alt: 'Community gathering' },
  { seed: 'church2', alt: 'Worship service'      },
  { seed: 'church3', alt: 'Sunday congregation'  },
  { seed: 'church4', alt: 'Praise and worship'   },
  { seed: 'church5', alt: 'Fellowship moment'    },
]

// ─── B) Test gallery albums ────────────────────────────────────────────────────

const testAlbums = [
  {
    id:    'test-album-community-day-2025',
    title: 'Community Day 2025',
    date:  '2025-06-15',
    description: 'A wonderful day of fellowship, food, and fun with the Covenant Assembly community.',
    photoSeeds: ['cd1','cd2','cd3','cd4','cd5','cd6','cd7','cd8'],
  },
  {
    id:    'test-album-christmas-service-2024',
    title: 'Christmas Service 2024',
    date:  '2024-12-25',
    description: 'Celebrating the birth of Christ with carols, candles, and community.',
    photoSeeds: ['xm1','xm2','xm3','xm4','xm5','xm6'],
  },
]

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  let failed = 0

  // ── A) Hero carousel ──
  console.log('\n🖼️  Uploading hero carousel images…')
  try {
    const heroImages = []
    for (const { seed, alt } of heroSeeds) {
      const url = `https://picsum.photos/seed/${seed}/1920/1080`
      const assetRef = await uploadFromUrl(url, `hero-${seed}.jpg`)
      heroImages.push({
        _key: `hero-${seed}`,
        _type: 'image',
        alt,
        asset: assetRef,
      })
    }

    const existing = await client.fetch("*[_type == 'siteSettings'][0]{ _id }")
    if (existing?._id) {
      await client.patch(existing._id).set({ heroImages }).commit()
      console.log(`  ✅  siteSettings.heroImages — ${heroImages.length} slides set`)
    } else {
      console.warn('  ⚠️  No siteSettings document found — run the main seed script first.')
    }
  } catch (err) {
    console.error(`  ❌  Hero images — ${err.message}`)
    failed++
  }

  // ── B) Gallery albums ──
  console.log('\n📸  Creating test gallery albums…')
  for (const album of testAlbums) {
    try {
      console.log(`\n  Album: "${album.title}"`)

      // Upload cover (first seed, square crop)
      const coverUrl = `https://picsum.photos/seed/${album.photoSeeds[0]}/800/600`
      const coverRef = await uploadFromUrl(coverUrl, `${album.id}-cover.jpg`)

      // Upload all photos (square thumbnails)
      const photos = []
      for (let i = 0; i < album.photoSeeds.length; i++) {
        const seed = album.photoSeeds[i]
        const url = `https://picsum.photos/seed/${seed}/1200/900`
        const assetRef = await uploadFromUrl(url, `${album.id}-photo-${i + 1}.jpg`)
        photos.push({
          _key: `photo-${seed}`,
          _type: 'image',
          alt: `${album.title} — photo ${i + 1}`,
          asset: assetRef,
        })
      }

      await client.createOrReplace({
        _type: 'galleryAlbum',
        _id: album.id,
        title: album.title,
        slug: { _type: 'slug', current: slugify(album.title) },
        date: album.date,
        description: album.description,
        coverImage: { _type: 'image', asset: coverRef },
        photos,
      })

      console.log(`  ✅  "${album.title}" — ${photos.length} photos`)
    } catch (err) {
      console.error(`  ❌  "${album.title}" — ${err.message}`)
      failed++
    }
  }

  console.log(`\n✨  Done.${failed > 0 ? ` ${failed} item(s) failed.` : ' All succeeded.'}\n`)
  if (failed > 0) process.exit(1)
}

main()
