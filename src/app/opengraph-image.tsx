import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SteinbachOnline — Local News, Weather & Events'
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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d0e10 0%, #1a1c20 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 32,
          }}
        >
          {/* Icon mark */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4aabf7 0%, #8e54e9 50%, #e91e8c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              color: '#fff',
              fontWeight: 900,
            }}
          >
            S
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 42, fontWeight: 900, color: '#ffffff', letterSpacing: -1 }}>
              SteinbachOnline
            </span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>
              steinbachonline.com
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.72)',
            fontWeight: 400,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Local News, Weather &amp; Events for Steinbach, Manitoba
        </div>

        {/* Category pills */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 40,
          }}
        >
          {['News', 'Weather', 'Events', 'Listen', 'Directory'].map((label) => (
            <div
              key={label}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
