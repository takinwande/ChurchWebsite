import { ImageResponse } from 'next/og'
import { getLogoDataUri, BRAND_NAVY } from '@/lib/brand-assets'

export const alt = 'RCCG Covenant Assembly — Avondale, Arizona'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '0 90px',
          gap: 70,
          // Light ground so the crest's own white background blends in. The
          // logo is rendered unaltered, so the layout adapts to it.
          background: '#FFFFFF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri()} alt="" width={330} height={330} style={{ flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 21,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#64748B',
            }}
          >
            The Redeemed Christian Church of God
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.05,
              color: BRAND_NAVY,
              marginTop: 16,
            }}
          >
            Covenant Assembly
          </div>

          <div
            style={{
              display: 'flex',
              width: 92,
              height: 6,
              borderRadius: 3,
              background: BRAND_NAVY,
              marginTop: 28,
            }}
          />

          <div style={{ fontSize: 32, color: '#1E293B', marginTop: 28 }}>Avondale, Arizona</div>
          <div style={{ fontSize: 25, color: '#64748B', marginTop: 10 }}>
            Sundays · 9:30 AM Sunday School · 10:00 AM Worship
          </div>
        </div>
      </div>
    ),
    size
  )
}
