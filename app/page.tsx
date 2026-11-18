import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, MessageCircle, Snowflake, Sparkles } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import { ProductCard } from '@/components/product-card'
import { categoryHref, products, shopCategories } from '@/lib/products'

const FEATURED_IDS = [
  'salmon-001',
  'shrimp-large-001',
  'crab-king-001',
  'scallop-001',
  'sea-bass-001',
  'crab-blue-001',
  'oyster-001',
  'shrimp-vannamei-001',
]
const featuredProducts = FEATURED_IDS.flatMap((id) => products.filter((p) => p.id === id))

const CATEGORY_IMAGES: Record<string, string> = {
  Fish: '/images/salmon.jpg',
  Shrimp: '/images/shrimp-jumbo.jpg',
  Crab: '/images/crab-king.jpg',
  Shellfish: '/images/oysters.jpg',
}

const promises = [
  { icon: Sparkles, title: 'Fresh & premium', copy: 'Sourced from the best fishing waters' },
  { icon: Snowflake, title: 'Cold-chain delivery', copy: 'Handled cold, door to door' },
  { icon: Leaf, title: 'Sustainable', copy: 'Responsible fishing practices' },
  { icon: MessageCircle, title: 'Order on WhatsApp', copy: 'Confirmed by a real person' },
]

const steps = [
  { number: '01', title: 'Build your bag', copy: 'Browse the catch and add what you need — prices and pack sizes are shown up front.' },
  { number: '02', title: 'Checkout on WhatsApp', copy: 'Enter your delivery details and WhatsApp opens with your full order pre-filled.' },
  { number: '03', title: 'We confirm & deliver', copy: 'Our team confirms availability, delivery fee and payment, then delivers it fresh.' },
]

const eyebrow = 'mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background">
        <Hero />

        {/* Promise strip */}
        <section aria-label="Why Lumie’s Foods" className="border-b border-neutral/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {promises.map(({ icon: Icon, title, copy }, i) => (
              <div
                key={title}
                className={[
                  'flex items-start gap-3 px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
                  i % 2 === 0 ? 'border-r border-neutral/10' : '',
                  i < 2 ? 'border-b border-neutral/10 lg:border-b-0' : '',
                  i === 1 ? 'lg:border-r' : '',
                ].join(' ')}
              >
                <Icon size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral sm:text-sm">{title}</p>
                  <p className="mt-1 text-xs text-neutral/55 sm:text-sm">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop by category */}
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-10">
              <p className={eyebrow}>Browse</p>
              <h2 className="text-3xl font-bold text-neutral md:text-4xl">Shop by category</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {shopCategories.map((category) => {
                const count = products.filter((p) => p.category === category).length
                return (
                  <Link key={category} href={categoryHref(category)} className="group product-photo relative block aspect-[4/5] overflow-hidden bg-tertiary">
                    <Image
                      src={CATEGORY_IMAGES[category] ?? '/placeholder.jpg'}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-2 p-4 text-white sm:p-5">
                      <div>
                        <p className="text-lg font-bold sm:text-2xl">{category}</p>
                        <p className="mt-0.5 text-xs text-white/75 sm:text-sm">{count} products</p>
                      </div>
                      <span className="flex size-9 shrink-0 items-center justify-center bg-white text-primary transition group-hover:translate-x-0.5 sm:size-10">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="border-t border-neutral/10 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <div>
                <p className={eyebrow}>Premium selection</p>
                <h2 className="text-3xl font-bold text-neutral md:text-4xl">Featured seafood</h2>
              </div>
              <Link href="/products" className="hidden items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:inline-flex">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border border-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-primary hover:text-white"
              >
                View all products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* How ordering works */}
        <section id="how-it-works" className="border-t border-neutral/10 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-xl md:mb-10">
              <p className={eyebrow}>How to order</p>
              <h2 className="text-3xl font-bold text-neutral md:text-4xl">Fresh seafood in three steps</h2>
            </div>
            <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
              {steps.map((step) => (
                <li key={step.number} className="border border-neutral/10 bg-white p-6 md:p-8">
                  <span className="text-4xl font-light tracking-tight text-primary/30">{step.number}</span>
                  <h3 className="mt-5 text-lg font-bold text-neutral">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral/60">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
