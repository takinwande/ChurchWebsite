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
          // The logo is a transparent PNG, so it can sit directly on brand
          // navy. (It was on white while the source was a JPEG with a baked-in
          // white ground, which would have shown as a hard box.)
          background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #142D55 55%, #0D1E38 100%)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri()} alt="" width={297} height={330} style={{ flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 21,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            The Redeemed Christian Church of God
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#FFFFFF',
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
              background: '#7994C8',
              marginTop: 28,
            }}
          />

          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.88)', marginTop: 28 }}>Avondale, Arizona</div>
          <div style={{ fontSize: 25, color: 'rgba(255,255,255,0.60)', marginTop: 10 }}>
            Sundays · 9:30 AM Sunday School · 10:00 AM Worship
          </div>
        </div>
      </div>
    ),
    size
  )
}
