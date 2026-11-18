import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LumiFoods Admin',
  description: 'Private LumiFoods store operations dashboard.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
