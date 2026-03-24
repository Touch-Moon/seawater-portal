import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'News — SteinbachOnline'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(160deg, #0d0e10 0%, #141820 60%, #1a2030 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4aabf7, #8e54e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            S
          </div>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            SteinbachOnline
          </span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#ffffff', letterSpacing: -2, lineHeight: 1.1 }}>
          Local News
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)', marginTop: 16, fontWeight: 400 }}>
          Steinbach &amp; Southeast Manitoba — Breaking stories, sports, community
        </div>
      </div>
    ),
    { ...size },
  )
}
