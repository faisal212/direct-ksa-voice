// app/opengraph-image.tsx
// File-based OG image — Next.js auto-serves at /opengraph-image and injects og:image tags

import { ImageResponse } from 'next/og'
import { brand } from '@/lib/brand'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  const accentColor = brand.color
  const primary = brand.name.replace(brand.nameAccent, '').trim()
  const accent = brand.nameAccent
  const arabic = brand.nameAr

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1200 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Radial glow behind brand name */}
        <div
          style={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            display: 'flex',
            gap: 16,
          }}
        >
          <span>{primary}</span>
          <span style={{ color: accentColor }}>{accent}</span>
        </div>

        {/* Arabic name */}
        <div style={{ fontSize: 32, color: '#888888', marginTop: 8, display: 'flex' }}>
          {arabic}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 26, color: '#aaaaaa', marginTop: 28, display: 'flex' }}>
          AI Customer Experience Suite
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
