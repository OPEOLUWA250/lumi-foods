import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { FloatingActionButtons } from '@/components/floating-action-buttons'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LumiFoods - Premium Fresh Seafood',
  description: 'Discover the finest quality fresh seafood delivered to your doorstep. Premium fish, shrimp, crab, and shellfish from LumiFoods.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon-l.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/favicon-l.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <FloatingActionButtons />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
