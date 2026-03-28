'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { CartDrawer } from '@/components/cart-drawer'
import { Footer } from '@/components/footer'
import { products } from '@/lib/products'

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const featuredProducts = products.slice(0, 6)

  return (
    <main className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Premium Selection
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Featured Seafood Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Handpicked premium seafood delivered fresh to your doorstep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Fresh & Premium</h3>
              <p className="text-muted-foreground">
                Sourced from the best fishing waters around the world, guaranteed freshness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery right to your doorstep with proper cold chain handling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Sustainable</h3>
              <p className="text-muted-foreground">
                Committed to sustainable fishing practices and environmental conservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">
            Ready to Taste the Difference?
          </h2>
          <p className="text-lg opacity-90 text-balance">
            Explore our complete collection of premium fresh seafood and place your order today.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Shopping
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
