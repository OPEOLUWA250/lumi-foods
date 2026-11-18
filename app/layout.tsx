import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { FloatingActionButtons } from '@/components/floating-action-buttons'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import './globals.css'

// Self-hosted at build time by next/font, so the type renders identically on
// Windows, macOS, iOS and Android with no runtime request to Google.
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

// Absolute base for Open Graph / Twitter image URLs. Set NEXT_PUBLIC_SITE_URL
// to the live domain; on Vercel the production URL is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Premium Fresh Seafood`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_NG', description: SITE_DESCRIPTION },
  twitter: { card: 'summary_large_image' },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/favicon-l.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#101820',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${outfit.variable}`}>
      <body>
        <CartProvider>
          {children}
          <FloatingActionButtons />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
