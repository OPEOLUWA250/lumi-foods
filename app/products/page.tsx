import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ShopView } from '@/components/shop-view'
import { resolveCategory } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Shop Fresh Seafood',
  description: 'Browse premium fish, shrimp, crab and shellfish from Lumie’s Foods, delivered fresh to your door.',
}

type SearchParams = Promise<{ category?: string | string[]; q?: string | string[] }>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const category = resolveCategory(first(params.category))
  const query = first(params.q)?.slice(0, 80) ?? ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Keyed so header links (?category=Crab) re-seed the filters even when already on /products */}
        <ShopView key={`${category ?? 'all'}|${query}`} initialCategory={category} initialQuery={query} />
      </main>
      <Footer />
    </>
  )
}
