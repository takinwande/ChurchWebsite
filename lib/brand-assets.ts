import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Brand navy — mirrors `--primary` in its light-mode form. */
export const BRAND_NAVY = '#1B3B6F'

let cachedLogo: string | null = null

/**
 * The church logo as a data URI, readable by next/og at render time.
 *
 * Served exactly as authored — the crest is not cropped, recoloured or
 * otherwise altered. Anything rendering it should adapt around the logo
 * rather than the other way round.
 */
export function getLogoDataUri(): string {
  if (!cachedLogo) {
    const bytes = readFileSync(join(process.cwd(), 'public', 'logo.jpg'))
    cachedLogo = `data:image/jpeg;base64,${bytes.toString('base64')}`
  }
  return cachedLogo
}
