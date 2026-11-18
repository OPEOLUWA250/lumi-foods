import { ImageResponse } from 'next/og'

// iOS ignores SVG touch icons, so the home-screen icon is rendered to PNG.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#101820', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 62, top: 45, width: 22, height: 90, background: '#FFFFFF' }} />
        <div style={{ position: 'absolute', left: 62, top: 113, width: 62, height: 22, background: '#FFFFFF' }} />
      </div>
    ),
    size,
  )
}
