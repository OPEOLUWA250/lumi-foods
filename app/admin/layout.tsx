import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lumie’s Foods Admin',
  description: 'Private Lumie’s Foods store operations dashboard.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
