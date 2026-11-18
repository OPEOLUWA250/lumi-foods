import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Premium Fresh Seafood`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#101820',
    icons: [{ src: '/favicon-l.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
