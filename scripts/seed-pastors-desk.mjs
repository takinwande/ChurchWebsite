/**
 * Seed Pastor's Desk Script
 * =========================
 * Seeds 5 "Covenant Word" posts to Sanity.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-pastors-desk.mjs
 *
 * Re-running is safe — createOrReplace is idempotent.
 */

import { createClient } from '@sanity/client'

// ─── Sanity client ─────────────────────────────────────────────────────────────

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

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** URL-safe slug from a string */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Build a single portable-text paragraph block */
function block(key, text) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
    markDefs: [],
  }
}

// ─── Posts ─────────────────────────────────────────────────────────────────────

const posts = [
  {
    title: 'Covenant Word \u2013 The Big Plan',
    date: '2025-06-24',
    scripture: 'Jeremiah 1:4-5 (NKJV)',
    body: [
      block(
        'bp1',
        'Humans represent God\u2019s greatest creation project, warranting careful divine planning. God convened a meeting specifically to design humanity, indicating intentionality behind each person\u2019s existence.',
      ),
      block(
        'bp2',
        'God establishes purpose for individuals before birth. Using Prophet Jeremiah as an example, divine calling precedes human awareness or capability. Parental responsibility includes prayerfully supporting children in discovering God\u2019s predetermined purpose.',
      ),
      block(
        'bp3',
        'The teaching references Rebekah\u2019s spiritual discernment regarding Jacob and Esau, illustrating parental duty in recognizing divine distinction. Fulfilling God\u2019s plan may require patience \u2014 Joseph waited fourteen years and David over twenty years before realizing their destinies.',
      ),
      block(
        'bp4',
        'God empowered Jeremiah despite his self-doubt, assuring us that divine enablement accompanies divine calling.',
      ),
      block(
        'bp5',
        '\u201cWe will act our script better if we allow the Writer to be the Director.\u201d',
      ),
    ],
    confession: 'I will accomplish God\u2019s big plan for my life.',
    prayer: 'Father, please touch my life and enable me to accomplish your purpose.',
    furtherReading: 'Jeremiah 1:19',
  },
  {
    title: 'Covenant Word \u2013 The Big Deal',
    date: '2025-06-24',
    scripture: 'Luke 10:17-21 (NKJV)',
    body: [
      block(
        'bd1',
        'The seventy disciples successfully cast out demons and won souls, causing excitement among both themselves and Jesus. However, Jesus emphasizes an important distinction: while exercising spiritual authority represents \u201ca big deal,\u201d the ultimate significance lies elsewhere.',
      ),
      block(
        'bd2',
        'The core teaching centers on prioritizing relationship with God over accomplishments. Jesus cautions them not to become prideful about their miraculous works. He references Matthew 7:21-23, where many will claim to have prophesied and cast out demons in His name, yet Jesus will declare He never knew them.',
      ),
      block(
        'bd3',
        'Good work will not be a substitute for holy living. What we know will not be as important as Who knows us. Having one\u2019s name written in heaven \u2014 indicating genuine salvation and relationship with God \u2014 constitutes THE BIG DEAL.',
      ),
    ],
    confession: 'I am a child of God. My name is written in heaven, by His grace.',
    prayer: 'Father, please do not cast me away from your presence.',
    furtherReading: 'Matthew 7:13-23',
  },
  {
    title: 'Covenant Word \u2013 The Inevitable Appointment',
    date: '2025-06-24',
    scripture: 'Hebrews 9:27-28 (TPT)',
    body: [
      block(
        'ia1',
        'Death represents life\u2019s sole certainty \u2014 an unavoidable appointment controlled exclusively by God. The timing remains unknowable regardless of age, wealth, or health status.',
      ),
      block(
        'ia2',
        'The only thing we can do about the inevitable appointment is to prepare daily to meet our God.',
      ),
      block(
        'ia3',
        'There are two potential post-death outcomes: eternal communion with the Creator for those whose names appear in the Book of Life, or eternal separation in the lake of fire for others. While humans cannot control death\u2019s timing, they can influence their spiritual destination.',
      ),
      block(
        'ia4',
        '\u201cWhat will be your last activity on earth? Do your best to make every moment as if it will be your last.\u201d',
      ),
    ],
    confession: 'I will not miss the blissful place prepared for me.',
    prayer: 'Father, please don\u2019t let me be unprepared for my inevitable appointment, when the time comes.',
    furtherReading: 'Mark 8:34-38',
  },
  {
    title: 'Covenant Word \u2013 The Pursuit of God: Seeking the Face of God I',
    date: '2025-06-24',
    scripture: '2 Chronicles 7:14-15 (NKJV)',
    body: [
      block(
        'sf1',
        'Seeking the face of God implies pursuing a close and personal relationship with God and seeking to abide in His presence continually.',
      ),
      block(
        'sf2',
        'The key distinction is between seeking God\u2019s gifts versus seeking God Himself. Abraham\u2019s willingness to sacrifice Isaac (the gift) demonstrated that God, the Giver, held supreme importance. Jacob\u2019s encounter at Peniel \u2014 where he saw God\u2019s face \u2014 shows that the blessings follow the relationship.',
      ),
      block(
        'sf3',
        'Seeking God\u2019s face also means seeking His way and His kingdom with righteousness, as Matthew 6:33 instructs.',
      ),
      block(
        'sf4',
        '\u201cSeek the face of God rather than His hand. If you get the face, He will give you His hand.\u201d',
      ),
    ],
    confession: 'I will seek the face of the Lord all the days of my life and I will enjoy the blessings of His hand.',
    prayer: 'Father, please show me your face!',
    furtherReading: 'Psalm 27:1-14',
  },
  {
    title: 'Covenant Word \u2013 The Pursuit of God: Living by His Word V',
    date: '2025-06-24',
    scripture: 'Matthew 4 (NKJV)',
    body: [
      block(
        'lw1',
        'The word of God is the inspiration of God, and therefore cannot be separated from God. This includes Jesus Christ (John 1:1-3) and both written and spoken forms.',
      ),
      block(
        'lw2',
        'God\u2019s word possesses creative power, as demonstrated in Genesis\u2019s creation account. It provides spiritual life and sustenance (John 6:63) and equips believers toward spiritual maturity (2 Timothy 3:16-17).',
      ),
      block(
        'lw3',
        'Scripture cleanses and sanctifies followers (Ephesians 5:26; John 15:3; John 17:17). Memorizing Scripture protects against sin (Psalm 119:11; Psalm 119:9).',
      ),
      block(
        'lw4',
        'A troubling trend: many modern Christians reject sound doctrine, preferring messages that please them rather than challenge them \u2014 exhibiting \u201citching ears\u201d as described in 2 Timothy 4:3.',
      ),
    ],
    confession: 'I will live by your word, all the days of my life.',
    prayer: 'Father, please help me to always abide by your word.',
    furtherReading: 'Psalm 19:7-11',
  },
]

// ─── Run ───────────────────────────────────────────────────────────────────────

async function main() {
  let failed = 0

  console.log("\n\u270d\ufe0f  Seeding Pastor's Desk posts\u2026")

  for (const post of posts) {
    const slug = slugify(post.title)
    const doc = {
      _type: 'pastorsDesk',
      _id: `pastors-desk-${slug}`,
      title: post.title,
      slug: { _type: 'slug', current: slug },
      date: post.date,
      scripture: post.scripture,
      body: post.body,
      confession: post.confession,
      prayer: post.prayer,
      furtherReading: post.furtherReading,
    }
    try {
      await client.createOrReplace(doc)
      console.log(`  \u2705  ${post.title}`)
    } catch (err) {
      console.error(`  \u274c  ${post.title} \u2014 ${err.message}`)
      failed++
    }
  }

  console.log(`\n\u2728  Done.${failed > 0 ? ` ${failed} item(s) failed.` : ' All succeeded.'}\n`)
  if (failed > 0) process.exit(1)
}

main()
