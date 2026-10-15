import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', background: '#050505', color: '#f7f7f7', padding: '80px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', color: '#a855f7', fontSize: 28, marginBottom: 36 }}>EXTROPY · POPRAD, SLOVAKIA</div>
      <div style={{ display: 'flex', fontSize: 88, fontWeight: 700, letterSpacing: -4 }}>Kristian Duda</div>
      <div style={{ display: 'flex', fontSize: 38, marginTop: 24 }}>Full-stack Product Builder</div>
      <div style={{ display: 'flex', fontSize: 26, color: '#979797', marginTop: 16 }}>AI-assisted Development &amp; Integrations</div>
      <div style={{ display: 'flex', fontSize: 26, color: '#979797', marginTop: 56 }}>kd.extropy.sk</div>
    </div>,
    { width: 1200, height: 630 },
  )
}
