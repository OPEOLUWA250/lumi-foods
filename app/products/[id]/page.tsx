import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductCard } from '@/components/product-card'
import { ProductDetail } from '@/components/product-detail'
import { products } from '@/lib/products'

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  }
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) notFound()

  // Same category first, topped up from the rest of the catalogue to fill a row.
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProductDetail product={product} />

        <section className="border-t border-neutral/10 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">You may also like</p>
                <h2 className="text-2xl font-bold text-neutral md:text-3xl">More from the catch</h2>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:inline-flex"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
